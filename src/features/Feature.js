import LocalStorage from "../assorted/LocalStorage";

const Feature = {
  is_enabled: function (featureName) {
    return LocalStorage.hasFeature(featureName);
  },

  tiago_exercises: function () {
    return this.is_enabled("tiago_exercises");
  },

  extension_experiment1: function () {
    return this.is_enabled("extension_experiment_1");
  },
  daily_feedback: function () {
    return this.is_enabled("daily_feedback");
  },

  audio_exercises: function () {
    return this.is_enabled("audio_exercises");
  },

  has_gamification: function () {
    return this.is_enabled("gamification");
  },

  no_audio_exercises: function () {
    return this.is_enabled("no_audio_exercises");
  },

  always_open_externally: function () {
    return this.is_enabled("always_open_externally");
  },
};

export default Feature;
