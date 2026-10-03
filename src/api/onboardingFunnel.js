import { Capacitor } from "@capacitor/core";
import { Zeeguu_API } from "./classDef";
import { getPlatform } from "../utils/misc/browserDetection";
import { APP_VERSION } from "../appVersion";

// Where newcomers drop out of onboarding, and what happened when they did.
// Most of these steps happen before there is an account, so they are tied
// together by a random funnel id kept in local storage rather than by a
// session; when a session exists the API attaches the funnel to that user.
// See OnboardingFunnelEvent in the API for what is (and isn't) stored.

const FUNNEL_ID_KEY = "onboarding_funnel_id";
const ENTRY_POINT_KEY = "onboarding_entry_point";
const LAST_STEP_KEY = "onboarding_last_step";

// The first step a funnel records says how the visitor came in.
const ENTRY_POINTS = {
  landing_viewed: "landing",
  welcome_viewed: "app",
  shared_article_viewed: "shared_article",
};

const PLATFORM = getPlatform();

// Read once: the native lookup is async and the model does not change.
// Imported lazily and only on native: the browser extension's service worker
// shares this module and has no use for a native plugin.
let deviceModel = null;
if (Capacitor.isNativePlatform()) {
  import("@capacitor/device")
    .then(({ Device }) => Device.getInfo())
    .then((info) => (deviceModel = info.model))
    .catch(() => {});
}

function storageGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function storageSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // storage blocked: the event is still sent, just not tied to the next one
  }
}

function newFunnelId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function funnelId() {
  let id = storageGet(FUNNEL_ID_KEY);
  if (!id) {
    id = newFunnelId();
    storageSet(FUNNEL_ID_KEY, id);
  }
  return id;
}

function entryPoint(step) {
  let entry = storageGet(ENTRY_POINT_KEY);
  if (!entry) {
    entry = ENTRY_POINTS[step] || "direct";
    storageSet(ENTRY_POINT_KEY, entry);
  }
  return entry;
}

// Seconds since the previous step, so a slow step stands out without a
// second event per page. Also drops the duplicate a StrictMode double mount
// sends within the same second.
function secondsSincePreviousStep(step) {
  const now = Date.now();
  let previous = null;
  try {
    previous = JSON.parse(storageGet(LAST_STEP_KEY));
  } catch {
    // unreadable: treat as the first step
  }
  // Leaving the app is not a step: the clock keeps running from the page
  // they left on, so the step after their return says how long it really took.
  if (step !== "page_hidden") storageSet(LAST_STEP_KEY, JSON.stringify({ step, at: now }));
  if (!previous) return { first: true };
  if (previous.step === step && now - previous.at < 1000) return null;
  return { previous_step: previous.step, seconds_since_previous: Math.round((now - previous.at) / 1000) };
}

/**
 * Record one onboarding step, e.g. api.funnelEvent("account_form_invalid", { fields: ["email"] }).
 * Step names are lowercase_with_underscores. Never put anything the visitor
 * typed into the detail -- which field failed, not what was in it.
 */
Zeeguu_API.prototype.funnelEvent = function (step, detail = {}) {
  const timing = secondsSincePreviousStep(step);
  if (timing === null) return;

  if (timing.first && document.referrer) {
    try {
      const referrer = new URL(document.referrer).hostname;
      if (referrer !== window.location.hostname) timing.referrer = referrer;
    } catch {
      // not a URL
    }
  }

  const body = JSON.stringify({
    funnel_id: funnelId(),
    step,
    detail: { ...timing, ...detail },
    entry_point: entryPoint(step),
    platform: PLATFORM,
    app_version: APP_VERSION,
    device_model: deviceModel,
    viewport_w: window.innerWidth,
    viewport_h: window.innerHeight,
    ui_language: navigator.language,
    online: navigator.onLine,
  });

  // text/plain keeps this a simple request (no CORS preflight) and is what a
  // beacon sends anyway; the API parses the body as JSON regardless. A beacon
  // also survives the page being closed, which is when a drop-out happens.
  const url = this._appendSessionToUrl("onboarding_funnel_event");
  if (window.location.hostname !== "localhost" && navigator.sendBeacon) {
    if (navigator.sendBeacon(url, new Blob([body], { type: "text/plain" }))) return;
  }
  fetch(url, { method: "POST", headers: { "Content-Type": "text/plain" }, body, keepalive: true }).catch(() => {});
};

/** An API error as funnel detail: short, and with any address taken out. */
export function funnelError(error) {
  const text = typeof error === "string" ? error : error?.message || String(error);
  return text.replace(/\S+@\S+/g, "<email>").slice(0, 200);
}

/** A new person on this device starts a new funnel: called on logout. */
Zeeguu_API.prototype.resetFunnel = function () {
  try {
    localStorage.removeItem(FUNNEL_ID_KEY);
    localStorage.removeItem(ENTRY_POINT_KEY);
    localStorage.removeItem(LAST_STEP_KEY);
  } catch {
    // storage blocked
  }
};
