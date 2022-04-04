import LocalStorage from "../assorted/LocalStorage";

const Feature = {
  is_enabled: function (featureName) {
    return LocalStorage.hasFeature(featureName);
  },

  extension_experiment1: function () {
    return this.is_enabled("extension_experiment_1");
  },
};

export default Feature;
