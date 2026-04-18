/*global chrome*/
/*global browser*/

// Firefox exposes both `browser` (promise-based) and `chrome` (callback-based
// compat shim). Our call sites `await` tabs/scripting APIs, so we must pick
// `browser` on Firefox. Real Chrome has no `browser` global → falls back.
export const BROWSER_API =
  typeof browser !== 'undefined' && browser.runtime && browser.runtime.id
    ? browser
    : chrome;

// Unified cookie API that works with both Chrome callbacks and Firefox promises
export const cookies = {
  get: async (details) => {
    if (typeof browser !== 'undefined' && browser.cookies) {
      // Firefox - returns a promise
      return await browser.cookies.get(details);
    } else {
      // Chrome - uses callbacks
      return new Promise((resolve) => {
        chrome.cookies.get(details, (cookie) => {
          resolve(cookie);
        });
      });
    }
  },

  getAll: async (details) => {
    if (typeof browser !== 'undefined' && browser.cookies) {
      // Firefox - returns a promise
      return await browser.cookies.getAll(details);
    } else {
      // Chrome - uses callbacks
      return new Promise((resolve) => {
        chrome.cookies.getAll(details, (cookies) => {
          resolve(cookies);
        });
      });
    }
  },

  set: async (details) => {
    if (typeof browser !== 'undefined' && browser.cookies) {
      // Firefox - returns a promise
      return await browser.cookies.set(details);
    } else {
      // Chrome - uses callbacks
      return new Promise((resolve) => {
        chrome.cookies.set(details, (cookie) => {
          resolve(cookie);
        });
      });
    }
  },

  remove: async (details) => {
    if (typeof browser !== 'undefined' && browser.cookies) {
      // Firefox - returns a promise
      return await browser.cookies.remove(details);
    } else {
      // Chrome - uses callbacks
      return new Promise((resolve) => {
        chrome.cookies.remove(details, (details) => {
          resolve(details);
        });
      });
    }
  }
};