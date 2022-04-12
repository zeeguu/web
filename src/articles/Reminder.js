import { ExtensionReminder } from "./Reminder.sc";
import Feature from "../features/Feature";
import { runningInChromeDesktop } from "../utils/misc/browserDetection";

export default function Reminder({ hasExtension }) {
  if (!hasExtension && runningInChromeDesktop() && Feature.extension_experiment1()) {
    return (
      <ExtensionReminder>
        To read articles with the help of Zeeguu you need to read them from the
        Chrome extension or by adding the texts to "Own Texts" through the "Save
        article to Zeeguu.org" button from within the extension.
        <a
          href="https://chrome.google.com/webstore/detail/zeeguu/ckncjmaednfephhbpeookmknhmjjodcd"
          target="_blank"
          rel="noopener noreferrer"
        > Install the extension in the Chrome Web Store.
        </a>
      </ExtensionReminder>
    );
  }
  if (!runningInChromeDesktop() && Feature.extension_experiment1()) {
    return (
      <ExtensionReminder>
        To read articles with the help of Zeeguu you need to read them from the
        Chrome extension. Thus you must use a Chrome browser. From within the
        extension you can then add texts to "Own Texts" through the "Save
        article to Zeeguu.org" button.
        <a
          href="https://chrome.google.com/webstore/detail/zeeguu/ckncjmaednfephhbpeookmknhmjjodcd"
          target="_blank"
          rel="noopener noreferrer"
        > Install the extension in the Chrome Web Store.
        </a>
      </ExtensionReminder>
    );
  } else {
    return null;
  }
}
