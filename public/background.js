
chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
    console.log("Received message from " + sender + ": ", request);
    sendResponse({message: true});
});
