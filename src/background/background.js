/*global chrome*/
/*global browser*/

import { WEB_URL, WEB_LOGIN_URL, API_URL } from "../config";
import { runningInChromeDesktop } from "../zeeguu-react/src/utils/misc/browserDetection";
import {
  setCurrentURL,
  setUserInLocalStorage,
  getCurrentTab,
} from "../popup/functions";
import { getIsLoggedIn, isLoggedIn, getUserInfoDict } from "../popup/cookies";
import Zeeguu_API from "../zeeguu-react/src/api/Zeeguu_API";
import { EXTENSION_SOURCE } from "../JSInjection/constants";

chrome.runtime.onMessageExternal.addListener(
  (request, sender, sendResponse) => {
    console.log("Received message from " + sender.url + ": ", request);
    sendResponse({ message: true });
  }
);

chrome.runtime.onInstalled.addListener(function (object) {
  let externalUrl = WEB_URL + "/extension_installed";
  if (object.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({ url: externalUrl });
  }
});

chrome.runtime.onMessage.addListener(async function (request) {
  if (request.type === "SPEAK") {
    try {
      // Chrome TTS gets the speak engine from the OS.
      // This means the OS needs to have a voice installed.
      await chrome.tts.speak(request.options.text, {
        lang: request.options.language,
      });
      console.log(request.options.language);
    } catch (error) {
      // trying to make this work also for Firefox
      console.log(error);
      var utterance = new SpeechSynthesisUtterance(request.options.text);
      utterance.lang = request.options.language;
      speechSynthesis.speak(utterance);
    }
  }
});

// Handle the Context Menu
const contextMenuReadArticle = {
  id: "read_in_zeeguu_reader",
  title: "Read article with Zeeguu" /* what appears in the menu */,
  contexts: [
    "page",
  ] /* to make this appear only when user selects something on page */,
};

async function startReader() {
  let user_logged_in = await getIsLoggedIn(WEB_URL);
  let tab = await getCurrentTab();
  if (!user_logged_in) {
    console.log("User not logged in!");
    // The user is not logged in, send them to Zeeguu.
    chrome.tabs.create({ url: WEB_LOGIN_URL + "?link=" + tab.url });
  } else {
    try {
      let api = new Zeeguu_API(API_URL);
      let userData = await getUserInfoDict(WEB_URL);
      setUserInLocalStorage(userData, api);
      console.log(api);
      await api.logReaderActivity(
        api.OPEN_CONTEXT,
        "",
        tab.url,
        EXTENSION_SOURCE
      );
      if (runningInChromeDesktop()) {
        chrome.scripting
          .executeScript({
            target: { tabId: tab.id },
            files: ["main.js"],
            func: setCurrentURL(tab.url),
          })
          .then(() => console.log("injected the function!"));
      } else {
        browser.scripting.executeScript({
          target: {
            tabId: tab.id,
          },
          files: ["main.js"],
          func: setCurrentURL(tab.url),
        });
      }
    } catch (err) {
      console.error(`failed to execute script: ${err}`);
    }
  }
}

if (runningInChromeDesktop()) {
  chrome.contextMenus.onClicked.addListener(async (clickData) => {
    if (clickData.menuItemId === "read_in_zeeguu_reader") {
      startReader();
    }
  });

  chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create(contextMenuReadArticle);
  });
} else {
  browser.contextMenus.onClicked.addListener(async (clickData) => {
    if (clickData.menuItemId === "read_in_zeeguu_reader") {
      startReader();
    }
  });

  browser.runtime.onInstalled.addListener(() => {
    browser.contextMenus.create(contextMenuReadArticle);
  });
}
