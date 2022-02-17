import { Zeeguu_API } from "./classDef";

Zeeguu_API.prototype.getUserDetails = function (callback) {
  this._get("get_user_details", callback);
};

Zeeguu_API.prototype.saveUserDetails = function (
  user_details,
  setErrorMessage,
  onSuccess
) {
  this.apiLog(this._appendSessionToUrl("user_settings"));
  fetch(this._appendSessionToUrl("user_settings"), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body:
      `name=${user_details.name}&email=${user_details.email}` +
      `&learned_language=${user_details.learned_language}` +
      `&native_language=${user_details.native_language}`,
  })
    .then((response) => {
      if (response.status !== 200) {
        throw response;
      }
      return response; // OK in case of success
    })
    .then((data) => {
      onSuccess(data);
    })
    .catch((error) => {
      console.log(error);
      setErrorMessage("Invalid credentials");
    });
};
