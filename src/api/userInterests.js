import { Zeeguu_API } from "./classDef";

/* Note the distinction between topics and searches:
  - topics are predefined
  - searches are user-defined

  */

// INTERESTS

// Topics that can be subscribed to
Zeeguu_API.prototype.getAvailableTopics = function (callback) {
  this._getJSON("available_topics", callback);
};

// New Topics that can be subscribed to
Zeeguu_API.prototype.getAvailableNewTopics = function (callback) {
  this._getJSON("available_new_topics", callback);
};

// Topics already subscribed to
Zeeguu_API.prototype.getSubscribedTopics = function (callback) {
  this._getJSON("subscribed_topics", callback);
};

// New Topics already subscribed to
Zeeguu_API.prototype.getSubscribedNewTopics = function (callback) {
  this._getJSON("subscribed_new_topics", callback);
};

Zeeguu_API.prototype.getSubscribedSearchers = function (callback) {
  this._getJSON("subscribed_searches", callback);
};

/* 
  Subscribes to predefined topic (e.g. sports, politics, etc.)
  */
Zeeguu_API.prototype.subscribeToTopic = function (topic) {
  return this._post(`subscribe_topic`, `topic_id=${topic.id}`);
};
/* 
  Subscribes to predefined new topic (e.g. sports, politics, etc.)
  */
Zeeguu_API.prototype.subscribeToNewTopic = function (new_topic) {
  return this._post(`subscribe_new_topic`, `new_topic_id=${new_topic.id}`);
};

/* Opposite of subscribe */
Zeeguu_API.prototype.unsubscribeFromTopic = function (topic) {
  return this._post(`unsubscribe_topic`, `topic_id=${topic.id}`);
};

/* Opposite of subscribe */
Zeeguu_API.prototype.unsubscribeFromNewTopic = function (new_topic) {
  return this._post(`unsubscribe_new_topic`, `new_topic_id=${new_topic.id}`);
};

/* 
  Subscribes to a search term (e.g. "Trump", "Corona", etc.)
  */
Zeeguu_API.prototype.subscribeToSearch = function (searchTerm, callback) {
  return this._getJSON(`subscribe_search/${searchTerm}`, callback);
};
/* Opposite of unsubscribe */
Zeeguu_API.prototype.unsubscribeFromSearch = function (search) {
  return this._post(`unsubscribe_search`, `search_id=${search.id}`);
};

/* 
  Subscribes to email updates about a subscribed search.
  */
Zeeguu_API.prototype.subscribeToEmailSearch = function (searchTerm, callback) {
  return this._getJSON(`subscribe_to_email_search/${searchTerm}`, callback);
};
/* unsubscribes from email updates about a subscribed search */
Zeeguu_API.prototype.unsubscribeFromEmailSearch = function (
  searchTerm,
  callback,
) {
  return this._getJSON(`unsubscribe_from_email_search/${searchTerm}`, callback);
};

// NON-INTERESTS
// These are topics and searches that the user has explicitly filtered out because they don't want to see them
Zeeguu_API.prototype.getExcludedTopics = function (callback) {
  this._getJSON("filtered_topics", callback);
};

Zeeguu_API.prototype.getExcludedNewTopics = function (callback) {
  this._getJSON("filtered_new_topics", callback);
};

Zeeguu_API.prototype.getUnwantedKeywords = function (callback) {
  this._getJSON("filtered_searches", callback);
};

Zeeguu_API.prototype.excludeTopic = function (filter) {
  return this._post(`filter_topic`, `filter_id=${filter.id}`);
};

Zeeguu_API.prototype.excludeNewTopic = function (filter) {
  return this._post(`filter_new_topic`, `filter_id=${filter.id}`);
};

Zeeguu_API.prototype.addUnwantedKeyword = function (filter, callback) {
  return this._getJSON(`filter_search/${filter}`, callback);
};

Zeeguu_API.prototype.removeUnwantedKeyword = function (filter) {
  return this._post(`unfilter_search`, `search_id=${filter.id}`);
};

Zeeguu_API.prototype.unexcludeTopic = function (filter) {
  // here it's topic_id / above it's filter_id;
  // stupid bug in the API...
  return this._post("unfilter_topic", `topic_id=${filter.id}`);
};

Zeeguu_API.prototype.unexcludeNewTopic = function (filter) {
  // here it's topic_id / above it's filter_id;
  // stupid bug in the API...
  return this._post("unfilter_new_topic", `new_topic_id=${filter.id}`);
};

Zeeguu_API.prototype.topicsAvailableForExclusion = function (callback) {
  this.getAvailableTopics((interesting) => {
    this.getSubscribedTopics((subscribed) => {
      this.getExcludedTopics((filtered) => {
        var available = interesting.filter((e) => !subscribed.includes(e));
        var allAvailable = [...available, ...filtered];
        allAvailable.sort((a, b) => a.title.localeCompare(b.title));
        callback(allAvailable);
      });
    });
  });
};

Zeeguu_API.prototype.newTopicsAvailableForExclusion = function (callback) {
  this.getAvailableNewTopics((interesting) => {
    this.getSubscribedNewTopics((subscribed) => {
      this.getExcludedNewTopics((filtered) => {
        var available = interesting.filter((e) => !subscribed.includes(e));
        var allAvailable = [...available, ...filtered];
        allAvailable.sort((a, b) => a.title.localeCompare(b.title));
        callback(allAvailable);
      });
    });
  });
};
