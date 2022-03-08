/*global chrome*/
import { liveArticleDR } from "./Pages/dr";
import { getEntireHTML } from "../JSInjection/Cleaning/pageSpecificClean";
import { drRegex } from "../JSInjection/Cleaning/Pages/dr";
export async function getCurrentTab() {
  const queryOptions = { active: true, currentWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

export function setCurrentURL(tabURL) {
  chrome.storage.local.set({tabURL: tabURL });
}

export async function getCurrentURL() {
const value = await chrome.storage.local.get("tabURL")
return value.tabURL;
}

export async function getNativeLanguage() {
  const value = await chrome.storage.local.get("userInfo")
  return value.userInfo.native_language;
  }
  
export async function getSessionId() {
  const value = await chrome.storage.local.get("sessionId")
  return value.sessionId;
}

export function getSourceAsDOM(url) {
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", url, false);
  xmlhttp.send();
  const parser = new DOMParser();
  //const clean = DOMPurify.sanitize(xmlhttp.responseText);
  return parser.parseFromString(xmlhttp.responseText, "text/html");
}

export function checkReadability(url){
  if(url.match(drRegex)){
    return liveArticleDR(getEntireHTML(url))
  }
  else{
    return true;
  }
}
