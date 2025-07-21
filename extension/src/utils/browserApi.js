/*global chrome*/
/*global browser*/

// Simple browser detection for extension context
function runningInChromeDesktop() {
  return typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id;
}

export const BROWSER_API = runningInChromeDesktop() ? chrome : browser;