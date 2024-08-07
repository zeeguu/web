import Cookies from "js-cookie";

const FAR_INTO_THE_FUTURE = 365 * 5;
function saveUserInfoIntoCookies(userInfo, sessionID = null) {
  Cookies.set("nativeLanguage", userInfo.native_language, {
    expires: FAR_INTO_THE_FUTURE,
  });
  Cookies.set("pronounceWords", true, {
    expires: FAR_INTO_THE_FUTURE,
  });
  Cookies.set("translateWords", true, {
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

function getPronounceWordsFromCookies() {
  let val = Cookies.get("pronounceWords");
  return val === undefined ? true : val === "true";
}

function getTranslateWordsFromCookies() {
  let val = Cookies.get("translateWords");
  return val === undefined ? true : val === "true";
}

function setPronounceWordsIntoCookies(val) {
  Cookies.set("pronounceWords", val, { expires: FAR_INTO_THE_FUTURE });
}

function setTranslateWordsIntoCookies(val) {
  Cookies.set("translateWords", val, { expires: FAR_INTO_THE_FUTURE });
}

function setUserSession(val) {
  return Cookies.set("sessionID", val);
}

export {
  getPronounceWordsFromCookies,
  getTranslateWordsFromCookies,
  setPronounceWordsIntoCookies,
  setTranslateWordsIntoCookies,
  saveUserInfoIntoCookies,
  removeUserInfoFromCookies,
  getSessionFromCookies,
  setUserSession,
};
