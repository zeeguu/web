/*global chrome*/
import { Readability } from '@mozilla/readability'

export async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

export function reading(currentTabURL) {
  var documentFromTab = getSourceAsDOM(currentTabURL);
  var article = new Readability(documentFromTab).parse();
  chrome.storage.local.set({ article: article });
}

function getSourceAsDOM(url) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", url, false);
  xmlhttp.send();
  var parser = new DOMParser();
  return parser.parseFromString(xmlhttp.responseText, "text/html");
}
