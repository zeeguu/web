import LocalStorage from "../assorted/LocalStorage";

const Feature = {
  is_enabled: function (featureName) {
    if (featureName === "daily_audio") {
      return LocalStorage.hasFeature(featureName) && this.is_audio_supported_for_language();
    }
    return LocalStorage.hasFeature(featureName);
  },

  is_audio_supported_for_language: function() {
    const learnedLanguage = LocalStorage.getLearnedLanguage();
    const languagesWithoutAudio = ['el'];
    return !languagesWithoutAudio.includes(learnedLanguage);
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
