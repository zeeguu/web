// eslint-disable-next-line
/*global chrome*/
// (this will let our linter know we are accessing Chrome browser methods)
import {
  runningInChromeDesktop,
  runningInFirefoxDesktop,
} from "../misc/browserDetection";

function getExtensionInstallationLinks() {
  if (runningInChromeDesktop()) {
    return "https://chrome.google.com/webstore/detail/the-zeeguu-reader/ckncjmaednfephhbpeookmknhmjjodcd";
  }
  if (runningInFirefoxDesktop()) {
    return "https://addons.mozilla.org/en-US/firefox/addon/the-zeeguu-reader/";
  }
}

export { getExtensionInstallationLinks };
