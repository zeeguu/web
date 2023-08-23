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
    IsStudent: "is_student",
    DisplayedExtensionPopup: "displayed_extension_popup",
    AudioExperimentNoOfSessions: "audio_experiment_no_of_sessions",
    DisplayedAudioExperimentPopup: "audio_experiment_displayed_popup",
    AudioExperimentCompleted: "audio_experiment_completed",
    DisplayedAudioExperimentQuestionnaire:
      "audio_experiment_displayed_questionnaire",
    TargetNoOfAudioSessions: "audio_target_no_of_sessions",
    clickedVideoLink: "clicked_video_link",
    DoNotShowRedirectionNotificationModal:
      "do_not_show_redirection_notification_modal",
    OpenArticleExternallyWithoutModal: "open_article_externally_without_modal"
  },

  userInfo: function () {
    return {
      name: localStorage[this.Keys.Name],
      learned_language: localStorage[this.Keys.LearnedLanguage],
      native_language: localStorage[this.Keys.NativeLanguage],
      is_teacher: "true" === localStorage[this.Keys.IsTeacher],
    };
  },

  isStudent: function () {
    return localStorage[this.Keys.IsStudent] !== "false";
  },

  selectedTimePeriod: function () {
    return localStorage[this.Keys.SelectedTimePeriod]
      ? localStorage[this.Keys.SelectedTimePeriod]
      : 30;
  },

  displayedExtensionPopup: function () {
    return localStorage[this.Keys.DisplayedExtensionPopup];
  },

  getOpenArticleExternallyWithoutModal: function (){
    return localStorage[this.Keys.OpenArticleExternallyWithoutModal];
  },

  setOpenArticleExternallyWithoutModal: function(openArticleExternallyWithoutModal){
    localStorage[this.Keys.OpenArticleExternallyWithoutModal] = openArticleExternallyWithoutModal;
  },

  getDoNotShowRedirectionNotificationModal: function () {
    return localStorage[this.Keys.DoNotShowRedirectionNotificationModal];
  },

  setDoNotShowRedirectionNotificationModal: function (
    doNotShowRedirectionNotificationModal
  ) {
    localStorage[this.Keys.DoNotShowRedirectionNotificationModal] =
      doNotShowRedirectionNotificationModal;
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

  setDisplayedAudioExperimentPopup: function (displayedAudioExperimentPopup) {
    localStorage[this.Keys.DisplayedAudioExperimentPopup] =
      displayedAudioExperimentPopup;
  },

  audioExperimentCompleted: function () {
    return localStorage[this.Keys.AudioExperimentCompleted];
  },

  setAudioExperimentCompleted: function (audioExperimentCompleted) {
    localStorage[this.Keys.AudioExperimentCompleted] = audioExperimentCompleted;
  },

  checkAndUpdateAudioExperimentCompleted: function () {
    let noOfSessions = Number(
      localStorage[this.Keys.AudioExperimentNoOfSessions]
    );
    let targetNoOfAudioSessions = Number(
      localStorage[this.Keys.TargetNoOfAudioSessions]
    );
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

  setDisplayedAudioExperimentQuestionnaire: function (
    displayedAudioExperimentQuestionnaire
  ) {
    localStorage[this.Keys.DisplayedAudioExperimentQuestionnaire] =
      displayedAudioExperimentQuestionnaire;
  },

  getTargetNoOfAudioSessions: function () {
    try {
      let noofsessions = Number(
        localStorage[this.Keys.TargetNoOfAudioSessions]
      );
      return noofsessions;
    } catch (e) {
      return 0;
    }
  },

  setTargetNoOfAudioSessions: function (targetNoOfAudioSessions) {
    localStorage[this.Keys.TargetNoOfAudioSessions] = targetNoOfAudioSessions;
  },

  getAudioExperimentNoOfSessions: function () {
    let noofsessions = Number(
      localStorage[this.Keys.AudioExperimentNoOfSessions]
    );
    return noofsessions;
  },

  setAudioExperimentNoOfSessions: function (audioExperimentNoOfSessions) {
    localStorage[this.Keys.AudioExperimentNoOfSessions] =
      audioExperimentNoOfSessions;
  },

  incrementAudioExperimentNoOfSessions: function () {
    var audioExperimentNoOfSessions = Number(
      localStorage[this.Keys.AudioExperimentNoOfSessions]
    );
    var temp = audioExperimentNoOfSessions + 1;
    localStorage[this.Keys.AudioExperimentNoOfSessions] = temp;
  },

  setClickedVideo: function () {
    localStorage[this.Keys.clickedVideoLink] = true;
  },

  getClickedVideo: function () {
    return localStorage[this.Keys.clickedVideoLink];
  },
};

export default LocalStorage;
