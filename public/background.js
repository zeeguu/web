
chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
    console.log("Received message from " + sender.url + ": ", request);
    sendResponse({message: true});
});

chrome.runtime.onInstalled.addListener(function (object) {
    let externalUrl = "https://www.zeeguu.org/create_account";
    if (object.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        chrome.tabs.create({ url: externalUrl })
    }
});