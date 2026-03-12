import UIKit
import Social
import UniformTypeIdentifiers

class ShareViewController: SLComposeServiceViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        handleSharedItems()
    }

    override func didSelectPost() {
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
                        self?.openMainApp(with: url)
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
                        self?.openMainApp(with: url)
                    }
                    return
                }
            }
        }

        close()
    }

    private func openMainApp(with url: URL) {
        let encodedUrl = url.absoluteString.addingPercentEncoding(
            withAllowedCharacters: .urlQueryAllowed
        ) ?? url.absoluteString

        guard let appUrl = URL(string: "org.zeeguu.app://shared-article?url=\(encodedUrl)") else {
            close()
            return
        }

        // Share Extensions cannot call UIApplication.shared.openURL directly.
        // Use the responder chain workaround.
        var responder: UIResponder? = self as UIResponder
        let selector = sel_registerName("openURL:")
        while responder != nil {
            if responder!.responds(to: selector) {
                responder!.perform(selector, with: appUrl)
                break
            }
            responder = responder?.next
        }

        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) { [weak self] in
            self?.close()
        }
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
