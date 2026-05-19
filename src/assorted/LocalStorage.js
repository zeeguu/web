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

    // Anonymous user keys
    AnonUUID: "anon_uuid",
    AnonPassword: "anon_password",
    AnonFirstUseDate: "anon_first_use_date",
    AnonUpgradeDismissed: "anon_upgrade_dismissed",
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
    LastVisitedTeacherPage: "last_visited_teacher_page",
    LastVisitedReadPath: "last_visited_read_path",
    DailyFeedbackLastShown: "daily_feedback_last_shown",
    InviteCode: "invite_code",
    // Keep in sync with index.html inline theme script
    ThemePreference: "zeeguu-theme-preference",
    ReportedTimezone: "reported_timezone",
    DrillVocab: "drill_vocab_cache",
    DrillSnoozedUntil: "drill_snoozed_until",
  },

  DRILL_SNOOZE_MS: 24 * 60 * 60 * 1000,

  // Drill cache: small per-language ring buffer of {o, t, src, ts} pairs that
  // feeds the wait-time vocab drill (see WaitDrill.js). Bounded so a chatty
  // session doesn't bloat localStorage; oldest evicted first. Dedup on the
  // origin word so a later, higher-signal source (exercise) supersedes an
  // earlier translation tap.
  DRILL_MAX_PER_LANG: 500,

  getDrillVocab: function (lang) {
    if (!lang) return [];
    try {
      const raw = localStorage.getItem(this.Keys.DrillVocab);
      if (!raw) return [];
      const all = JSON.parse(raw);
      return Array.isArray(all[lang]) ? all[lang] : [];
    } catch (e) {
      return [];
    }
  },

  isDrillVocabEmpty: function (lang) {
    return this.getDrillVocab(lang).length === 0;
  },

  pushDrillVocab: function (lang, pairs, src) {
    if (!lang || !Array.isArray(pairs) || pairs.length === 0) return;
    let all = {};
    try {
      const raw = localStorage.getItem(this.Keys.DrillVocab);
      if (raw) all = JSON.parse(raw);
    } catch (e) {
      all = {};
    }
    const existing = Array.isArray(all[lang]) ? all[lang] : [];
    const byOrigin = new Map(existing.map((e) => [e.o, e]));
    const now = Date.now();
    for (const p of pairs) {
      const o = (p?.o ?? "").trim();
      const t = (p?.t ?? "").trim();
      if (!o || !t) continue;
      byOrigin.set(o, { o, t, src, ts: now });
    }
    let next = Array.from(byOrigin.values());
    if (next.length > this.DRILL_MAX_PER_LANG) {
      next.sort((a, b) => b.ts - a.ts);
      next = next.slice(0, this.DRILL_MAX_PER_LANG);
    }
    all[lang] = next;
    try {
      localStorage.setItem(this.Keys.DrillVocab, JSON.stringify(all));
    } catch (e) {
      console.warn("Drill cache write failed, dropping cache:", e);
      try { localStorage.removeItem(this.Keys.DrillVocab); } catch {}
    }
  },

  clearDrillVocab: function () {
    try { localStorage.removeItem(this.Keys.DrillVocab); } catch {}
  },

  // × on the drill is a "shut up for now" — drill silently skips for 24h
  // then returns next time the user hits a long wait.
  snoozeDrill: function () {
    try {
      localStorage.setItem(
        this.Keys.DrillSnoozedUntil,
        String(Date.now() + this.DRILL_SNOOZE_MS),
      );
    } catch {}
  },

  isDrillSnoozed: function () {
    try {
      const until = Number(localStorage.getItem(this.Keys.DrillSnoozedUntil));
      return Number.isFinite(until) && until > Date.now();
    } catch {
      return false;
    }
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

  getInviteCode: function () {
    return localStorage[this.Keys.InviteCode] || "";
  },

  setInviteCode: function (inviteCode) {
    localStorage[this.Keys.InviteCode] = inviteCode;
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

  getLastVisitedTeacherPage: function () {
    return localStorage[this.Keys.LastVisitedTeacherPage] || "/teacher/classes";
  },

  setLastVisitedTeacherPage: function (path) {
    localStorage[this.Keys.LastVisitedTeacherPage] = path;
  },

  getLastVisitedReadPath: function () {
    return localStorage[this.Keys.LastVisitedReadPath] || "/articles";
  },

  setLastVisitedReadPath: function (path) {
    localStorage[this.Keys.LastVisitedReadPath] = path;
  },

  // Anonymous user methods
  getAnonCredentials: function () {
    const uuid = localStorage[this.Keys.AnonUUID];
    const password = localStorage[this.Keys.AnonPassword];
    if (uuid && password) {
      return { uuid, password };
    }
    return null;
  },

  setAnonCredentials: function (uuid, password) {
    localStorage[this.Keys.AnonUUID] = uuid;
    localStorage[this.Keys.AnonPassword] = password;
    if (!localStorage[this.Keys.AnonFirstUseDate]) {
      localStorage[this.Keys.AnonFirstUseDate] = new Date().toISOString();
    }
  },

  clearAnonCredentials: function () {
    localStorage.removeItem(this.Keys.AnonUUID);
    localStorage.removeItem(this.Keys.AnonPassword);
    localStorage.removeItem(this.Keys.AnonFirstUseDate);
    localStorage.removeItem(this.Keys.AnonUpgradeDismissed);
  },

  getAnonFirstUseDate: function () {
    const dateStr = localStorage[this.Keys.AnonFirstUseDate];
    return dateStr ? new Date(dateStr) : null;
  },

  getDaysSinceFirstUse: function () {
    const firstUse = this.getAnonFirstUseDate();
    if (!firstUse) return 0;
    const now = new Date();
    const diffMs = now - firstUse;
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  },

  getThemePreference: function () {
    return localStorage.getItem(this.Keys.ThemePreference);
  },

  setThemePreference: function (theme) {
    localStorage.setItem(this.Keys.ThemePreference, theme);
  },

  clearThemePreference: function () {
    localStorage.removeItem(this.Keys.ThemePreference);
  },

  didShowDailyFeedbackToday: function () {
    const lastDate = localStorage[this.Keys.DailyFeedbackLastShown];
    return lastDate === new Date().toDateString();
  },

  setDailyFeedbackShown: function () {
    localStorage[this.Keys.DailyFeedbackLastShown] = new Date().toDateString();
  },
};

export default LocalStorage;
