import { BROWSER_API } from "../utils/browserApi";

export function isLoggedIn(cookieUrl) {
  BROWSER_API.cookies.get(
    { url: cookieUrl, name: "sessionID" },
    function (cookie) {
      if (cookie) {
        BROWSER_API.storage.local.set({ loggedIn: true }, () =>
          console.log(cookieUrl, "User already is logged in"),
        );
      } else {
        console.log(cookieUrl, "No cookie");
        BROWSER_API.storage.local.set({ loggedIn: false });
      }
    },
  );
}

export function getUserInfo(cookieUrl, setUser) {
  BROWSER_API.cookies.get({ url: cookieUrl, name: "name" }, (cookie) => {
    if (cookie) {
      setUser((prevState) => ({ ...prevState, name: decodeURI(cookie.value) }));
    }
  });
  BROWSER_API.cookies.get(
    { url: cookieUrl, name: "nativeLanguage" },
    (cookie) => {
      if (cookie) {
        setUser((prevState) => ({
          ...prevState,
          native_language: cookie.value,
        }));
      }
    },
  );
  BROWSER_API.cookies.get({ url: cookieUrl, name: "sessionID" }, (cookie) => {
    if (cookie) {
      setUser((prevState) => ({ ...prevState, session: cookie.value }));
    }
  });
}

export async function getIsLoggedIn(cookieUrl) {
  // Make this function async, so we get the value for the comparison
  console.log("Getting isLoggedIn");
  let isLoggedIn = await BROWSER_API.cookies.get({
    url: cookieUrl,
    name: "sessionID",
  });
  console.log(isLoggedIn);
  if (!isLoggedIn) {
    BROWSER_API.storage.local.set({ loggedIn: false });
    console.log(cookieUrl, "No cookie");
    return false;
  } else {
    BROWSER_API.storage.local.set({ loggedIn: true }, () =>
      console.log(cookieUrl, "User already is logged in"),
    );
    return true;
  }
}

export async function getUserInfoDictFromCookies(cookieUrl) {
  console.log("Getting user info");
  let userInfoDict = { name: "", native_language: "", session: "" };
  userInfoDict.name = (
    await BROWSER_API.cookies.get({
      url: cookieUrl,
      name: "name",
    })
  ).value;
  userInfoDict.native_language = (
    await BROWSER_API.cookies.get({
      url: cookieUrl,
      name: "nativeLanguage",
    })
  ).value;
  userInfoDict.session = (
    await BROWSER_API.cookies.get({
      url: cookieUrl,
      name: "sessionID",
    })
  ).value;
  return userInfoDict;
}

export function saveCookiesOnZeeguu(userInfo, session, url) {
  let stringSession = String(session);
  BROWSER_API.cookies.set(
    { name: "sessionID", url: url, value: stringSession },
    (cookie) => console.log("sessionID cookie saved:", cookie),
  );
  BROWSER_API.cookies.set(
    { name: "name", url: url, value: userInfo.name },
    (cookie) => console.log("name cookie saved:", cookie),
  );
  BROWSER_API.cookies.set(
    { name: "nativeLanguage", url: url, value: userInfo.native_language },
    () => console.log("nativeLanaguage cookie saved"),
  );
}

export function removeCookiesOnZeeguu(cookieUrl) {
  BROWSER_API.cookies.remove({ url: cookieUrl, name: "sessionID" }, () =>
    console.log("sessionID cookie removed"),
  );
  BROWSER_API.cookies.remove({ url: cookieUrl, name: "name" }, () =>
    console.log("name cookie removed"),
  );
  BROWSER_API.cookies.remove({ url: cookieUrl, name: "nativeLanguage" }, () =>
    console.log("nativeLanguage cookie removed"),
  );
}
