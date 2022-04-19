import { ExtensionReminder } from "./Reminder.sc";
import Feature from "../features/Feature";
import { runningInChromeDesktop, runningInFirefoxDesktop  } from "../utils/misc/browserDetection";

export default function Reminder({ hasExtension }) {
  console.log("Running in Chrome Desktop: " + runningInChromeDesktop())
  console.log("Feature experiment 1: " + Feature.extension_experiment1())
  
  if (!hasExtension && runningInChromeDesktop() && Feature.extension_experiment1()) {
    return (
      <ExtensionReminder>
        To read articles with the help of Zeeguu you need to read them from the
        Chrome extension or by adding the texts to "My Texts" through the "Save
        article to Zeeguu.org" button from within the extension.
        <a
          href="https://chrome.google.com/webstore/detail/zeeguu/ckncjmaednfephhbpeookmknhmjjodcd"
          rel="noopener noreferrer"
        > Install the extension in the Chrome Web Store.
        </a>
      </ExtensionReminder>
    );
  }
  if (!hasExtension && runningInFirefoxDesktop() && Feature.extension_experiment1()) {
    return (
      <ExtensionReminder>
        To read articles with the help of Zeeguu you need to read them from the
        Firefox extension or by adding the texts to "My Texts" through the "Save
        article to Zeeguu.org" button from within the extension.
        <a
          href=""
          rel="noopener noreferrer"
        > Install the extension from the Firefox Add-ons library.
        </a>
      </ExtensionReminder>
    );
  }
  if (!runningInChromeDesktop()  && !runningInFirefoxDesktop() &&  Feature.extension_experiment1()) {
    return (
      <ExtensionReminder>
        To read articles with the help of Zeeguu you should read them from the
        Chrome or Firefox extension. Thus you must use a Chrome or Firefox
        browser. From within the extension you can then add texts to "My Texts"
        through the "Save article to Zeeguu.org" button. Install the extension in the 
        <a
          href="https://chrome.google.com/webstore/detail/zeeguu/ckncjmaednfephhbpeookmknhmjjodcd"
          rel="noopener noreferrer"
        > Chrome Web Store 
        </a> or install it in the 
        <a
          href=""
          rel="noopener noreferrer"
        > Firefox Browser Add-ons library.
        </a>
      </ExtensionReminder>
    );
  } else {
    return null;
  }
}
