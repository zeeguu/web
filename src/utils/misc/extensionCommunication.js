/*global chrome*/
// (this will let our linter know we are accessing Chrome browser methods)

function checkExtensionInstalled(setHasExtension) {
  console.log("inside of checkExtensionInstalled");
  console.log(process.env.REACT_APP_EXTENSION_ID);
  if (chrome.runtime) {
    console.log("chrome runtime: " + chrome.runtime);
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
          console.log("setHasExtension is false")
          }
      }
    );
  } else {
    console.log("setHasExtension is false");
    setHasExtension(false);
  }
}
export { checkExtensionInstalled };
