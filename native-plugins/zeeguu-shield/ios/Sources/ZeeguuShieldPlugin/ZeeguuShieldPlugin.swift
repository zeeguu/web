import Foundation
import SwiftUI
import UIKit
import Capacitor
import FamilyControls
import ManagedSettings

/// Shields apps the learner finds distracting (Aiki mode), via Apple's Screen
/// Time API. Needs the Family Controls entitlement and iOS 16.
///
/// The learner picks the apps with Apple's own picker; we never learn which
/// apps they are, only opaque tokens, which we keep on the device. While the
/// shield is on, opening one of those apps shows Apple's shield screen instead.
///
/// Spike scope: authorize, pick apps, shield on/off. The branded shield and the
/// earn-a-break timing come later (docs/future-work/anti-procrastination-mode.md).
@objc(ZeeguuShieldPlugin)
public class ZeeguuShieldPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "ZeeguuShieldPlugin"
    public let jsName = "ZeeguuShield"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "getStatus", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "requestAuthorization", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "presentAppPicker", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "applyShield", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "removeShield", returnType: CAPPluginReturnPromise)
    ]

    private static let selectionKey = "zeeguuShield.selection"
    private static let activeKey = "zeeguuShield.active"

    private func unsupported(_ call: CAPPluginCall) -> Bool {
        if #available(iOS 16.0, *) { return false }
        call.reject("Needs iOS 16", "UNSUPPORTED")
        return true
    }

    @objc func getStatus(_ call: CAPPluginCall) {
        guard #available(iOS 16.0, *) else {
            call.resolve(["supported": false])
            return
        }
        var result = Self.describe(Self.loadSelection())
        result["supported"] = true
        result["authorization"] = Self.describe(AuthorizationCenter.shared.authorizationStatus)
        result["shieldActive"] = UserDefaults.standard.bool(forKey: Self.activeKey)
        call.resolve(result)
    }

    @objc func requestAuthorization(_ call: CAPPluginCall) {
        guard #available(iOS 16.0, *) else { _ = unsupported(call); return }
        Task { @MainActor in
            do {
                try await AuthorizationCenter.shared.requestAuthorization(for: .individual)
            } catch {
                // Declining also lands here; report the status rather than fail.
                CAPLog.print("ZeeguuShield: authorization failed: \(error)")
            }
            call.resolve(["authorization": Self.describe(AuthorizationCenter.shared.authorizationStatus)])
        }
    }

    @objc func presentAppPicker(_ call: CAPPluginCall) {
        guard #available(iOS 16.0, *) else { _ = unsupported(call); return }
        Task { @MainActor in
            // Without approved authorization the picker shows its categories
            // but no apps in them. Asking again right before presenting is the
            // workaround reported on the developer forums (thread 706524).
            try? await AuthorizationCenter.shared.requestAuthorization(for: .individual)
            guard AuthorizationCenter.shared.authorizationStatus == .approved else {
                call.reject("Screen Time access not granted", "NOT_AUTHORIZED")
                return
            }
            let picker = PickerView(initial: Self.loadSelection() ?? FamilyActivitySelection()) { picked in
                self.bridge?.viewController?.dismiss(animated: true)
                guard let picked = picked else {
                    call.resolve(["cancelled": true])
                    return
                }
                Self.saveSelection(picked)
                // Picking new apps while shielded should shield the new ones.
                if UserDefaults.standard.bool(forKey: Self.activeKey) { Self.shield(picked) }
                call.resolve(Self.describe(picked))
            }
            self.bridge?.viewController?.present(UIHostingController(rootView: picker), animated: true)
        }
    }

    @objc func applyShield(_ call: CAPPluginCall) {
        guard #available(iOS 16.0, *) else { _ = unsupported(call); return }
        guard let selection = Self.loadSelection() else {
            call.reject("No apps picked yet", "NO_SELECTION")
            return
        }
        Self.shield(selection)
        UserDefaults.standard.set(true, forKey: Self.activeKey)
        call.resolve()
    }

    @objc func removeShield(_ call: CAPPluginCall) {
        guard #available(iOS 16.0, *) else { _ = unsupported(call); return }
        ManagedSettingsStore().clearAllSettings()
        UserDefaults.standard.set(false, forKey: Self.activeKey)
        call.resolve()
    }

    // MARK: - Helpers

    @available(iOS 16.0, *)
    private static func shield(_ selection: FamilyActivitySelection) {
        let store = ManagedSettingsStore()
        store.shield.applications = selection.applicationTokens.isEmpty ? nil : selection.applicationTokens
        store.shield.applicationCategories = selection.categoryTokens.isEmpty
            ? nil : .specific(selection.categoryTokens)
        store.shield.webDomains = selection.webDomainTokens.isEmpty ? nil : selection.webDomainTokens
    }

    @available(iOS 16.0, *)
    private static func loadSelection() -> FamilyActivitySelection? {
        guard let data = UserDefaults.standard.data(forKey: selectionKey) else { return nil }
        return try? JSONDecoder().decode(FamilyActivitySelection.self, from: data)
    }

    @available(iOS 16.0, *)
    private static func saveSelection(_ selection: FamilyActivitySelection) {
        if let data = try? JSONEncoder().encode(selection) {
            UserDefaults.standard.set(data, forKey: selectionKey)
        }
    }

    @available(iOS 16.0, *)
    private static func describe(_ selection: FamilyActivitySelection?) -> [String: Any] {
        return [
            "apps": selection?.applicationTokens.count ?? 0,
            "categories": selection?.categoryTokens.count ?? 0,
            "webDomains": selection?.webDomainTokens.count ?? 0
        ]
    }

    @available(iOS 16.0, *)
    private static func describe(_ status: AuthorizationStatus) -> String {
        switch status {
        case .approved: return "approved"
        case .denied: return "denied"
        case .notDetermined: return "notDetermined"
        @unknown default: return "unknown"
        }
    }
}

/// Apple's app picker with Cancel / Done. `onFinish(nil)` means cancelled.
@available(iOS 16.0, *)
private struct PickerView: View {
    @State var selection: FamilyActivitySelection
    let onFinish: (FamilyActivitySelection?) -> Void

    init(initial: FamilyActivitySelection, onFinish: @escaping (FamilyActivitySelection?) -> Void) {
        _selection = State(initialValue: initial)
        self.onFinish = onFinish
    }

    var body: some View {
        NavigationView {
            FamilyActivityPicker(selection: $selection)
                .navigationTitle("Distracting apps")
                .navigationBarTitleDisplayMode(.inline)
                .toolbar {
                    ToolbarItem(placement: .cancellationAction) {
                        Button("Cancel") { onFinish(nil) }
                    }
                    ToolbarItem(placement: .confirmationAction) {
                        Button("Done") { onFinish(selection) }
                    }
                }
        }
    }
}
