import { Zeeguu_API } from "./classDef";

Zeeguu_API.prototype.getUserDetails = function (callback) {
  this._get("get_user_details", callback);
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
          this.session = data;
          onSuccess(data);
          return;
        }
        onError(data.message);
      });
    })
    .catch((error) => {
      if (!error.response) {
        onError(
          "There seems to be a problem with the server. Please try again later."
        );
      }
    });
};