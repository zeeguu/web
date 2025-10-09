import Cookies from "js-cookie";

const FAR_INTO_THE_FUTURE = 365 * 5;

// Helper to detect if we're in a Capacitor app
const isCapacitor = () => {
  return window.location.protocol === 'capacitor:' ||
         window.location.protocol === 'ionic:';
};

// Cookie-based functions for web/extension communication
function saveSharedUserInfoToCookies(userInfo, sessionID = null) {
  Cookies.set("nativeLanguage", userInfo.native_language, {
    expires: FAR_INTO_THE_FUTURE,
  });
  Cookies.set("name", userInfo.name, { expires: FAR_INTO_THE_FUTURE });
  if (sessionID) {
    console.log("saving shared session ID to cookies");
    Cookies.set("sessionID", sessionID, { expires: FAR_INTO_THE_FUTURE });
  }
}

function removeSharedUserInfoFromCookies() {
  Cookies.remove("sessionID");
  Cookies.remove("nativeLanguage");
  Cookies.remove("name");
}

function getSharedSessionFromCookies() {
  return Cookies.get("sessionID");
}

// LocalStorage-based functions for Capacitor apps
function saveSharedUserInfoToLocalStorage(userInfo, sessionID = null) {
  localStorage.setItem("nativeLanguage", userInfo.native_language);
  localStorage.setItem("name", userInfo.name);
  if (sessionID) {
    console.log("saving shared session ID to localStorage (Capacitor mode)");
    localStorage.setItem("sessionID", sessionID);
  }
}

function removeSharedUserInfoFromLocalStorage() {
  localStorage.removeItem("sessionID");
  localStorage.removeItem("nativeLanguage");
  localStorage.removeItem("name");
}

function getSharedSessionFromLocalStorage() {
  return localStorage.getItem("sessionID");
}

// Platform-agnostic functions that detect platform and use appropriate storage
// These handle the minimal user info shared between web app and browser extension
function saveSharedUserInfo(userInfo, sessionID = null) {
  if (isCapacitor()) {
    saveSharedUserInfoToLocalStorage(userInfo, sessionID);
  } else {
    saveSharedUserInfoToCookies(userInfo, sessionID);
  }
}

function removeSharedUserInfo() {
  if (isCapacitor()) {
    removeSharedUserInfoFromLocalStorage();
  } else {
    removeSharedUserInfoFromCookies();
  }
}

function getSharedSession() {
  if (isCapacitor()) {
    return getSharedSessionFromLocalStorage();
  } else {
    return getSharedSessionFromCookies();
  }
}

function setUserSession(val) {
  if (isCapacitor()) {
    return localStorage.setItem("sessionID", val);
  } else {
    return Cookies.set("sessionID", val);
  }
}

export {
  // Platform-agnostic functions (recommended for app code)
  // These handle minimal user info shared between web app and browser extension
  saveSharedUserInfo,
  removeSharedUserInfo,
  getSharedSession,
  setUserSession,
  // Cookie-specific functions (for web/extension communication)
  saveSharedUserInfoToCookies,
  removeSharedUserInfoFromCookies,
  getSharedSessionFromCookies,
  // LocalStorage-specific functions (for Capacitor)
  saveSharedUserInfoToLocalStorage,
  removeSharedUserInfoFromLocalStorage,
  getSharedSessionFromLocalStorage,
};
