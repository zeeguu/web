/*global chrome*/
// (this will let our linter know we are accessing Chrome browser methods)
import { runningInChromeDesktop } from "./browserDetection";

function checkExtensionInstalled(setHasExtension) {
  if(runningInChromeDesktop()){
    console.log(chrome.runtime)
  if (chrome.runtime) {
    chrome.runtime.sendMessage(
      process.env.REACT_APP_EXTENSION_ID,
      "You are on Zeeguu.org!",
      function (response) {
        if (chrome.runtime.lastError) {
          console.log(chrome.runtime.lastError);
        }
        if (response) {
          console.log("Extension installed!");
          setHasExtension(true);
        } else {
          setHasExtension(false);
          console.log("Extension not installed!")
          }
      }
    );
  } else {
    console.log("Extension not installed!")
    setHasExtension(false);
  }}
  else {
    console.log("Extension not installed!")
    setHasExtension(false);
  }
}
export { checkExtensionInstalled };
