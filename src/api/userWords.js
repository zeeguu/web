import { Zeeguu_API } from "./classDef";
import { MAX_BOOKMARKS_TO_STUDY_PER_ARTICLE } from "../exercises/ExerciseConstants";
import { USER_WORD_PREFERENCE } from "../words/userBookmarkPreferences.js";
import qs from "qs";


Zeeguu_API.prototype.getBookmarksByDay = function (callback) {
  let payload = {
    with_context: true,
  };
  this._post(
    "bookmarks_by_day",
    qs.stringify(payload),
    callback,
    () => {},
    true,
  );
};

Zeeguu_API.prototype.getBookmarksCountsByDate = function (callback) {
  this._getJSON("bookmark_counts_by_date", callback);
};

Zeeguu_API.prototype.starredBookmarks = function (count, callback) {
  this._getJSON(`starred_bookmarks/${count}`, callback);
};

Zeeguu_API.prototype.learnedBookmarks = function (count, callback) {
  this._getJSON(`learned_bookmarks/${count}`, callback);
};

Zeeguu_API.prototype.learnedUserWords = function (count, callback) {
  this._getJSON(`learned_user_words/${count}`, callback);
};

Zeeguu_API.prototype.totalLearnedBookmarks = function (callback) {
  this._getJSON(`total_learned_bookmarks`, callback);
};

Zeeguu_API.prototype.totalLearnedUserWords = function (callback) {
  this._getJSON(`total_learned_user_words`, callback);
};

Zeeguu_API.prototype.topBookmarks = function (count, callback) {
  this._getJSON(`top_bookmarks/${count}`, callback);
};

Zeeguu_API.prototype.bookmarksForArticle = function (articleId, callback) {
  this._getJSON(`bookmarks_for_article/${articleId}`, (result) =>
    callback(result.bookmarks),
  );
};

/**
 * Get words to study for a specific article
 *
 * @param {number} articleId - The ID of the article
 * @param {boolean} isWithTokens - Whether to include tokenization data
 * @param {Function} callback - Function to call with the results
 */
Zeeguu_API.prototype.wordsToStudyForArticle = function (
  articleId,
  isWithTokens,
  callback,
) {
  let payload = {
    with_tokens: isWithTokens,
  };
  let endpoint = `words_to_study_for_article/${articleId}`;
  if (isWithTokens)
        this._post(
          endpoint,
          qs.stringify(payload),
          callback,
          (error) => {
            console.error(error);
          },
          true,
        );
  else this._getJSON(endpoint, (result) => callback(result));
};

Zeeguu_API.prototype.getPracticedBookmarksCountThisWeek = function (callback) {
  this._getJSON("practiced_user_word_count_this_week", callback);
}

Zeeguu_API.prototype.getBookmarksCountByLevel = function (callback) {
  let payload = {
     with_context: true,
  };
  this._post(
    "bookmarks_count_by_level",
    qs.stringify(payload),
    callback,
    () => {},
    true,
  );
};

Zeeguu_API.prototype.getBookmarkWithContext = function (bookmarkId, callback) {
  this._getJSON(`bookmark_with_context/${bookmarkId}`, callback);
};

// individual bookmark handling

Zeeguu_API.prototype.unstarBookmark = function (bookmark_id) {
  this._post(`unstar_bookmark/${bookmark_id}`);
};

Zeeguu_API.prototype.starBookmark = function (bookmark_id) {
  this._post(`star_bookmark/${bookmark_id}`);
};
Zeeguu_API.prototype.deleteBookmark = function (
  bookmark_id,
  callback,
  onError,
) {
  this._post(`delete_bookmark/${bookmark_id}`, "", callback, onError);
};

Zeeguu_API.prototype.setIsFitForStudy = function (bookmark_id) {
  this._post(`is_fit_for_study/${bookmark_id}`);
};

Zeeguu_API.prototype.setNotFitForStudy = function (bookmark_id) {
  this._post(`not_fit_for_study/${bookmark_id}`);
};

Zeeguu_API.prototype.userSetForExercises = function (bookmark_id) {
  this._post(`use_in_exercises/${bookmark_id}`);
};

Zeeguu_API.prototype.userSetNotForExercises = function (bookmark_id, reason = "") {
  this._post(`dont_use_in_exercises/${bookmark_id}`, { reason });
};

Zeeguu_API.prototype.prioritizeBookmarksToStudy = function (
  articleID,
  setUpdatedBookmarks,
) {
  function setFitToStudyIfNotAlready(api, bookmark, seenBookmarks) {
    seenBookmarks.add(bookmark.from.toLowerCase());
    if (!bookmark.fit_for_study) {
      bookmark.fit_for_study = true;
      api.setIsFitForStudy(bookmark.id);
    }
  }

  function setNotFitToStudyIfNotAlready(api, bookmark) {
    if (bookmark.fit_for_study) {
      bookmark.fit_for_study = false;
      api.setNotFitForStudy(bookmark.id);
    }
  }

  this.bookmarksForArticle(articleID, (bookmarks) => {
    let hasUserEditedWords = bookmarks.some(
      (each) => each.user_preference !== 0,
    );
    if (hasUserEditedWords) {
      // User has edited bookmarks, do not make any preferences.
      if (setUpdatedBookmarks) setUpdatedBookmarks(bookmarks);
      return;
    }

    // When the user has not any preferences, prioritize bookmarks.
    let seenBookmarks = new Set([]);
    let sortedBookmarks = [...bookmarks].sort(
      (bookmark_a, bookmark_b) =>
        bookmark_b.origin_importance - bookmark_a.origin_importance,
    );
    let totalAddedBookmarks = 0;

    for (let i = 0; i < sortedBookmarks.length; i++) {
      let bookmark = sortedBookmarks[i];

      let isRepeatedBookmark = seenBookmarks.has(bookmark.from.toLowerCase());
      let isBookmarkTooLong = bookmark.from.split(" ").length >= 3;
      let isUserExcludedBookmark =
        bookmark.user_preference === USER_WORD_PREFERENCE.DONT_USE_IN_EXERCISES;
      let isUserAddedBookmark =
        bookmark.user_preference === USER_WORD_PREFERENCE.USE_IN_EXERCISES;
      let isBookmarkLearned = bookmark.learned_datetime !== "";

      if (isUserAddedBookmark && !isBookmarkLearned) {
        setFitToStudyIfNotAlready(this, bookmark, seenBookmarks);
      } else if (isUserExcludedBookmark) {
        setNotFitToStudyIfNotAlready(this, bookmark);
      } else {
        if (
          !isBookmarkTooLong &&
          !isRepeatedBookmark &&
          !isBookmarkLearned &&
          totalAddedBookmarks < MAX_BOOKMARKS_TO_STUDY_PER_ARTICLE
        ) {
          setFitToStudyIfNotAlready(this, bookmark, seenBookmarks);
          totalAddedBookmarks += 1;
        } else {
          if (
            !bookmark.starred ||
            isUserExcludedBookmark ||
            isRepeatedBookmark
          ) {
            setNotFitToStudyIfNotAlready(this, bookmark);
          }
        }
      }
    }
    if (setUpdatedBookmarks) setUpdatedBookmarks(bookmarks);
  });
};

Zeeguu_API.prototype.addCustomWord = function (
  word,
  translation,
  fromLang,
  toLang,
  context,
  callback,
  errorCallback
) {
  const payload = JSON.stringify({
    word: word,
    translation: translation,
    from_lang: fromLang,
    to_lang: toLang,
    context: context || ""
  });
  
  fetch(this._appendSessionToUrl("add_custom_word"), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: payload
  })
  .then(response => {
    return response.json().then(data => ({ status: response.status, data }));
  })
  .then(({ status, data }) => {
    if (status >= 200 && status < 300) {
      // Success
      if (callback) callback(data);
    } else {
      // Error response from server
      if (errorCallback) errorCallback(data);
    }
  })
  .catch(error => {
    // Network or parsing error
    if (errorCallback) errorCallback({ error: "Network error", detail: error.message });
  });
};

Zeeguu_API.prototype.getGeneratedExamples = function (
  word,
  fromLang,
  toLang,
  callback,
  errorCallback
) {
  const url = `generate_examples/${encodeURIComponent(word)}/${fromLang}/${toLang}`;
  this._getJSON(url, (result) => {
    // Extract examples from the response
    const examples = result.examples || [];
    if (callback) callback(examples);
  }, errorCallback);
};
