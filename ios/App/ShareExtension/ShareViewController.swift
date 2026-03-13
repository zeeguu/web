import UIKit
import UniformTypeIdentifiers

class ShareViewController: UIViewController {

    private let appURLScheme = "org.zeeguu.app"

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        handleSharedItems()
    }

    private func handleSharedItems() {
        guard let extensionItems = extensionContext?.inputItems as? [NSExtensionItem] else {
            close()
            return
        }

        for item in extensionItems {
            guard let attachments = item.attachments else { continue }

            for provider in attachments {
                if provider.hasItemConformingToTypeIdentifier(UTType.url.identifier) {
                    provider.loadItem(forTypeIdentifier: UTType.url.identifier, options: nil) {
                        [weak self] (item, error) in
                        guard let url = item as? URL else {
                            self?.close()
                            return
                        }
                        self?.saveAndOpenApp(url: url)
                    }
                    return
                }

                if provider.hasItemConformingToTypeIdentifier(UTType.plainText.identifier) {
                    provider.loadItem(forTypeIdentifier: UTType.plainText.identifier, options: nil) {
                        [weak self] (item, error) in
                        guard let text = item as? String,
                              let url = self?.extractURL(from: text) else {
                            self?.close()
                            return
                        }
                        self?.saveAndOpenApp(url: url)
                    }
                    return
                }
            }
        }

        close()
    }

    private func saveAndOpenApp(url: URL) {
        if let encodedUrl = url.absoluteString.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed),
           let appURL = URL(string: "\(appURLScheme)://shared-article?url=\(encodedUrl)") {
            DispatchQueue.main.async {
                self.openContainingApp(appURL)
                self.close()
            }
        } else {
            close()
        }
    }

    /// iOS 18-compatible way to open the containing app.
    /// Uses runtime to avoid APPLICATION_EXTENSION_API_ONLY restriction,
    /// while calling the non-deprecated open(_:options:completionHandler:) which works on iOS 18.
    /// (The old selector-based openURL: was broken by Apple in iOS 18.)
    private func openContainingApp(_ url: URL) {
        guard let appClass = NSClassFromString("UIApplication") as? NSObject.Type else { return }
        guard let app = appClass.perform(NSSelectorFromString("sharedApplication"))?.takeUnretainedValue() as? NSObject else { return }

        let openSel = NSSelectorFromString("openURL:options:completionHandler:")
        guard app.responds(to: openSel) else { return }

        let imp = app.method(for: openSel)
        typealias F = @convention(c) (NSObject, Selector, URL, [String: Any], ((Bool) -> Void)?) -> Void
        let open = unsafeBitCast(imp, to: F.self)
        open(app, openSel, url, [:], nil)
    }

    private func extractURL(from text: String) -> URL? {
        let detector = try? NSDataDetector(
            types: NSTextCheckingResult.CheckingType.link.rawValue
        )
        let range = NSRange(text.startIndex..., in: text)
        if let match = detector?.firstMatch(in: text, options: [], range: range) {
            return match.url
        }
        return URL(string: text)
    }

    private func close() {
        extensionContext?.completeRequest(returningItems: nil, completionHandler: nil)
    }
}
