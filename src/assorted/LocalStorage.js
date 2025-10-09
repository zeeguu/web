import { removeSharedUserInfo, setUserSession } from "../utils/cookies/userInfo";
import uiLanguages from "./uiLanguages";

// Note that shared session info is in Cookies (or localStorage for Capacitor)
const LocalStorage = {
  Keys: {
    // language related keys used in the logged-in user session
    LearnedLanguage: "learned_language",
    NativeLanguage: "native_language",
    LearnedCefrLevel: "learned_cefr_level",

    UiLanguage: "ui_language",
    IsTeacher: "is_teacher",
    SelectedTimePeriod: "selected_time_period",
    Features: "features",
    IsStudent: "is_student",
    AudioExperimentNoOfSessions: "audio_experiment_no_of_sessions",
    DisplayedAudioExperimentPopup: "audio_experiment_displayed_popup",
    AudioExperimentCompleted: "audio_experiment_completed",
    DisplayedAudioExperimentQuestionnaire: "audio_experiment_displayed_questionnaire",
    TargetNoOfAudioSessions: "audio_target_no_of_sessions",
    clickedVideoLink: "clicked_video_link",
    DoNotShowRedirectionModal: "do_not_show_redirection_modal",
    ProductiveExercisesEnabled: "productiveExercisesEnabled",
    AutoPronounceInExercises: "auto_pronounce_bookmark_exercise",
    lastExerciseCompleteDate: "last_exercise_complete_date",
    LastVisitedPage: "last_visited_page",
  },

  userInfo: function () {
    return {
      name: localStorage[this.Keys.Name],
      learned_language: localStorage[this.Keys.LearnedLanguage],
      native_language: localStorage[this.Keys.NativeLanguage],
      is_teacher: "true" === localStorage[this.Keys.IsTeacher],
      productiveExercisesEnabled: localStorage[this.Keys.ProductiveExercisesEnabled],
    };
  },

  isStudent: function () {
    return localStorage[this.Keys.IsStudent] !== "false";
  },

  getLearnedLanguage: function () {
    return localStorage[this.Keys.LearnedLanguage];
  },

  setLearnedLanguage: function (learnedLanguage) {
    localStorage[this.Keys.LearnedLanguage] = learnedLanguage;
  },

  getLearnedCefrLevel: function () {
    return localStorage[this.Keys.LearnedCefrLevel];
  },

  setLearnedCefrLevel: function (learnedCefrLevel) {
    localStorage[this.Keys.LearnedCefrLevel] = learnedCefrLevel;
  },

  getNativeLanguage: function () {
    return localStorage[this.Keys.NativeLanguage];
  },

  setNativeLanguage: function (nativeLanguage) {
    localStorage[this.Keys.NativeLanguage] = nativeLanguage;
  },

  selectedTimePeriod: function () {
    return localStorage[this.Keys.SelectedTimePeriod] ? localStorage[this.Keys.SelectedTimePeriod] : 30;
  },

  getDoNotShowRedirectionModal: function () {
    return localStorage[this.Keys.DoNotShowRedirectionModal];
  },

  setDoNotShowRedirectionModal: function (doNotShowRedirectionModal) {
    localStorage[this.Keys.DoNotShowRedirectionModal] = doNotShowRedirectionModal;
  },

  // Setting info
  locallySetName: function (newName) {
    localStorage[this.Keys.Name] = newName;
  },

  setProductiveExercisesEnabled: function (productiveExercisesEnabled) {
    localStorage[this.Keys.ProductiveExercisesEnabled] = productiveExercisesEnabled;
  },

  getProductiveExercisesEnabled: function () {
    try {
      return localStorage.getItem(this.Keys.ProductiveExercisesEnabled) === "true";
    } catch (e) {
      return undefined;
    }
  },

  setUiLanguage: function (language) {
    localStorage[this.Keys.UiLanguage] = language.code;
  },

  getUiLanguage: function () {
    const uiLangCode = localStorage[this.Keys.UiLanguage];
    if (uiLangCode === undefined) {
      return undefined;
    } else {
      const uiLang = uiLanguages.find((item) => item.code === uiLangCode);
      return uiLang;
    }
  },

  getAutoPronounceInExercises: function () {
    const autoPronounceInExercises = localStorage[this.Keys.AutoPronounceInExercises];
    if (autoPronounceInExercises === undefined) {
      return undefined;
    } else {
      return Number(autoPronounceInExercises);
    }
  },

  hasFeature: function (featureName) {
    try {
      return JSON.parse(localStorage[this.Keys.Features]).includes(featureName);
    } catch (e) {
      return false;
    }
  },

  setUserInfo: function (info) {
    localStorage[this.Keys.LearnedLanguage] = info.learned_language;
    localStorage[this.Keys.NativeLanguage] = info.native_language;
    localStorage[this.Keys.IsTeacher] = info.is_teacher;
    localStorage[this.Keys.Features] = JSON.stringify(info.features);
    localStorage[this.Keys.IsStudent] = JSON.stringify(info.is_student);
  },

  deleteUserInfo: function () {
    try {
      localStorage.removeItem(this.Keys.Name);
      localStorage.removeItem(this.Keys.LearnedLanguage);
      localStorage.removeItem(this.Keys.NativeLanguage);
      localStorage.removeItem(this.Keys.IsTeacher);
      localStorage.removeItem(this.Keys.Session);
      localStorage.removeItem(this.Keys.Features);
      localStorage.removeItem(this.Keys.IsStudent);
      removeSharedUserInfo();
    } catch (e) {
      console.log(e);
    }
  },

  setUserPreferences: function (preferences) {
    if (preferences["productive_exercises"] !== undefined) {
      localStorage[this.Keys.ProductiveExercisesEnabled] = preferences["productive_exercises"];
    }
  },

  deleteUserPreferences: function () {
    try {
      localStorage.removeItem(this.Keys.ProductiveExercisesEnabled);
    } catch (e) {
      console.log(e);
    }
  },

  setSelectedTimePeriod: function (time) {
    localStorage[this.Keys.SelectedTimePeriod] = time;
  },

  displayedAudioExperimentPopup: function () {
    return localStorage[this.Keys.DisplayedAudioExperimentPopup];
  },

  setDisplayedAudioExperimentPopup: function (displayedAudioExperimentPopup) {
    localStorage[this.Keys.DisplayedAudioExperimentPopup] = displayedAudioExperimentPopup;
  },

  audioExperimentCompleted: function () {
    return localStorage[this.Keys.AudioExperimentCompleted];
  },

  setAudioExperimentCompleted: function (audioExperimentCompleted) {
    localStorage[this.Keys.AudioExperimentCompleted] = audioExperimentCompleted;
  },

  checkAndUpdateAudioExperimentCompleted: function () {
    let noOfSessions = Number(localStorage[this.Keys.AudioExperimentNoOfSessions]);
    let targetNoOfAudioSessions = Number(localStorage[this.Keys.TargetNoOfAudioSessions]);
    if (noOfSessions >= targetNoOfAudioSessions) {
      this.setAudioExperimentCompleted(true);
      localStorage[this.Keys.AudioExperimentCompleted] = true;
      return true;
    }
    this.setAudioExperimentCompleted(false);
    localStorage[this.Keys.AudioExperimentCompleted] = false;
    return false;
  },

  displayedAudioExperimentQuestionnaire: function () {
    return localStorage[this.Keys.DisplayedAudioExperimentQuestionnaire];
  },

  setDisplayedAudioExperimentQuestionnaire: function (displayedAudioExperimentQuestionnaire) {
    localStorage[this.Keys.DisplayedAudioExperimentQuestionnaire] = displayedAudioExperimentQuestionnaire;
  },

  setAutoPronounceInExercises: function (val) {
    localStorage[this.Keys.AutoPronounceInExercises] = val;
  },

  getTargetNoOfAudioSessions: function () {
    try {
      let noofsessions = Number(localStorage[this.Keys.TargetNoOfAudioSessions]);
      return noofsessions;
    } catch (e) {
      return 0;
    }
  },

  setTargetNoOfAudioSessions: function (targetNoOfAudioSessions) {
    localStorage[this.Keys.TargetNoOfAudioSessions] = targetNoOfAudioSessions;
  },

  getAudioExperimentNoOfSessions: function () {
    let noofsessions = Number(localStorage[this.Keys.AudioExperimentNoOfSessions]);
    return noofsessions;
  },

  setAudioExperimentNoOfSessions: function (audioExperimentNoOfSessions) {
    localStorage[this.Keys.AudioExperimentNoOfSessions] = audioExperimentNoOfSessions;
  },

  incrementAudioExperimentNoOfSessions: function () {
    var audioExperimentNoOfSessions = Number(localStorage[this.Keys.AudioExperimentNoOfSessions]);
    var temp = audioExperimentNoOfSessions + 1;
    localStorage[this.Keys.AudioExperimentNoOfSessions] = temp;
  },

  setClickedVideo: function () {
    localStorage[this.Keys.clickedVideoLink] = true;
  },

  getClickedVideo: function () {
    return localStorage[this.Keys.clickedVideoLink];
  },

  getLastExerciseCompleteDate: function () {
    return localStorage[this.Keys.lastExerciseCompleteDate];
  },

  setLastExerciseCompleteDate: function (date) {
    localStorage[this.Keys.lastExerciseCompleteDate] = date;
  },

  getLastVisitedPage: function () {
    return localStorage[this.Keys.LastVisitedPage];
  },

  setLastVisitedPage: function (path) {
    localStorage[this.Keys.LastVisitedPage] = path;
  },
};

export default LocalStorage;
