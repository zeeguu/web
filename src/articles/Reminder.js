import { ExtensionReminder } from "./Reminder.sc";
import Feature from "../features/Feature";

export default function Reminder({ hasExtension, isChrome }) {
  if (!hasExtension && isChrome && Feature.extension_experiment1()) {
    return (
      <ExtensionReminder>
        To read articles with the help of Zeeguu you need to read them from the
        Chrome Extension or by adding the texts to "Own Texts" through the "Save
        article to Zeeguu.org" button from within the extension.
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
