/*global chrome*/

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

export function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}

export function deleteCurrentDOM(){
  const body = document.querySelector("body");
  removeAllChildNodes(body);
  const head = document.querySelector("head");
  removeAllChildNodes(head);
}

export function isAlreadyLoggedInToZeeguu(setName, setNativeLang, setSession) {
  chrome.cookies.get({ url: "https://www.zeeguu.org", name: "name" }, 
    function (cookie) {
      if (cookie) {
        setName(decodeURI(cookie.value))
        console.log("name", decodeURI(cookie.value))
      }
    })
    chrome.cookies.get({ url: "https://www.zeeguu.org", name: "nativeLanguage" },
    function (cookie) {
      if (cookie) {
        setNativeLang(cookie.value)
        console.log("lang", cookie.value)
      }
    })
  chrome.storage.local.get("sessionId", function (result) {
    if (result) {
      setSession(result.sessionId)
      console.log("sessionid", result.sessionId)
    }
    });
}