import UIKit
import UniformTypeIdentifiers

/// When the user taps "Zeeguu" in the iOS share sheet, iOS creates this controller.
/// We extract the shared URL, then ask iOS to open Zeeguu via our custom URL scheme.
class ShareViewController: UIViewController {

    private let appURLScheme = "org.zeeguu.app"

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        handleSharedContent()
    }

    // MARK: - Extract the shared URL

    private func handleSharedContent() {
        guard let extensionItems = extensionContext?.inputItems as? [NSExtensionItem] else {
            close()
            return
        }

        for item in extensionItems {
            guard let attachments = item.attachments else { continue }
            for provider in attachments {
                if let url = extractSharedURL(from: provider) {
                    return  // extractSharedURL handles the async loading
                }
            }
        }

        close()
    }

    /// Tries to load a URL from the shared item. Returns true if it found something to load.
    /// The actual loading is async — when done, it calls openInZeeguu or close.
    private func extractSharedURL(from provider: NSItemProvider) -> Bool {

        // Case 1: the shared item is a URL (e.g. from Safari's share button)
        if provider.hasItemConformingToTypeIdentifier(UTType.url.identifier) {
            provider.loadItem(forTypeIdentifier: UTType.url.identifier, options: nil) {
                [weak self] (item, error) in
                guard let url = item as? URL else {
                    self?.close()
                    return
                }
                self?.openInZeeguu(url: url)
            }
            return true
        }

        // Case 2: the shared item is plain text that might contain a URL
        // (e.g. from Chrome or some news apps that share text instead of URLs)
        if provider.hasItemConformingToTypeIdentifier(UTType.plainText.identifier) {
            provider.loadItem(forTypeIdentifier: UTType.plainText.identifier, options: nil) {
                [weak self] (item, error) in
                guard let text = item as? String,
                      let url = self?.findURL(in: text) else {
                    self?.close()
                    return
                }
                self?.openInZeeguu(url: url)
            }
            return true
        }

        return false
    }

    /// Finds a URL inside a text string (e.g. "Check this out: https://example.com")
    private func findURL(in text: String) -> URL? {
        let detector = try? NSDataDetector(types: NSTextCheckingResult.CheckingType.link.rawValue)
        let range = NSRange(text.startIndex..., in: text)
        if let match = detector?.firstMatch(in: text, options: [], range: range) {
            return match.url
        }
        return URL(string: text)
    }

    // MARK: - Open Zeeguu with the URL

    private func openInZeeguu(url: URL) {
        guard let zeeguuURL = buildZeeguuURL(for: url) else {
            close()
            return
        }
        DispatchQueue.main.async {
            self.askIOSToOpen(zeeguuURL)
            self.close()
        }
    }

    /// Builds org.zeeguu.app://shared-article?url=<encoded article URL>
    private func buildZeeguuURL(for articleURL: URL) -> URL? {
        guard let encoded = articleURL.absoluteString.addingPercentEncoding(
            withAllowedCharacters: .urlQueryAllowed
        ) else { return nil }
        return URL(string: "\(appURLScheme)://shared-article?url=\(encoded)")
    }

    /// Opens a URL via UIApplication.shared.open() using the Objective-C runtime.
    ///
    /// Extensions can't reference UIApplication directly (blocked at compile time),
    /// so we use NSClassFromString to get it at runtime instead.
    ///
    /// We call open(_:options:completionHandler:) — the modern, non-deprecated API.
    /// The older openURL: was broken by Apple in iOS 18.
    private func askIOSToOpen(_ url: URL) {
        guard let appClass = NSClassFromString("UIApplication") as? NSObject.Type,
              let app = appClass.perform(NSSelectorFromString("sharedApplication"))?
                  .takeUnretainedValue() as? NSObject else { return }

        let selector = NSSelectorFromString("openURL:options:completionHandler:")
        guard app.responds(to: selector) else { return }

        typealias OpenURL = @convention(c) (NSObject, Selector, URL, [String: Any], ((Bool) -> Void)?) -> Void
        let open = unsafeBitCast(app.method(for: selector), to: OpenURL.self)
        open(app, selector, url, [:], nil)
    }

    // MARK: - Dismiss the extension

    private func close() {
        extensionContext?.completeRequest(returningItems: nil, completionHandler: nil)
    }
}
