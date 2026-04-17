import { BROWSER_API } from "../utils/browserApi";
import { WEB_URL, WEB_LOGIN_URL, API_URL } from "../../../config";

import { getCurrentTab } from "../popup/functions";
import { getIsLoggedIn, getUserInfoDictFromCookies } from "../popup/cookies";
import Zeeguu_API from "../../../api/Zeeguu_API";
import { EXTENSION_SOURCE } from "../constants";
import { isUnsupportedTab, sendTabToZeeguu } from "../shared/sendTabToZeeguu";

// Montserrat font
const googleFontUrl =
  "https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap";

// From Zeeguu's Web CSS
const BODY_ZEEGUU_FONT_RULE = `
body {
  margin: 0;
  font-family:
    "Montserrat",
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    "Roboto",
    "Oxygen",
    "Ubuntu",
    "Cantarell",
    "Fira Sans",
    "Droid Sans",
    "Helvetica Neue",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
`;

// --- Function to Inject CSS ---
async function injectFontAndStyles(tabId) {
  try {
    // 1. Fetch the Google Font CSS content
    const response = await fetch(googleFontUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const fontCss = await response.text();
    // console.log("Fetched Font CSS for tab:", tabId);

    // 2. Inject the fetched @font-face rules
    await BROWSER_API.scripting.insertCSS({
      target: { tabId: tabId },
      // Injecting the fetched CSS which contains @font-face rules
      css: fontCss,
    });
    // console.log("Injected @font-face rules for tab:", tabId);

    // 3. Inject the Zeeguu Web font rules, this will use the font attached in 2.
    await BROWSER_API.scripting.insertCSS({
      target: { tabId: tabId },
      css: BODY_ZEEGUU_FONT_RULE,
    });
    // console.log("Injected font application rules for tab:", tabId);
  } catch (error) {
    console.error("Failed to inject font and styles:", error);
  }
}

BROWSER_API.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  // console.log("Received message from " + sender.url + ": ", request);
  sendResponse({ message: true });
});

BROWSER_API.runtime.onInstalled.addListener(function (object) {
  let externalUrl = WEB_URL + "/extension_installed";
  if (object.reason === BROWSER_API.runtime.OnInstalledReason.INSTALL) {
    BROWSER_API.tabs.create({ url: externalUrl });
  }
});

// Dev builds use a manifest whose name ends with "(DEV)" — flag the toolbar
// icon so the unpacked build is visually distinct from the store-installed one.
(() => {
  const { name } = BROWSER_API.runtime.getManifest();
  if (!name.includes("(DEV)")) return;
  const action = BROWSER_API.action || BROWSER_API.browserAction;
  if (!action) return;
  action.setBadgeText({ text: "DEV" });
  action.setBadgeBackgroundColor({ color: "#c00" });
})();

BROWSER_API.runtime.onMessage.addListener(async function (request) {
  if (request.type === "SPEAK") {
    try {
      // Chrome TTS gets the speak engine from the OS.
      // This means the OS needs to have a voice installed.
      await BROWSER_API.tts.speak(request.options.text, {
        lang: request.options.language,
      });
      // console.log(request.options.language);
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
  title: "Read with Zeeguu" /* what appears in the menu */,
  contexts: [
    "all", // Show always when the user right-clicks.
  ],
};

async function startReader() {
  const tab = await getCurrentTab();
  const user_logged_in = await getIsLoggedIn(WEB_URL);
  if (!user_logged_in) {
    BROWSER_API.tabs.update(tab.id, {
      url: WEB_LOGIN_URL + "?redirectLink=" + tab.url,
    });
    return;
  }
  if (isUnsupportedTab(tab)) return;

  try {
    const api = new Zeeguu_API(API_URL);
    const userData = await getUserInfoDictFromCookies(WEB_URL);
    api.session = userData.session;
    await api.logUserActivity(api.OPEN_CONTEXT, "", tab.url, EXTENSION_SOURCE);
    const upload = await sendTabToZeeguu(api, tab);
    BROWSER_API.tabs.create({
      url: `${WEB_URL}/shared-article?upload_id=${upload.id}`,
    });
  } catch (err) {
    console.error("Context-menu send failed:", err);
  }
}

BROWSER_API.contextMenus.onClicked.addListener(async (clickData) => {
  if (clickData.menuItemId === "read_in_zeeguu_reader") {
    startReader();
  }
});

BROWSER_API.runtime.onInstalled.addListener(() => {
  BROWSER_API.contextMenus.create(contextMenuReadArticle);
});

export { injectFontAndStyles };
