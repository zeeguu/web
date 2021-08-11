import { Zeeguu_API } from "./classDef";

Zeeguu_API.prototype.ifActivityDashboard = function (setterToCall) {
  this.isFeatureEnabled("activity_dashboard", () => setterToCall(true));
};

Zeeguu_API.prototype.isFeatureEnabled = function (featureName, callbackOnYes) {
  this._getPlainText(`is_feature_enabled/${featureName}`, (result) => {
    if (result === "YES") {
      callbackOnYes();
    }
  });
};
