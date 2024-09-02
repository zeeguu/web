import { Zeeguu_API } from "./classDef";

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
      `&learned_cefr_level=${userInfo.learned_cefr_level}`,
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
      `&username=${userInfo.name}`,
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

Zeeguu_API.prototype.signIn = function (email, password, onError, onSuccess) {
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
    `code=${code}&password=${newPass}`,
    callback,
    onError,
  );
};

Zeeguu_API.prototype.leaveCohort = function (cohortID, callback) {
  this._getPlainText(`leave_cohort/${cohortID}`, callback);
};
