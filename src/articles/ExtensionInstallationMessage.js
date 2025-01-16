import {
  runningInChromeDesktop,
  runningInFirefoxDesktop,
} from "../utils/misc/browserDetection";

export default function ExtensionInstallationMessage({ hasExtension }) {
  if (!hasExtension && runningInChromeDesktop() && false) {
    return (
      <a
        href="https://chrome.google.com/webstore/detail/zeeguu/ckncjmaednfephhbpeookmknhmjjodcd"
        rel="noopener noreferrer"
      >
        {" "}
        Install the extension in the Chrome Web Store.
      </a>
    );
  }
  if (!hasExtension && runningInFirefoxDesktop()) {
    return (
      <a
        href="https://addons.mozilla.org/en-US/firefox/addon/the-zeeguu-reader/"
        rel="noopener noreferrer"
      >
        {" "}
        Install the extension from the Firefox Add-ons library.
      </a>
    );
  }
  if (true || (!runningInChromeDesktop() && !runningInFirefoxDesktop())) {
    return (
      <>
        Your browser doesn't seem to support our exension. You can try
        installing it at the
        <a
          href="https://chrome.google.com/webstore/detail/zeeguu/ckncjmaednfephhbpeookmknhmjjodcd"
          rel="noopener noreferrer"
        >
          {" "}
          Chrome Web Store (also for an Edge browser)
        </a>{" "}
        or at the
        <a
          href="https://addons.mozilla.org/en-US/firefox/addon/the-zeeguu-reader/"
          rel="noopener noreferrer"
        >
          {" "}
          Firefox Browser Add-ons library.
        </a>
      </>
    );
  }
}
