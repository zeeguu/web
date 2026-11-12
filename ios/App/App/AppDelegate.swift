import UIKit
import Capacitor

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        return true
    }

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        // A message shared from another app: org.zeeguu.app://shared-text?text=<message>
        if url.scheme == "org.zeeguu.app", url.host == "shared-text" {
            let text = URLComponents(url: url, resolvingAgainstBaseURL: false)?
                .queryItems?.first(where: { $0.name == "text" })?.value ?? ""
            if !text.isEmpty {
                deliverSharedText(text, attempt: 0)
            }
            return true
        }
        // Handle URLs from the Share Extension: org.zeeguu.app://shared-article?url=<encoded>
        if url.scheme == "org.zeeguu.app", let host = url.host, let query = url.query {
            let path = "/\(host)?\(query)"
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
                if let vc = self.window?.rootViewController as? CAPBridgeViewController,
                   let webView = vc.bridge?.webView {
                    webView.evaluateJavaScript("window.reactNavigateFromNative('\(path)')", completionHandler: nil)
                }
            }
            return true
        }
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    /// Hands a shared message to the web app as a JS string, not in a route,
    /// so it stays out of the history. On a cold start the page may not have
    /// loaded yet, so retry until window.reactReceiveSharedText exists.
    private func deliverSharedText(_ text: String, attempt: Int) {
        guard attempt < 30,
              let data = try? JSONSerialization.data(withJSONObject: [text]),
              let jsonArray = String(data: data, encoding: .utf8) else { return }
        let js = """
        (function(t){
          if (typeof window.reactReceiveSharedText !== 'function') return false;
          window.reactReceiveSharedText(t); return true;
        })(\(jsonArray)[0])
        """
        DispatchQueue.main.asyncAfter(deadline: .now() + (attempt == 0 ? 0.3 : 0.5)) {
            guard let vc = self.window?.rootViewController as? CAPBridgeViewController,
                  let webView = vc.bridge?.webView else {
                self.deliverSharedText(text, attempt: attempt + 1)
                return
            }
            webView.evaluateJavaScript(js) { result, _ in
                if (result as? Bool) != true {
                    self.deliverSharedText(text, attempt: attempt + 1)
                }
            }
        }
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }

}
