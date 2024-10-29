import Cookies from "js-cookie";

const FAR_INTO_THE_FUTURE = 365 * 5;
function saveUserInfoIntoCookies(userInfo, sessionID = null) {
  Cookies.set("nativeLanguage", userInfo.native_language, {
    expires: FAR_INTO_THE_FUTURE,
  });
  Cookies.set("name", userInfo.name, { expires: FAR_INTO_THE_FUTURE });
  if (sessionID) {
    console.log("saving also session ID");
    Cookies.set("sessionID", sessionID, { expires: FAR_INTO_THE_FUTURE });
  }
}

function removeUserInfoFromCookies() {
  Cookies.remove("sessionID");
  Cookies.remove("nativeLanguage");
  Cookies.remove("name");
}

function getSessionFromCookies() {
  return Cookies.get("sessionID");
}

function setUserSession(val) {
  return Cookies.set("sessionID", val);
}

export {
  saveUserInfoIntoCookies,
  removeUserInfoFromCookies,
  getSessionFromCookies,
  setUserSession,
};
