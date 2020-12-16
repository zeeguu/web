import fetch from 'cross-fetch'

function apiLog (what) {
  console.log('➡️ ' + what)
}

const Zeeguu_API = class {
  constructor (baseAPIurl) {
    this.baseAPIurl = baseAPIurl
  }

  addUser (email, password, invite_code, user_name, onSuccess) {
    let url = this.baseAPIurl + `/add_user/${email}`
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `password=${password}&invite_code=${invite_code}&username=${user_name}`
    }).then(response => {
      response.text().then(session => {
        // console.log("GOT SESSION AFTER CREATING USER: " + session);
        this.session = session
        onSuccess(session)
      })
    })
  }

  signIn (email, password, onError, onSuccess) {
    let url = this.baseAPIurl + `/session/${email}`
    apiLog(`/session/${email}`)

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `password=${password}`
    })
      .then(response => {
        // https://stackoverflow.com/a/45366905/1200070
        response.json().then(data => {
          if (response.status === 200) {
            this.session = data
            onSuccess(data)
            return
          }
          onError(data.message)
        })
      })
      .catch(error => {
        if (!error.response) {
          onError(
            'There seems to be a problem with the server. Please try again later.'
          )
        }
      })
  }

  getUserDetails (callback) {
    this._get('get_user_details', callback)
  }

  saveUserDetails (user_details, setErrorMessage, onSuccess) {
    apiLog(this._appendSessionToUrl('user_settings'))
    fetch(this._appendSessionToUrl('user_settings'), {
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

  getUserArticles (callback) {
    this._get('user_articles/recommended', callback)
  }

  getBookmarkedArticles (callback) {
    this._get('user_articles/starred_or_liked', callback)
  }

  getCohortArticles (callback) {
    this._get('cohort_articles', callback)
  }

  getArticleInfo (articleID, callback) {
    this._get(`user_article?article_id=${articleID}`, callback)
  }

  getUserBookmarksToStudy (count, callback) {
    this._get(`bookmarks_to_study/${count}`, callback)
  }

  getInterestingTopics (callback) {
    this._get('interesting_topics', callback)
  }

  getSubscribedTopics (callback) {
    this._get('subscribed_topics', callback)
  }

  subscribeToTopic (topic) {
    return this._post(`subscribe_topic`, `topic_id=${topic.id}`)
  }

  unsubscribeFromTopic (topic) {
    return this._post(`unsubscribe_topic`, `topic_id=${topic.id}`)
  }

  getPossibleTranslations (from_lang, to_lang, word, context, pageUrl) {
    let url = this._appendSessionToUrl(
      `get_possible_translations/${from_lang}/${to_lang}`
    )

    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `word=${word}&context=${context}&url=${pageUrl}`
    })
  }

  uploadExerciseFeedback (
    exercise_outcome,
    exercise_source,
    exercise_solving_speed,
    bookmark_id
  ) {
    this._post(
      `report_exercise_outcome/${exercise_outcome}/${exercise_source}/${exercise_solving_speed}/${bookmark_id}`,
      null
    )
  }

  _appendSessionToUrl (endpointName) {
    if (endpointName.includes('?')) {
      return `${this.baseAPIurl}/${endpointName}&session=${this.session}`
    }
    return `${this.baseAPIurl}/${endpointName}?session=${this.session}`
  }

  _get (endpoint, callback) {
    apiLog('GET' + endpoint)
    fetch(this._appendSessionToUrl(endpoint, this.session))
      .then(response => response.json())
      .then(data => {
        callback(data)
      })
  }

  _post (endpoint, body) {
    apiLog('POST' + endpoint)

    const url = this._appendSessionToUrl(endpoint)

    let params = { method: 'POST' }
    if (body) {
      params = {
        ...params,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body
      }
    }

    console.log(params)

    fetch(url, params)
  }
}

export default Zeeguu_API
