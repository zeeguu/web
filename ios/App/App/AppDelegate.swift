import UIKit
import Capacitor

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        return true
    }

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        if url.scheme == "org.zeeguu.app" {
            if let components = URLComponents(url: url, resolvingAgainstBaseURL: false),
               let articleURL = components.queryItems?.first(where: { $0.name == "url" })?.value {
                navigateToSharedArticle(articleURL)
            }
            return true
        }
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    private func navigateToSharedArticle(_ articleURL: String) {
        guard let encodedUrl = articleURL.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) else { return }
        let path = "/shared-article?url=\(encodedUrl)"
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            if let vc = self.window?.rootViewController as? CAPBridgeViewController,
               let webView = vc.bridge?.webView {
                webView.evaluateJavaScript("window.location.href = '\(path)';", completionHandler: nil)
            }
        }
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }

}
