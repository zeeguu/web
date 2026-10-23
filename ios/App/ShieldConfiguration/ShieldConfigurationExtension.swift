import ManagedSettings
import ManagedSettingsUI
import UIKit

/// The screen iOS shows instead of an app the learner paused with Aiki mode.
///
/// Apple only lets us set its text, colours, icon and button labels. The
/// button cannot open Zeeguu itself; ShieldAction handles the press, leaving
/// a note for the app to open /aiki and a notification that opens it.
class ShieldConfigurationExtension: ShieldConfigurationDataSource {
    override func configuration(shielding application: Application) -> ShieldConfiguration {
        return shield(for: application.localizedDisplayName)
    }

    override func configuration(shielding application: Application, in category: ActivityCategory) -> ShieldConfiguration {
        return shield(for: application.localizedDisplayName)
    }

    override func configuration(shielding webDomain: WebDomain) -> ShieldConfiguration {
        return shield(for: webDomain.domain)
    }

    override func configuration(shielding webDomain: WebDomain, in category: ActivityCategory) -> ShieldConfiguration {
        return shield(for: webDomain.domain)
    }

    // An invitation and today's countdown, from the ledger the app keeps (Aiki.swift).
    // The rules themselves are on the /aiki page. The leading newline separates
    // the text from the title.
    private static func deal(for name: String) -> String {
        let learned = Aiki.loadLedger().learnedToday(Date()) / 60
        let left = Aiki.dailyGoalSeconds / 60 - learned
        let countdown = learned == 0
            ? ""
            : "\n\n\(left) more \(left == 1 ? "minute" : "minutes") to unlock completely today!"
        return "\nLearn a bit in Zeeguu to unlock \(name)." + countdown
    }

    private func shield(for name: String?) -> ShieldConfiguration {
        let zeeguuOrange = UIColor(red: 1.0, green: 0xbb / 255.0, blue: 0x54 / 255.0, alpha: 1)
        return ShieldConfiguration(
            backgroundBlurStyle: .systemMaterial,
            icon: UIImage(named: "ZeeguuShieldIcon"),
            title: ShieldConfiguration.Label(text: "\(name ?? "This app") is paused", color: .label),
            subtitle: ShieldConfiguration.Label(text: Self.deal(for: name ?? "it"), color: .secondaryLabel),
            primaryButtonLabel: ShieldConfiguration.Label(text: "Learn in Zeeguu", color: .black),
            primaryButtonBackgroundColor: zeeguuOrange
        )
    }
}
