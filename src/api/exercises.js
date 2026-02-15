import { Zeeguu_API } from "./classDef";
import qs from "qs";

Zeeguu_API.prototype.getBookmarksDueToday = function (count, callback) {
  this._getJSON(`bookmarks_due_today/${count}`, callback);
};

// All Scheduled User Words
Zeeguu_API.prototype.getAllScheduledUserWords = function (isWithTokens, callback) {
  let endpoint = `all_scheduled_user_words`;
  let payload = {
    with_tokens: isWithTokens,
  };
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
  else this._getJSON(endpoint, callback);
};

Zeeguu_API.prototype.getCountOfAllScheduledUserWords = function (callback) {
  this._getJSON(`count_of_all_scheduled_user_words`, callback);
};

// User Words recommended to be studied today
Zeeguu_API.prototype.getCountOfUserWordsRecommendedForPractice = function (callback) {
  this._getJSON(`count_of_user_words_recommended_for_practice`, callback);
};

Zeeguu_API.prototype.getUserWordsRecommendedForPractice = function (callback) {
  this._getJSON(`user_words_recommended_for_practice`, callback);
};

Zeeguu_API.prototype.getNextWordDueTime = function (callback) {
  this._getJSON(`next_word_due_time`, callback);
};

Zeeguu_API.prototype.getUserWordsNextInLearning = function (callback) {
  this._getJSON(`user_words_next_in_learning`, callback);
};

// Backward compatibility (deprecated methods)
Zeeguu_API.prototype.getAllScheduledBookmarks = function (isWithTokens, callback) {
  return this.getAllScheduledUserWords(isWithTokens, callback);
};

Zeeguu_API.prototype.getCountOfAllScheduledWords = function (callback) {
  return this.getCountOfAllScheduledUserWords(callback);
};

Zeeguu_API.prototype.getCountOfBookmarksRecommendedForPractice = function (callback) {
  return this.getCountOfUserWordsRecommendedForPractice(callback);
};

Zeeguu_API.prototype.getBookmarksRecommendedForPractice = function (callback) {
  return this.getUserWordsRecommendedForPractice(callback);
};

Zeeguu_API.prototype.getBookmarksNextInLearning = function (callback) {
  return this.getUserWordsNextInLearning(callback);
};

Zeeguu_API.prototype.uploadExerciseFeedback = function (
  user_feedback,
  exercise_source,
  exercise_solving_speed,
  user_word_id,
  exerciseSessionId,
) {
  let payload = {
    outcome: "other_feedback",
    source: exercise_source,
    solving_speed: exercise_solving_speed,
    user_word_id: user_word_id,
    other_feedback: user_feedback,
    session_id: exerciseSessionId,
  };
  this._post(`report_exercise_outcome`, qs.stringify(payload));
};

Zeeguu_API.prototype.uploadExerciseFinalizedData = function (
  exercise_outcome,
  exercise_source,
  exercise_solving_speed,
  user_word_id,
  exerciseSessionId,
  other_feedback,
) {
  let payload = {
    outcome: exercise_outcome,
    source: exercise_source,
    solving_speed: exercise_solving_speed,
    user_word_id: user_word_id,
    other_feedback: other_feedback,
    session_id: exerciseSessionId,
  };
  this._post(`report_exercise_outcome`, qs.stringify(payload));
};

Zeeguu_API.prototype.wordsSimilarTo = function (bookmark_id, callback) {
  this._getJSON(`similar_words/${bookmark_id}`, callback);
};

Zeeguu_API.prototype.getConfusionWords = function (lang, original_sentence, callback) {
  let payload = {
    original_sent: original_sentence,
    language: lang,
  };

  return this._post(`/create_confusion_words`, qs.stringify(payload), callback);
};

Zeeguu_API.prototype.annotateClues = function (word_props, og_sent, lang, callback) {
  let payload = {
    word_with_props: JSON.stringify(word_props),
    original_sentence: og_sent,
    language: lang,
  };
  return this._post(`/annotate_clues`, qs.stringify(payload), callback);
};

Zeeguu_API.prototype.getShorterSimilarSentsInArticle = function (articleText, contextBookmark, lang, callback) {
  let payload = {
    article_text: articleText,
    bookmark_context: contextBookmark,
    language: lang,
  };
  return this._post(`/get_shorter_similar_sents_in_article`, qs.stringify(payload), callback);
};

Zeeguu_API.prototype.getSmallerContext = function (contextBookmark, wordBookmark, lang, contextLen, callback) {
  let payload = {
    bookmark_context: contextBookmark,
    bookmark_word: wordBookmark,
    language: lang,
    max_context_len: contextLen,
  };
  return this._post(`/get_smaller_context`, qs.stringify(payload), callback);
};

Zeeguu_API.prototype.reportExerciseIssue = function (
  bookmarkId,
  exerciseSource,
  reason,
  comment,
  contextUsed,
  callback,
  errorCallback
) {
  const payload = JSON.stringify({
    bookmark_id: bookmarkId,
    exercise_source: exerciseSource,
    reason,
    comment: comment || null,
    context_used: contextUsed || null
  });

  fetch(this._appendSessionToUrl("report_exercise_issue"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: payload
  })
  .then(response => response.json().then(data => ({ status: response.status, data })))
  .then(({ status, data }) => {
    if (status >= 200 && status < 300 && data.success) {
      if (callback) callback(data);
    } else {
      if (errorCallback) errorCallback(data);
    }
  })
  .catch(error => {
    console.error("Error reporting exercise issue:", error);
    if (errorCallback) errorCallback({ error: "Network error" });
  });
};
