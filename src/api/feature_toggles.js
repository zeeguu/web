import { Zeeguu_API } from "./classDef";

Zeeguu_API.prototype.isFeatureEnabled = function (featureName, callbackOnYes) {
  this._getPlainText(`is_feature_enabled/${featureName}`, (result) => {
    if (result === "YES") {
      callbackOnYes();
    }
  });
};
