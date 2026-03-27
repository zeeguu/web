import UIKit
import Capacitor

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        return true
    }

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        // Handle URLs from the Share Extension: org.zeeguu.app://shared-article?url=<encoded>
        if url.scheme == "org.zeeguu.app", let host = url.host, let query = url.query {
            let path = "/\(host)?\(query)"
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
                if let vc = self.window?.rootViewController as? CAPBridgeViewController,
                   let webView = vc.bridge?.webView {
                    webView.evaluateJavaScript("window.history.pushState({}, '', '\(path)'); window.dispatchEvent(new PopStateEvent('popstate'));", completionHandler: nil)
                }
            }
            return true
        }
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }

}
