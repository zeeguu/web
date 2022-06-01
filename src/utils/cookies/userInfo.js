import Cookies from "js-cookie";
let far_into_the_future = 365 * 5;

function saveUserInfoIntoCookies(userInfo, sessionID = null) {
  Cookies.set("nativeLanguage", userInfo.native_language, {
    expires: far_into_the_future,
  });
  Cookies.set("name", userInfo.name, { expires: far_into_the_future });
  if (sessionID) {
    console.log("saving also session ID");
    Cookies.set("sessionID", sessionID, { expires: far_into_the_future });
  }
}

function removeUserInfoFromCookies() {
  Cookies.remove("sessionID");
  Cookies.remove("nativeLanguage");
  Cookies.remove("name");
}

function getUserSession() {
  return Cookies.get("sessionID");
}

function setUserSession(val) {
  return Cookies.set("sessionID", val);
}

function saveClickedVideoCookie() {
  Cookies.set("clickedVideo", true, {expires: far_into_the_future})
}

function getClickedVideo() {
  return Cookies.get("clickedVideo");
}

export {
  saveUserInfoIntoCookies,
  removeUserInfoFromCookies,
  getUserSession,
  setUserSession,
  saveClickedVideoCookie,
  getClickedVideo
};
