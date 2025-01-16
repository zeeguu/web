import { ExtensionReminder } from "./Reminder.sc";
import Feature from "../features/Feature";
import {
  runningInChromeDesktop,
  runningInFirefoxDesktop,
} from "../utils/misc/browserDetection";
import LocalStorage from "../assorted/LocalStorage";
import ExtensionInstallationMessage from "./ExtensionInstallationMessage";

export default function Reminder({ hasExtension }) {
  console.log("Running in Chrome Desktop: " + runningInChromeDesktop());
  console.log("Feature experiment 1: " + Feature.extension_experiment1());

  if (
    !hasExtension &&
    !runningInChromeDesktop() &&
    !runningInFirefoxDesktop()
  ) {
    // If we are on mobile we don't show any message?
    return <></>;
  }

  if (
    !hasExtension &&
    runningInChromeDesktop() &&
    Feature.extension_experiment1()
  ) {
    return (
      <ExtensionReminder>
        To read articles with the help of Zeeguu you need to read them from the
        browser extension or by adding the texts to "My Texts" through the "Save
        article to Zeeguu.org" button from within the extension.
        <ExtensionInstallationMessage hasExtension={hasExtension} />
      </ExtensionReminder>
    );
  }
  if (
    !hasExtension &&
    runningInFirefoxDesktop() &&
    Feature.extension_experiment1()
  ) {
    return (
      <ExtensionReminder>
        To read articles with the help of Zeeguu you need to read them from the
        browser extension or by adding the texts to "My Texts" through the "Save
        article to Zeeguu.org" button from within the extension.
        <ExtensionInstallationMessage hasExtension={hasExtension} />
      </ExtensionReminder>
    );
  }
  if (
    !runningInChromeDesktop() &&
    !runningInFirefoxDesktop() &&
    Feature.extension_experiment1()
  ) {
    if (
      hasExtension &&
      runningInChromeDesktop() &&
      Feature.extension_experiment1() &&
      !LocalStorage.getClickedVideo()
    ) {
      return (
        <ExtensionReminder>
          Learn how to use the Zeeguu Reader Chrome extension by watching
          <a
            href="https://vimeo.com/715531198"
            rel="noopener noreferrer"
            target="_blank"
            onClick={() => LocalStorage.setClickedVideo()}
          >
            {" "}
            this video.
          </a>
        </ExtensionReminder>
      );
    }
    if (!runningInChromeDesktop() && Feature.extension_experiment1()) {
      return (
        <ExtensionReminder>
          To read articles with the help of Zeeguu you should read them from the
          browser extension. Thus you must use a Chrome, Edge or Firefox browser
          on desktop.
          <br />
          <br />
          From within the extension you can then add texts to "My Texts" through
          the "Save article to Zeeguu.org" button.
          <ExtensionInstallationMessage hasExtension={hasExtension} />
        </ExtensionReminder>
      );
    }
  } else {
    return null;
  }
}
