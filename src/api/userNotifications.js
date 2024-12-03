import { Zeeguu_API } from "./classDef.js";
import qs from "qs";

Zeeguu_API.prototype.getNotificationForUser = function (callback) {
  this._getJSON("get_notification_for_user", callback);
};

Zeeguu_API.prototype.setNotificationClickDate = function (
  user_notification_id,
  callback,
) {
  let param = qs.stringify({ user_notification_id: user_notification_id });
  this._post(`/set_notification_click_date`, param, callback);
};
