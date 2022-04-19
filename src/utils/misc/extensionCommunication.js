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
        process.env.REACT_APP_EXTENSION_ID, "You are on Zeeguu.org!", function (response) {
          if (chrome.runtime.lastError) {
            console.log(chrome.runtime.lastError);
          }
          if (response) {
            console.log("Extension installed!");
            setHasExtension(true);
          } else {
            setHasExtension(false);
          }
        }
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
        event.data.direction === "from-content-script"
      ) {
        setHasExtension(true);
        firefoxExtension = true;
        console.log("Extension installed!");
      }
      if (!firefoxExtension) {
        setHasExtension(false);
      }
    });
  } else {
    setHasExtension(false);
  }
}
export { checkExtensionInstalled };
