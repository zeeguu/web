import LocalStorage from "../assorted/LocalStorage";

const Feature = {
  is_enabled: function (featureName) {
    return LocalStorage.hasFeature(featureName);
  },

  tiago_exercises: function () {
    return this.is_enabled("tiago_exercises");
  },

  merle_exercises: function () {
    return this.is_enabled("merle_exercises");
  },

  exercise_levels: function () {
    return this.is_enabled("exercise_levels");
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
};

export default Feature;
