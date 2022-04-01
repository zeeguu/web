/*global chrome*/
const ZEEGUU_REGEX = /(http|https):\/\/(www\.)?zeeguu.org/;

export async function getCurrentTab() {
  const queryOptions = { active: true, currentWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

export function setCurrentURL(tabURL) {
  chrome.storage.local.set({ tabURL: tabURL });
}

export async function getCurrentURL() {
  const value = await chrome.storage.local.get("tabURL");
  return value.tabURL;
}

export async function getNativeLanguage() {
  const value = await chrome.storage.local.get("userInfo");
  return value.userInfo.native_language;
}

export async function getSessionId() {
  const value = await chrome.storage.local.get("sessionId");
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

export function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

export function deleteCurrentDOM() {
  const body = document.querySelector("body");
  removeAllChildNodes(body);
  const head = document.querySelector("head");
  removeAllChildNodes(head);
}

export async function getUserInfo(cookieUrl, setUser) {
  chrome.cookies.get({ url: cookieUrl, name: "name" }, 
  (cookie) => {
    if (cookie) {
      setUser((prevState) => ({...prevState, name: decodeURI(cookie.value)}));
    } 
  });
  chrome.cookies.get({ url: cookieUrl, name: "nativeLanguage" }, 
  (cookie) => {
    if (cookie) {
      setUser((prevState) => ({...prevState, native_language: cookie.value}));
    } 
  });
  chrome.cookies.get({ url: cookieUrl, name: "sessionID" }, 
  (cookie) => {
    if (cookie) {
      setUser((prevState) => ({...prevState, sessionID: cookie.value}));
    } 
  });
}

export function saveCookiesOnZeeguu(userInfo, session) {
  let stringSession = String(session);
  chrome.cookies.set({ name: "sessionID", url: "https://zeeguu.org", domain: "zeeguu.org", value: stringSession },
    (cookie) => console.log("Cookie saved:", cookie)
  );
  chrome.cookies.set({ name: "name", url: "https://zeeguu.org", domain: "zeeguu.org", value: userInfo.name },
    (cookie) => console.log("Cookie saved:", cookie)
  );
  chrome.cookies.set({ name: "nativeLanguage", url: "https://zeeguu.org", domain: "zeeguu.org", value: userInfo.native_language },
    (cookie) => console.log("Cookie saved:", cookie)
  );
}

export function removeCookiesOnZeeguu() {
  chrome.cookies.remove({ url: "https://zeeguu.org", name: "sessionID" },
    () => console.log("sessionid cookie removed")
  );
  chrome.cookies.remove({ url: "https://zeeguu.org", name: "name" }, 
    () => console.log("name cookie removed")
  );
  chrome.cookies.remove({ url: "https://zeeguu.org", name: "nativeLanguage" },
    () => console.log("native_language cookie removed")
  );
}
