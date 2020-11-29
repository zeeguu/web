import LocalStorage from '../LocalStorage'

const baseAPIUrl = process.env.REACT_APP_API_URL
console.log('API Url: ' + baseAPIUrl)

function getUrl (endpointName) {
  const sessionID = LocalStorage.session()

  if (endpointName.includes('?')) {
    return `${baseAPIUrl}/${endpointName}&session=${sessionID}`
  }
  return `${baseAPIUrl}/${endpointName}?session=${sessionID}`
}

function generalPost (endpoint, callback) {
  fetch(getUrl(endpoint), { method: 'POST' })
}

function generalGet (endpoint, callback) {
  fetch(getUrl(endpoint))
    .then(response => response.json())
    .then(data => {
      callback(data)
    })
}

function getUrl2 (endpointName, sessionID) {
  if (endpointName.includes('?')) {
    return `${baseAPIUrl}/${endpointName}&session=${sessionID}`
  }
  return `${baseAPIUrl}/${endpointName}?session=${sessionID}`
}

function generalGet2 (endpoint, session, callback) {
  fetch(getUrl2(endpoint, session))
    .then(response => response.json())
    .then(data => {
      callback(data)
    })
}

function getUserDetails2 (session, callback) {
  generalGet2('get_user_details', session, callback)
}

function getUserDetails (callback) {
  generalGet2('get_user_details', callback)
}

function getBookmarksToStudy (count, callback) {
  generalGet(`bookmarks_to_study/${count}`, callback)
}

function uploadExerciseFeedback (
  exercise_outcome,
  exercise_source,
  exercise_solving_speed,
  bookmark_id
) {
  generalPost(
    `report_exercise_outcome/${exercise_outcome}/${exercise_source}/${exercise_solving_speed}/${bookmark_id}`
  )
}

function getUserArticles (callback) {
  generalGet('user_articles/recommended', callback)
}

function getArticleInfo (articleID, callback) {
  generalGet(`user_article?article_id=${articleID}`, callback)
}

function attemptToSignIn (
  email,
  password,

  setErrorMessage,
  onSuccess
) {
  const url = `${baseAPIUrl}/session/${email}`
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `password=${password}`
  })
    .then(response => {
      if (response.status !== 200) {
        throw response
      }
      return response.json()
    })
    .then(data => {
      onSuccess(data)
    })
    .catch(error => {
      console.log(error)
      setErrorMessage('Invalid credentials')
    })
}

function attemptToSave (user_details, setErrorMessage, onSuccess) {
  fetch(getUrl('user_settings'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body:
      `name=${user_details.name}&email=${user_details.email}` +
      `&learned_language=${user_details.learned_language}` +
      `&native_language=${user_details.native_language}`
  })
    .then(response => {
      if (response.status !== 200) {
        throw response
      }
      return response // OK in case of success
    })
    .then(data => {
      onSuccess(data)
    })
    .catch(error => {
      console.log(error)
      setErrorMessage('Invalid credentials')
    })
}

export {
  getUserDetails,
  getUserDetails2,
  getUserArticles,
  getArticleInfo,
  attemptToSignIn,
  attemptToSave,
  getBookmarksToStudy,
  uploadExerciseFeedback
}
