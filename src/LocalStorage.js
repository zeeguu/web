const StorageKeys = {
  Session: 'sessionID',
  Name: 'name',
  LearnedLanguage: 'learned_language',
  NativeLanguage: 'native_language'
}

function locallySetName (newName) {
  localStorage[StorageKeys.Name] = newName
}

function setSessionInLocalStorage (session) {
  localStorage[StorageKeys.Session] = session
}

function setUserInfoInLocalStorage (info) {
  localStorage[StorageKeys.Name] = info.name
  localStorage[StorageKeys.LearnedLanguage] = info.learned_language
  localStorage[StorageKeys.NativeLanguage] = info.native_language
}

function deleteUserInfoFromLocalStorage () {
  try {
    localStorage.removeItem(StorageKeys.Name)
    localStorage.removeItem(StorageKeys.LearnedLanguage)
    localStorage.removeItem(StorageKeys.NativeLanguage)
    localStorage.removeItem(StorageKeys.Session)
  } catch (e) {
    console.log(e)
  }
}

function userInfoFromLocalStorage () {
  return {
    name: localStorage[StorageKeys.Name],
    learned_language: localStorage[StorageKeys.LearnedLanguage],
    native_language: localStorage[StorageKeys.NativeLanguage]
  }
}

export {
  StorageKeys,
  locallySetName,
  setUserInfoInLocalStorage,
  deleteUserInfoFromLocalStorage,
  setSessionInLocalStorage,
  userInfoFromLocalStorage
}
