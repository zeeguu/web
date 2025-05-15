import { Zeeguu_API } from "./classDef";
import qs from "qs";

Zeeguu_API.prototype.getBookmarksDueToday = function (count, callback) {
  this._getJSON(`bookmarks_due_today/${count}`, callback);
};

// All Scheduled Bookmarks
Zeeguu_API.prototype.getAllScheduledBookmarks = function (isWithTokens, callback) {
  let endpoint = `all_scheduled_bookmarks`;
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

Zeeguu_API.prototype.getCountOfAllScheduledBookmarks = function (callback) {
  this._getJSON(`count_of_all_scheduled_bookmarks`, callback);
};

// Bookmarks recommended to be studied today
Zeeguu_API.prototype.getCountOfBookmarksRecommendedForPractice = function (callback) {
  this._getJSON(`count_of_bookmarks_recommended_for_practice`, callback);
};

Zeeguu_API.prototype.getBookmarksRecommendedForPractice = function (callback) {
  this._getJSON(`bookmarks_recommended_for_practice`, callback);
};

Zeeguu_API.prototype.getBookmarksNextInLearning = function (callback) {
  this._getJSON(`bookmarks_next_in_learning`, callback);

};

Zeeguu_API.prototype.uploadExerciseFeedback = function (
  user_feedback,
  exercise_source,
  exercise_solving_speed,
  bookmark_id,
  exerciseSessionId,
) {
  let payload = {
    outcome: "other_feedback",
    source: exercise_source,
    solving_speed: exercise_solving_speed,
    bookmark_id: bookmark_id,
    other_feedback: user_feedback,
    session_id: exerciseSessionId,
  };
  this._post(`report_exercise_outcome`, qs.stringify(payload));
};

Zeeguu_API.prototype.uploadExerciseFinalizedData = function (
  exercise_outcome,
  exercise_source,
  exercise_solving_speed,
  bookmark_id,
  exerciseSessionId,
  other_feedback,
) {
  let payload = {
    outcome: exercise_outcome,
    source: exercise_source,
    solving_speed: exercise_solving_speed,
    bookmark_id: bookmark_id,
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
