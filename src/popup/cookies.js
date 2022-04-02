/*global chrome*/
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
  