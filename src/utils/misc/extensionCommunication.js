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
        }
      );
    } else {
      setHasExtension(false);
    }
  }
  if (runningInFirefoxDesktop()) {
    console.log("adding the listener for the message from the extension");
    let firefoxExtension;
    window.addEventListener("message", function (event) {
      console.log(">>>>>>");
      console.log(event);
      if (
        event.source == window &&
        event.data.direction === "from-content-script"
      ) {
        console.setHasExtension(true);
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
export { checkExtensionInstalled };
