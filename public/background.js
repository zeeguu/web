
chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
    console.log("Received message from " + sender.url + ": ", request);
    sendResponse({message: true});
});
