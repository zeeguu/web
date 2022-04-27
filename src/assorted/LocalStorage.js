import {
  removeUserInfoFromCookies,
  setUserSession,
} from "../utils/cookies/userInfo";
import uiLanguages from "./uiLanguages";

// Note that session info is in the Cookies
const LocalStorage = {
  Keys: {
    Session: "sessionID",
    Name: "name",
    LearnedLanguage: "learned_language",
    NativeLanguage: "native_language",
    UiLanguage: "ui_language",
    IsTeacher: "is_teacher",
    SelectedTimePeriod: "selected_time_period",
    Features: "features",
    DisplayedExtensionPopup: "displayed_extension_popup",
    //AudioExperimentNoOfSessions: "audio_experiment_no_of_sessions",
    DisplayedAudioExperimentPopup: "displayed_audio_experiment_popup",
    AudioExperimentCompleted: "audio_experiment_completed",
    DisplayedAudioExperimentQuestionnaire:
      "displayed_audio_experiment_questionnaire",
  },

  userInfo: function () {
    return {
      name: localStorage[this.Keys.Name],
      learned_language: localStorage[this.Keys.LearnedLanguage],
      native_language: localStorage[this.Keys.NativeLanguage],
      is_teacher: "true" === localStorage[this.Keys.IsTeacher],
    };
  },

  selectedTimePeriod: function () {
    return localStorage[this.Keys.SelectedTimePeriod]
      ? localStorage[this.Keys.SelectedTimePeriod]
      : 30;
  },

  displayedExtensionPopup: function () {
    return localStorage[this.Keys.DisplayedExtensionPopup];
  },

  // Setting info
  locallySetName: function (newName) {
    localStorage[this.Keys.Name] = newName;
  },

  setSession: function (session) {
    // localStorage[this.Keys.Session] = session;
    setUserSession(session);
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

  hasFeature: function (featureName) {
    try {
      return JSON.parse(localStorage[this.Keys.Features]).includes(featureName);
    } catch (e) {
      return false;
    }
  },

  setUserInfo: function (info) {
    localStorage[this.Keys.Name] = info.name;
    localStorage[this.Keys.LearnedLanguage] = info.learned_language;
    localStorage[this.Keys.NativeLanguage] = info.native_language;
    localStorage[this.Keys.IsTeacher] = info.is_teacher;
    localStorage[this.Keys.Features] = JSON.stringify(info.features);
  },

  deleteUserInfo: function () {
    try {
      localStorage.removeItem(this.Keys.Name);
      localStorage.removeItem(this.Keys.LearnedLanguage);
      localStorage.removeItem(this.Keys.NativeLanguage);
      localStorage.removeItem(this.Keys.IsTeacher);
      localStorage.removeItem(this.Keys.Session);
      localStorage.removeItem(this.Keys.Features);
      removeUserInfoFromCookies();
    } catch (e) {
      console.log(e);
    }
  },

  setSelectedTimePeriod: function (time) {
    localStorage[this.Keys.SelectedTimePeriod] = time;
  },

  setDisplayedExtensionPopup: function (displayedExtensionPopup) {
    localStorage[this.Keys.DisplayedExtensionPopup] = displayedExtensionPopup;
  },

  displayedAudioExperimentPopup: function () {
    return localStorage[this.Keys.DisplayedAudioExperimentPopup];
  },

  setDisplayedAudioExperimentPopup: function (DisplayedAudioExperimentPopup) {
    localStorage[this.Keys.DisplayedAudioExperimentPopup] =
      DisplayedAudioExperimentPopup;
  },

  audioExperimentCompleted: function () {
    return localStorage[this.Keys.AudioExperimentCompleted];
  },

  setAudioExperimentCompleted: function (AudioExperimentCompleted) {
    localStorage[this.Keys.AudioExperimentCompleted] = AudioExperimentCompleted;
  },

  displayedAudioExperimentQuestionnaire: function () {
    return localStorage[this.Keys.DisplayedAudioExperimentQuestionnaire];
  },

  setDisplayedAudioExperimentQuestionnaire: function (
    DisplayedAudioExperimentQuestionnaire
  ) {
    localStorage[this.Keys.DisplayedAudioExperimentQuestionnaire] =
      DisplayedAudioExperimentQuestionnaire;
  },

  // audioExperimentNoOfSessions: function (int) {
  //   return localStorage[this.Keys.AudioExperimentNoOfSessions];
  // },

  // setAudioExperimentNoOfSessions: function (AudioExperimentNoOfSessions) {
  //   localStorage[this.Keys.AudioExperimentNoOfSessions] =
  //     AudioExperimentNoOfSessions;
  // },
};

export default LocalStorage;
