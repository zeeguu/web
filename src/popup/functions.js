/*global chrome*/
import {
  Readability,
  isProbablyReaderable,
  minContentLength,
} from "@mozilla/readability";

export async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

export function reading(currentTabURL) {
  var documentFromTab = getSourceAsDOM(currentTabURL);
  var documentClone = documentFromTab.cloneNode(true);
  if (isProbablyReaderable(documentClone, minContentLength)) {
    var article = new Readability(documentClone).parse();
    chrome.storage.local.set({ article: article });
    chrome.storage.local.set({ isProbablyReaderable: true });
  } else {
    chrome.storage.local.set({ article: undefined });
    chrome.storage.local.set({ isProbablyReaderable: false });
  }
}

function getSourceAsDOM(url) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", url, false);
  xmlhttp.send();
  var parser = new DOMParser();
  return parser.parseFromString(xmlhttp.responseText, "text/html");
}
