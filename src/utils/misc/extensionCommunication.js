/*global chrome*/
// (this will let our linter know we are accessing Chrome browser methods)
import {
  runningInChromeDesktop,
  runningInFirefoxDesktop,
} from "./browserDetection";

function checkExtensionInstalled(setHasExtension) {
  if (runningInChromeDesktop()) {
    if (chrome.runtime) {
      chrome.runtime.sendMessage(
        process.env.REACT_APP_EXTENSION_ID,
        "You are on Zeeguu.org!",
        function (response) {
          if (response) {
            setHasExtension(true);
          } else {
            setHasExtension(false);
          }
        },
      );
    } else {
      setHasExtension(false);
    }
  }
  if (runningInFirefoxDesktop()) {
    let firefoxExtension;
    window.addEventListener("message", function (event) {
      if (
        event.source == window &&
        event.data.message === "Greetings from the Zeeguu Extension"
      ) {
        setHasExtension(true);
        firefoxExtension = true;
      }
      if (!firefoxExtension) {
        setHasExtension(false);
      }
    });
  } else {
    setHasExtension(false);
  }
}

function getExtensionInstallationLinks() {
  if (runningInChromeDesktop()) {
    return "https://chrome.google.com/webstore/detail/the-zeeguu-reader/ckncjmaednfephhbpeookmknhmjjodcd";
  }
  if (runningInFirefoxDesktop()) {
    return "https://addons.mozilla.org/en-US/firefox/addon/the-zeeguu-reader/";
  }
}
export { checkExtensionInstalled, getExtensionInstallationLinks };
