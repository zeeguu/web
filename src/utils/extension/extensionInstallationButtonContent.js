// eslint-disable-next-line
/*global chrome*/
// (this will let our linter know we are accessing Chrome browser methods)
import {
  runningInChromeDesktop,
  runningInFirefoxDesktop,
} from "../misc/browserDetection";

function getExtensionInstallationButtonContent() {
  if (runningInChromeDesktop()) {
    return "Install from Chrome Web Store";
  }
  if (runningInFirefoxDesktop()) {
    return "Install from Add-ons for Firefox";
  }
}

export { getExtensionInstallationButtonContent };
