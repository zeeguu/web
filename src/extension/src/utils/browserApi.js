/*global chrome*/
/*global browser*/

// Simple browser detection for extension context
function runningInChromeDesktop() {
  return typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id;
}

export const BROWSER_API = runningInChromeDesktop() ? chrome : browser;

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