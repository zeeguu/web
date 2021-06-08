const LocalStorage = {
  Keys: {
    Session: "sessionID",
    Name: "name",
    LearnedLanguage: "learned_language",
    NativeLanguage: "native_language",
    UiLanguage: "ui_language",
    IsTeacher: "is_teacher",
  },

  // Getting Info
  hasSession: function () {
    return localStorage[this.Keys.Session];
  },

  session: function () {
    return localStorage[this.Keys.Session];
  },

  userInfo: function () {
    return {
      name: localStorage[this.Keys.Name],
      learned_language: localStorage[this.Keys.LearnedLanguage],
      native_language: localStorage[this.Keys.NativeLanguage],
      is_teacher: localStorage[this.Keys.IsTeacher],
    };
  },

  // Setting info
  locallySetName: function (newName) {
    localStorage[this.Keys.Name] = newName;
  },

  setSession: function (session) {
    localStorage[this.Keys.Session] = session;
  },

  setUiLanguage: function (language) {
    localStorage[this.Keys.UiLanguage] = JSON.stringify(language);
  },

  getUiLanguage: function () {
    const uiLang = localStorage[this.Keys.UiLanguage];
    if (uiLang === undefined) {
      return undefined; // This is needed for some reason. Returning uiLang will not work
    } else {
      return JSON.parse(uiLang); // App breaks if trying to JSON.parse if uiLang is undefined. Therefore abstracting to here.
    }
  },

  setUserInfo: function (info) {
    localStorage[this.Keys.Name] = info.name;
    localStorage[this.Keys.LearnedLanguage] = info.learned_language;
    localStorage[this.Keys.NativeLanguage] = info.native_language;
    localStorage[this.Keys.IsTeacher] = info.is_teacher;
  },

  deleteUserInfo: function () {
    try {
      localStorage.removeItem(this.Keys.Name);
      localStorage.removeItem(this.Keys.LearnedLanguage);
      localStorage.removeItem(this.Keys.NativeLanguage);
      localStorage.removeItem(this.Keys.Session);
    } catch (e) {
      console.log(e);
    }
  },
};

export default LocalStorage;
