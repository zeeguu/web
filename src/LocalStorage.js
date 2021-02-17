const LocalStorage = {
  Keys: {
    Session: 'sessionID',
    Name: 'name',
    LearnedLanguage: 'learned_language',
    NativeLanguage: 'native_language'
  },

  // Getting Info
  hasSession: function () {
    return localStorage[this.Keys.Session]
  },

  session: function () {
    return localStorage[this.Keys.Session]
  },

  userInfo: function () {
    return {
      name: localStorage[this.Keys.Name],
      learned_language: localStorage[this.Keys.LearnedLanguage],
      native_language: localStorage[this.Keys.NativeLanguage]
    }
  },

  // Setting info
  locallySetName: function (newName) {
    localStorage[this.Keys.Name] = newName
  },

  setSession: function (session) {
    localStorage[this.Keys.Session] = session
  },

  setUserInfo: function (info) {
    localStorage[this.Keys.Name] = info.name
    localStorage[this.Keys.LearnedLanguage] = info.learned_language
    localStorage[this.Keys.NativeLanguage] = info.native_language
  },

  deleteUserInfo: function () {
    try {
      localStorage.removeItem(this.Keys.Name)
      localStorage.removeItem(this.Keys.LearnedLanguage)
      localStorage.removeItem(this.Keys.NativeLanguage)
      localStorage.removeItem(this.Keys.Session)
    } catch (e) {
      console.log(e)
    }
  }
}

export default LocalStorage
