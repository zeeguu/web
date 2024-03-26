import LocalStorage from "../assorted/LocalStorage";

const Feature = {
  is_enabled: function (featureName) {
    return LocalStorage.hasFeature(featureName);
  },

  tiago_exercises : function () {
    return this.is_enabled("tiago_exercises");
  },

  extension_experiment1: function () {
    return this.is_enabled("extension_experiment_1");
  },

  audio_exercises: function () {
    return this.is_enabled("audio_exercises");
  },

  no_audio_exercises: function () {
    return this.is_enabled("no_audio_exercises");
  },

  passive_sequence: function () {
    return this.is_enabled("passive_sequence");
  },

  active_sequence: function () {
    return this.is_enabled("active_sequence");
  },
};

export default Feature;
