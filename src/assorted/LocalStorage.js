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
    localStorage[this.Keys.UiLanguage] = language;
  },

  getUiLanguage: function() {
    return localStorage[this.Keys.UiLanguage]
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
