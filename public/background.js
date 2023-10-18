/*global chrome*/

chrome.runtime.onMessageExternal.addListener(
  (request, sender, sendResponse) => {
    console.log("Received message from " + sender.url + ": ", request);
    sendResponse({ message: true });
  }
);

chrome.runtime.onInstalled.addListener(function (object) {
  let externalUrl = "https://www.zeeguu.org/extension_installed";
  if (object.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({ url: externalUrl });
  }
});

chrome.runtime.onMessage.addListener(function (request, sender) {
  if (request.type == "SPEAK") {
    try {
      if (request) {
        console.log("chrome.tts.speak: " + request.options.text + " " + request.options.language);
      }

      chrome.tts.speak(request.options.text, {
        lang: request.options.language,
      });
    } catch (error) {
      // trying to make this work also for Firefox
      console.log(error);
      var utterance = new SpeechSynthesisUtterance(request.options.text);
      utterance.lang = request.options.language;
      speechSynthesis.speak(utterance);
    }
  }
});
