import UIKit
import Capacitor

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        return true
    }

    // Where a share waits for the web app: Capacitor Preferences' own storage
    // (UserDefaults, keys prefixed "CapacitorStorage."), read by
    // src/hooks/usePendingShare.js. Keep the key and event name in step with
    // src/texts/pendingShare.js.
    private let pendingShareKey = "CapacitorStorage.zeeguu.pendingShare"
    private let shareWaitingEvent = "zeeguu:share"

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        // From the Share Extension: org.zeeguu.app://shared-text?text=<text>
        // or org.zeeguu.app://shared-article?url=<link>
        if url.scheme == "org.zeeguu.app", url.host == "shared-text" || url.host == "shared-article" {
            let items = URLComponents(url: url, resolvingAgainstBaseURL: false)?.queryItems ?? []
            var share: [String: String] = [:]
            for name in ["text", "url"] {
                if let value = items.first(where: { $0.name == name })?.value, !value.isEmpty {
                    share[name] = value
                }
            }
            if !share.isEmpty {
                storePendingShare(share)
            }
            return true
        }
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    /// Stores the share for the web app to take when it is ready, and nudges a
    /// page that is already running. If it isn't yet, nothing is lost: the web
    /// app looks for a waiting share when it starts and when it resumes.
    private func storePendingShare(_ share: [String: String]) {
        guard let data = try? JSONSerialization.data(withJSONObject: share),
              let json = String(data: data, encoding: .utf8) else { return }
        UserDefaults.standard.set(json, forKey: pendingShareKey)

        if let vc = window?.rootViewController as? CAPBridgeViewController,
           let webView = vc.bridge?.webView {
            webView.evaluateJavaScript("window.dispatchEvent(new Event('\(shareWaitingEvent)'))", completionHandler: nil)
        }
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }

}
