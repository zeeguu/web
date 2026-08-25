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

  verbal_flashcards: function () {
    return this.is_enabled("verbal_flashcards");
  },
  
  always_open_externally: function () {
    return this.is_enabled("always_open_externally");
  },

  // The student's class asked that they see only the texts their teacher
  // shares: no recommendation feed, no search, no shared inbox. The server
  // owns the decision (Cohort.only_classroom_texts).
  //
  // `hide_recommendations` is the same flag under its original name. The API
  // emits both, so either answer works whichever version of it replies.
  classroom_only: function () {
    return this.is_enabled("classroom_only") || this.is_enabled("hide_recommendations");
  },
};

export default Feature;
