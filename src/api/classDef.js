import fetch from "cross-fetch";
import axios from "axios";
import * as Sentry from "@sentry/react";
import LocalStorage from "../assorted/LocalStorage";

export class ServerUnavailableError extends Error {
  constructor() {
    super("Server returned no data");
    this.name = "ServerUnavailableError";
  }
}

function check403ForPendingUpgrade(status) {
  if (status === 403 && LocalStorage.getAnonUpgradePending()) {
    window.dispatchEvent(new CustomEvent("zeeguu-email-not-verified"));
  }
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const Zeeguu_API = class {
  constructor(baseAPIurl) {
    this.baseAPIurl = baseAPIurl;
    this._cache = new Map();
    //this.session = currentSession; is instantiated in App when the user logs in (causes error to actually instantiate it here).
  }

  // Cache keys include the learned language so switching languages
  // naturally serves fresh data without needing to invalidate
  _cacheKey(endpoint) {
    // Key must match LocalStorage.Keys.LearnedLanguage in assorted/LocalStorage.js
    const lang = localStorage.getItem("learned_language") || "";
    return `${lang}:${endpoint}`;
  }

  getCached(endpoint) {
    const cached = this._cache.get(this._cacheKey(endpoint));
    if (cached && Date.now() - cached.time < CACHE_TTL) {
      return cached.data;
    }
    return null;
  }

  apiLog(what) {
    console.log("➡️ " + what);
  }

  getSystemLanguages(callback) {
    this._getJSON("system_languages", callback);
  }

  _appendSessionToUrl(endpointName) {
    if (endpointName.includes("?")) {
      return `${this.baseAPIurl}/${endpointName}&session=${this.session}`;
    }
    return `${this.baseAPIurl}/${endpointName}?session=${this.session}`;
  }

  _getPlainText(endpoint, callback, onError) {
    this.apiLog("GET" + endpoint);
    fetch(this._appendSessionToUrl(endpoint, this.session))
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((data) => {
        callback(data);
      })
      .catch((e) => {
        console.log("Exception in _getPlainText");
        onError(e);
      });
  }

  _getJSON(endpoint, callback, options = false) {
    // Third arg accepts either a boolean (legacy `useCache`) or an
    // options object `{ useCache, onError }`. Normalize to the object
    // form so the rest of the method only deals with one shape.
    const opts = typeof options === "boolean" ? { useCache: options } : options;
    const useCache = !!opts.useCache;
    const onError = opts.onError ?? null;

    // Capture the cache key once so the read and write use the same
    // language, even if the user switches language mid-flight
    const cacheKey = useCache ? this._cacheKey(endpoint) : null;

    if (cacheKey) {
      const cached = this._cache.get(cacheKey);
      if (cached && Date.now() - cached.time < CACHE_TTL) {
        callback(cached.data);
        return;
      }
    }

    this.apiLog("GET" + endpoint);
    fetch(this._appendSessionToUrl(endpoint, this.session))
      .then((response) => {
        if (!response.ok) {

          throw new Error(`HTTP ${response.status} on GET ${endpoint}`);
        }
        return response.json();
      })
      .then((data) => {
        if (cacheKey) {
          this._cache.set(cacheKey, { data, time: Date.now() });
        }
        callback(data);
      })
      .catch((e) => {
        console.error(`API error on GET ${endpoint}:`, e);
        // Only report errors with our thrown shape `HTTP <status> on GET ...`
        // (see the !response.ok throw ~15 lines above). Anything else reaching
        // this catch is a browser-level fetch failure — Failed to fetch, Load
        // failed (iOS), NetworkError, AbortError — caused by the user's
        // network, tab backgrounding, or navigation mid-request. Not bugs.
        if (/^HTTP \d+/.test(e.message)) {
          Sentry.captureException(e, {
            tags: { endpoint, method: "GET" },
          });
        }
        // On failure, skip the success callback so consumers stay in
        // their initial state. Pass `{ onError }` for explicit handling.
        if (onError) onError(e);
      });
  }

  _getJSONPromise(endpoint, useCache = false) {
    return new Promise((resolve, reject) => {
      this._getJSON(endpoint, resolve, {
        useCache,
        onError: () => reject(new ServerUnavailableError()),
      });
    });
  }

  //returning text or json based on the boolean getJson
  _post(endpoint, body, callback, onError, getJson) {
    // TODO: Make sure that you either return a Promise or not. Now if a callback is passed we don't return anything otherwise we return a promise.

    this.apiLog("POST" + endpoint);

    const url = this._appendSessionToUrl(endpoint);

    let params = { method: "POST" };
    if (body) {
      params = {
        ...params,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body,
      };
    }

    if (callback) {
      fetch(url, params)
        .then((response) => {
          if (response.ok) {
            return getJson ? response.json() : response.text();
          }

          // Error response - try to get message from JSON body
          return response.json().then(
            (data) => Promise.reject(data.message || `HTTP ${response.status}`),
            () => Promise.reject(`HTTP ${response.status}`),
          );
        })
        .then((data) => callback(data))
        .catch((errorMessage) => {
          if (onError) {
            onError(errorMessage);
          } else {
            console.error("API request failed:", errorMessage);
          }
        });
    } else {
      return fetch(url, params).then((response) => {
        if (response.ok) {
          return response;
        }
        return response.json().then(
          (data) => Promise.reject(data.message || `HTTP ${response.status}`),
          () => Promise.reject(`HTTP ${response.status}`),
        );
      });
    }
  }

  /**
   * Fire-and-forget POST using sendBeacon API.
   * Use this for analytics/session updates that should survive page navigation.
   * Safari aggressively cancels fetch requests on navigation, causing "Load failed" errors.
   * sendBeacon is designed for this use case and won't be cancelled.
   */
  _postBeacon(endpoint, body) {
    // The MV3 extension service worker has no `window` and no
    // `navigator.sendBeacon` — guard both so SW callers don't ReferenceError.
    const isLocalhost =
      typeof window !== "undefined" && window.location?.hostname === "localhost";
    if (isLocalhost) {
      return this._post(endpoint, body);
    }
    const url = this._appendSessionToUrl(endpoint);
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([body], { type: "application/x-www-form-urlencoded" });
      if (navigator.sendBeacon(url, blob)) return;
    }
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body,
    }).catch(() => {});
  }

  //migrated from old teacher zeeguu dashboard
  async apiPost(endpoint, data, isForm) {
    const params = { session: this.session };

    const headers = isForm ? { "Content-Type": "multipart/form-data" } : { "Content-Type": "application/json" };

    console.log(`[FRONTEND-API] POST ${endpoint} - START`, {
      timestamp: new Date().toISOString(),
      endpoint,
      dataSize: data ? JSON.stringify(data).length : 0,
    });

    const startTime = performance.now();
    try {
      const res = await axios({
        method: "post",
        url: this.baseAPIurl + endpoint,
        params: params,
        headers: headers,
        data: data,
      });
      const elapsed = performance.now() - startTime;
      console.log(`[FRONTEND-API] POST ${endpoint} - SUCCESS`, {
        timestamp: new Date().toISOString(),
        elapsed: `${elapsed.toFixed(2)}ms`,
        status: res.status,
      });
      return res;
    } catch (error) {
      const elapsed = performance.now() - startTime;
      console.error(`[FRONTEND-API] POST ${endpoint} - ERROR`, {
        timestamp: new Date().toISOString(),
        elapsed: `${elapsed.toFixed(2)}ms`,
        error: error.message,
        code: error.code,
        response: error.response?.status,
      });
      if (error.response?.status) {
        check403ForPendingUpgrade(error.response.status);
      }
      throw error;
    }
  }

  async apiGet(endpoint) {
    const params = { session: this.session };
    const res = await axios.get(this.baseAPIurl + endpoint, { params });
    return res;
  }
};

export { Zeeguu_API };
