import Cookies from "js-cookie";
import { Preferences } from "@capacitor/preferences";
import { Capacitor } from "@capacitor/core";

const FAR_INTO_THE_FUTURE = 365 * 5;

// In-memory cache for the session (loaded at startup for Capacitor)
let cachedSession = null;
let sessionLoaded = false;

// Helper to detect if we're in a Capacitor native app
const isCapacitor = () => {
  const platform = Capacitor.getPlatform();
  // getPlatform() returns 'ios', 'android', or 'web'
  return platform === 'ios' || platform === 'android';
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

function getSessionFromCookies() {
  return Cookies.get("sessionID");
}

// Capacitor Preferences-based functions (persistent native storage)
async function saveSharedUserInfoToPreferences(userInfo, sessionID = null) {
  await Preferences.set({ key: "nativeLanguage", value: userInfo.native_language });
  await Preferences.set({ key: "name", value: userInfo.name });
  if (sessionID) {
    await Preferences.set({ key: "sessionID", value: sessionID });
    cachedSession = sessionID;
  }
}

async function removeSharedUserInfoFromPreferences() {
  await Preferences.remove({ key: "sessionID" });
  await Preferences.remove({ key: "nativeLanguage" });
  await Preferences.remove({ key: "name" });
  cachedSession = null; // Clear cache
}

async function getSessionFromPreferences() {
  const result = await Preferences.get({ key: "sessionID" });
  return result.value;
}

// Initialize session from Preferences at app startup (call this before rendering)
async function initializeSession() {
  if (isCapacitor()) {
    cachedSession = await getSessionFromPreferences();
  }
  sessionLoaded = true;
  return cachedSession;
}

// Platform-agnostic functions that detect platform and use appropriate storage
// These handle the minimal user info shared between web app and browser extension
function saveSharedUserInfo(userInfo, sessionID = null) {
  if (isCapacitor()) {
    // Update cache immediately, save to Preferences async
    if (sessionID) cachedSession = sessionID;
    saveSharedUserInfoToPreferences(userInfo, sessionID);
  } else {
    saveSharedUserInfoToCookies(userInfo, sessionID);
  }
}

function removeSharedUserInfo() {
  if (isCapacitor()) {
    cachedSession = null; // Clear cache immediately
    removeSharedUserInfoFromPreferences();
  } else {
    removeSharedUserInfoFromCookies();
  }
}

// Read the persisted session from the platform storage layer (cookies on web /
// extension, Capacitor Preferences on mobile). After App boot this is the slow
// path — runtime code should read the React session state instead.
function getStoredSession() {
  if (isCapacitor()) {
    // Return cached session (must call initializeSession first)
    if (!sessionLoaded) {
      console.warn("getStoredSession called before initializeSession - session may be undefined");
    }
    return cachedSession;
  } else {
    return getSessionFromCookies();
  }
}

function setUserSession(val) {
  if (isCapacitor()) {
    cachedSession = val; // Update cache immediately
    Preferences.set({ key: "sessionID", value: val });
  } else {
    return Cookies.set("sessionID", val);
  }
}

export {
  // Platform-agnostic functions (recommended for app code)
  // These handle minimal user info shared between web app and browser extension
  saveSharedUserInfo,
  removeSharedUserInfo,
  getStoredSession,
  setUserSession,
  // Initialization (must be called before getStoredSession on Capacitor)
  initializeSession,
  // Cookie-specific functions (for web/extension communication)
  saveSharedUserInfoToCookies,
  removeSharedUserInfoFromCookies,
  getSessionFromCookies,
  // Preferences-specific functions (for Capacitor native storage)
  saveSharedUserInfoToPreferences,
  removeSharedUserInfoFromPreferences,
  getSessionFromPreferences,
};
