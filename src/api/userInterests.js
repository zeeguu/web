import { Zeeguu_API } from './classDef'

Zeeguu_API.prototype.search = function (term, callback) {
  return this._get(`search/${term}`, callback)
}

Zeeguu_API.prototype.getInterestingTopics = function (callback) {
  this._get('interesting_topics', callback)
}

Zeeguu_API.prototype.getSubscribedTopics = function (callback) {
  this._get('subscribed_topics', callback)
}

Zeeguu_API.prototype.getSubscribedSearchers = function (callback) {
  this._get('subscribed_searches', callback)
}

Zeeguu_API.prototype.subscribeToTopic = function (topic) {
  return this._post(`subscribe_topic`, `topic_id=${topic.id}`)
}

Zeeguu_API.prototype.unsubscribeFromTopic = function (topic) {
  return this._post(`unsubscribe_topic`, `topic_id=${topic.id}`)
}

Zeeguu_API.prototype.subscribeToSearch = function (searchTerm, callback) {
  return this._get(`subscribe_search/${searchTerm}`, callback)
}
Zeeguu_API.prototype.unsubscribeFromSearch = function (search) {
  return this._post(`unsubscribe_search`, `search_id=${search.id}`)
}

// Filters / Uninteresting Topics
Zeeguu_API.prototype.getFilteredTopics = function (callback) {
  this._get('filtered_topics', callback)
}

Zeeguu_API.prototype.getSubscribedFilterSearches = function (callback) {
  this._get('filtered_searches', callback)
}

Zeeguu_API.prototype.subscribeToFilter = function (filter) {
  return this._post(`filter_topic`, `filter_id=${filter.id}`)
}

Zeeguu_API.prototype.subscribeToSearchFilter = function (filter, callback) {
  return this._get(`filter_search/${filter}`, callback)
}

Zeeguu_API.prototype.unsubscribeFromSearchFilter = function (filter) {
  return this._post(`unfilter_search`, `search_id=${filter.id}`)
}

Zeeguu_API.prototype.unsubscribeFromFilter = function (filter) {
  // here it's tpoic_id / above it's filter_id;
  // stupid bug in the API...
  return this._post('unfilter_topic', `topic_id=${filter.id}`)
}

Zeeguu_API.prototype.interestingButNotSubscribedTopics = function (callback) {
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
