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

  getSystemLanguages (callback) {
    this._get('system_languages', callback)
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

  // words

  getBookmarksByDay (callback) {
    this._get('bookmarks_by_day/with_context', callback)
  }

  starredBookmarks (count, callback) {
    this._get(`starred_bookmarks/${count}`, callback)
  }

  learnedBookmarks (count, callback) {
    this._get(`learned_bookmarks/${count}`, callback)
  }

  topBookmarks (count, callback) {
    this._get(`top_bookmarks/${count}`, callback)
  }

  bookmarksForArticle (articleId, callback) {
    this._get(`bookmarks_for_article/${articleId}`, result =>
      callback(result.bookmarks)
    )
  }

  // individual bookmark handling

  unstarBookmark (bookmark_id) {
    this._post(`unstar_bookmark/${bookmark_id}`)
  }

  starBookmark (bookmark_id) {
    this._post(`star_bookmark/${bookmark_id}`)
  }

  deleteBookmark (bookmark_id, callback) {
    this._post(`delete_bookmark/${bookmark_id}`, '', callback)
  }

  // articles
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

  setArticleInfo (articleInfo, callback) {
    this._post(
      `user_article`,
      `article_id=${articleInfo.id}` +
        `&starred=${articleInfo.starred}` +
        `&liked=${articleInfo.liked}`,
      callback
    )
  }

  getUserBookmarksToStudy (count, callback) {
    this._get(`bookmarks_to_study/${count}`, callback)
  }

  // Interesting Topics
  getInterestingTopics (callback) {
    this._get('interesting_topics', callback)
  }

  getSubscribedTopics (callback) {
    this._get('subscribed_topics', callback)
  }

  getSubscribedSearchers (callback) {
    this._get('subscribed_searches', callback)
  }

  subscribeToTopic (topic) {
    return this._post(`subscribe_topic`, `topic_id=${topic.id}`)
  }

  unsubscribeFromTopic (topic) {
    return this._post(`unsubscribe_topic`, `topic_id=${topic.id}`)
  }

  subscribeToSearch (searchTerm, callback) {
    return this._get(`subscribe_search/${searchTerm}`, callback)
  }
  unsubscribeFromSearch (search) {
    return this._post(`unsubscribe_search`, `search_id=${search.id}`)
  }

  // Filters / Uninteresting Topics
  getFilteredTopics (callback) {
    this._get('filtered_topics', callback)
  }

  getSubscribedFilterSearches (callback) {
    this._get('filtered_searches', callback)
  }

  subscribeToFilter (filter) {
    return this._post(`filter_topic`, `filter_id=${filter.id}`)
  }

  subscribeToSearchFilter (filter, callback) {
    return this._get(`filter_search/${filter}`, callback)
  }

  unsubscribeFromSearchFilter (filter) {
    return this._post(`unfilter_search`, `search_id=${filter.id}`)
  }

  unsubscribeFromFilter (filter) {
    // here it's tpoic_id / above it's filter_id;
    // stupid bug in the API...
    return this._post('unfilter_topic', `topic_id=${filter.id}`)
  }

  interestingButNotSubscribedTopics (callback) {
    this.getInterestingTopics(interesting => {
      this.getSubscribedTopics(subscribed => {
        this.getFilteredTopics(filtered => {
          var available = interesting.filter(e => !subscribed.includes(e))
          var allAvailable = [...available, ...filtered]
          allAvailable.sort((a, b) => a.title.localeCompare(b.title))
          callback(allAvailable)
        })
      })
    })
  }

  // search

  search (term, callback) {
    return this._get(`search/${term}`, callback)
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

  getOneTranslation (
    from_lang,
    to_lang,
    word,
    context,
    articleUrl,
    articleTitle
  ) {
    let url = this._appendSessionToUrl(
      `get_one_translation/${from_lang}/${to_lang}`
    )

    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `word=${word}&context=${context}&url=${articleUrl}&title=${articleTitle}`
    })
  }

  getNextTranslations (
    from_lang,
    to_lang,
    word,
    context,
    pageUrl,
    numberOfResults,
    service,
    currentTranslation
  ) {
    let url = this._appendSessionToUrl(
      `get_next_translations/${from_lang}/${to_lang}`
    )

    let body = `word=${word}&context=${context}&url=${pageUrl}&numberOfResults=${numberOfResults}`

    if (service) {
      body += `&service=${service}`
    }

    if (currentTranslation) {
      body += `&currentTranslation=${currentTranslation}`
    }

    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body
    })
  }

  contributeTranslation (
    from_lang,
    to_lang,
    word,
    translation,
    context,
    pageUrl,
    pageTitle
  ) {
    let url = this._appendSessionToUrl(
      `contribute_translation/${from_lang}/${to_lang}`
    )

    let body = `word=${word}&translation=${translation}&context=${context}&url=${pageUrl}&pageTitle=${pageTitle}`

    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body
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

  _post (endpoint, body, callback) {
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

    if (callback) {
      fetch(url, params).then(data => callback(data))
    } else {
      fetch(url, params)
    }
  }
}

export default Zeeguu_API
