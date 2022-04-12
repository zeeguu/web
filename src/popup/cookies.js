/*global chrome*/
export function isLoggedIn(cookieUrl) {
  chrome.cookies.get({ url: cookieUrl, name: "sessionID" },
    function (cookie) {
      if (cookie) {
        chrome.storage.local.set({ loggedIn: true }, () =>
          console.log(cookieUrl, "Session cookie is present, Loggedin = ", true)
        );
      } else {
        console.log(cookieUrl, "No cookie")
        chrome.storage.local.set({loggedIn: false})
      }
    }
  );
}


export function getUserInfo(cookieUrl, setUser) {
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
        setUser((prevState) => ({...prevState, session: cookie.value}));
      } 
    });
  }
  
  export function saveCookiesOnZeeguu(userInfo, session, url) {
    let stringSession = String(session);
    chrome.cookies.set({ name: "sessionID", url: url,  value: stringSession },
      (cookie) => console.log("Cookie saved:", cookie)
    );
    chrome.cookies.set({ name: "name", url: url,  value: userInfo.name },
      (cookie) => console.log("Cookie saved:", cookie)
    );
    chrome.cookies.set({ name: "nativeLanguage", url: url, value: userInfo.native_language },
      (cookie) => console.log("Cookie saved:", cookie)
    );
  }
  
  export function removeCookiesOnZeeguu(cookieUrl) {
    chrome.cookies.remove({ url: cookieUrl, name: "sessionID" },
      () => console.log("sessionid cookie removed")
    );
    chrome.cookies.remove({ url: cookieUrl, name: "name" }, 
      () => console.log("name cookie removed")
    );
    chrome.cookies.remove({ url: cookieUrl, name: "nativeLanguage" },
      () => console.log("native_language cookie removed")
    );
  }
  