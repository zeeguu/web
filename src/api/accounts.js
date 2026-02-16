import { Zeeguu_API } from "./classDef";
import { getPlatform } from "../utils/misc/browserDetection";

Zeeguu_API.prototype.getUserDetails = function (callback) {
  this._getJSON("get_user_details", callback);
};

Zeeguu_API.prototype.isValidSession = function (onSuccess, onError) {
  this._getPlainText("validate", onSuccess, onError);
};

Zeeguu_API.prototype.addUser = function (
  invite_code,
  password,
  userInfo,
  onSuccess,
  onError,
) {
  let url = this.baseAPIurl + `/add_user/${userInfo.email}`;
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body:
      `password=${password}&invite_code=${invite_code}` +
      `&username=${userInfo.name}` +
      `&learned_language=${userInfo.learned_language}` +
      `&native_language=${userInfo.native_language}` +
      `&learned_cefr_level=${userInfo.learned_cefr_level}` +
      `&platform=${getPlatform()}`,
  })
    .then((response) => {
      if (response.ok) {
        response.text().then((session) => {
          this.session = session;
          onSuccess(session);
        });
      } else if (response.status === 400) {
        response.json().then((json) => {
          onError(json.message);
        });
      } else {
        onError("Something went wrong. Try again or contact us.");
      }
    })
    .catch((error) => {
      onError(error.message);
    });
};

Zeeguu_API.prototype.deleteUser = function (onSuccess, onError) {
  this._post("delete_user", "", onSuccess, onError);
};

Zeeguu_API.prototype.addBasicUser = function (
  invite_code,
  password,
  userInfo,
  onSuccess,
  onError,
) {
  let url = this.baseAPIurl + `/add_basic_user/${userInfo.email}`;
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body:
      `password=${password}&invite_code=${invite_code}` +
      `&username=${userInfo.name}` +
      `&platform=${getPlatform()}`,
  })
    .then((response) => {
      if (response.ok) {
        response.text().then((session) => {
          this.session = session;
          onSuccess(session);
        });
      } else if (response.status === 400) {
        response.json().then((json) => {
          onError(json.message);
        });
      } else {
        onError("Something went wrong. Try again or contact us.");
      }
    })
    .catch((error) => {
      onError(error.message);
    });
};

Zeeguu_API.prototype.logIn = function (email, password, onError, onSuccess) {
  let url = this.baseAPIurl + `/session/${email}`;
  this.apiLog(`/session/${email}`);

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `password=${password}`,
  })
    .then((response) => {
      // https://stackoverflow.com/a/45366905/1200070
      response.json().then((data) => {
        if (response.status === 200) {
          console.log("GOT SESSOIN: " + data);
          this.session = data.session;
          onSuccess(data.session);
          return;
        }
        onError(data.message);
      });
    })
    .catch((error) => {
      if (!error.response) {
        onError(
          "There seems to be a problem with the server. Please try again later.",
        );
      }
    });
};

Zeeguu_API.prototype.sendCode = function (email, callback, onError) {
  this._post(`send_code/${email}`, "", callback, onError);
};

Zeeguu_API.prototype.resetPassword = function (
  email,
  code,
  newPass,
  callback,
  onError,
) {
  this._post(
    `reset_password/${email}`,
    `code=${encodeURIComponent(code)}&password=${encodeURIComponent(newPass)}`,
    callback,
    onError,
  );
};

Zeeguu_API.prototype.addAnonUser = function (
  uuid,
  password,
  languagePrefs,
  onSuccess,
  onError,
) {
  let url = this.baseAPIurl + `/add_anon_user`;
  let body = `uuid=${uuid}&password=${password}&platform=${getPlatform()}`;

  if (languagePrefs?.learned_language) {
    body += `&learned_language_code=${languagePrefs.learned_language}`;
  }
  if (languagePrefs?.native_language) {
    body += `&native_language_code=${languagePrefs.native_language}`;
  }
  if (languagePrefs?.learned_cefr_level) {
    body += `&learned_cefr_level=${languagePrefs.learned_cefr_level}`;
  }

  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body,
  })
    .then((response) => {
      if (response.ok) {
        response.text().then((session) => {
          this.session = session;
          onSuccess(session);
        });
      } else if (response.status === 400) {
        response.json().then((json) => {
          onError(json.message);
        });
      } else {
        onError("Something went wrong. Try again or contact us.");
      }
    })
    .catch((error) => {
      onError(error.message);
    });
};

Zeeguu_API.prototype.logInAnon = function (uuid, password, onSuccess, onError) {
  let url = this.baseAPIurl + `/get_anon_session/${uuid}`;
  this.apiLog(`/get_anon_session/${uuid}`);

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `password=${password}`,
  })
    .then((response) => {
      if (response.ok) {
        response.text().then((session) => {
          this.session = session;
          onSuccess(session);
        });
      } else {
        onError("Invalid credentials");
      }
    })
    .catch((error) => {
      onError(error.message);
    });
};

Zeeguu_API.prototype.upgradeAnonUser = function (
  email,
  username,
  password,
  onSuccess,
  onError,
) {
  let body = `email=${encodeURIComponent(email)}&username=${encodeURIComponent(username)}`;
  if (password) {
    body += `&password=${encodeURIComponent(password)}`;
  }
  this._post("upgrade_anon_user", body, onSuccess, onError);
};

Zeeguu_API.prototype.confirmEmail = function (code, onSuccess, onError) {
  this._post("confirm_email", `code=${encodeURIComponent(code)}`, onSuccess, onError);
};

Zeeguu_API.prototype.resendVerificationCode = function (onSuccess, onError) {
  this._post("resend_verification_code", "", onSuccess, onError);
};
