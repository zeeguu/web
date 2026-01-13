import { Capacitor } from "@capacitor/core";

/**
 * Platform constants for analytics tracking.
 * Keep in sync with backend: zeeguu/core/constants.py
 */
export const PLATFORM = {
  WEB_DESKTOP: 1,
  WEB_MOBILE: 2,
  IOS_APP: 3,
  ANDROID_APP: 4,
  EXTENSION: 5,
  UNKNOWN: 0,
};

/**
 * Returns the platform identifier (integer) for analytics tracking.
 */
function getPlatform() {
  try {
    const capacitorPlatform = Capacitor.getPlatform();
    if (capacitorPlatform === "ios") return PLATFORM.IOS_APP;
    if (capacitorPlatform === "android") return PLATFORM.ANDROID_APP;
  } catch (e) {
    // Capacitor not available, fall back to user agent detection
  }

  // Check if running as browser extension
  if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.id) {
    return PLATFORM.EXTENSION;
  }

  // Web browser detection
  if (isMobile()) {
    return PLATFORM.WEB_MOBILE;
  }
  return PLATFORM.WEB_DESKTOP;
}

function runningInChromeDesktop() {
  let userAgent = navigator.userAgent;
  if (userAgent.match(/chrome|chromium|crios/i) && isMobile() === false) {
    return true;
  } else {
    return false;
  }
}

function runningInFirefoxDesktop() {
  let userAgent = navigator.userAgent;
  if (userAgent.match(/firefox/i) && isMobile() === false) {
    return true;
  } else {
    return false;
  }
}

function isSupportedBrowser() {
  if (runningInChromeDesktop() || runningInFirefoxDesktop()) {
    return true;
  } else return false;
}

// cf: https://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-mobile-device
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobi|Android/i.test(
    navigator.userAgent
  );
}

export {
  isMobile,
  runningInChromeDesktop,
  runningInFirefoxDesktop,
  isSupportedBrowser,
  getPlatform,
};
