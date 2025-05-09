import { Zeeguu_API } from "./classDef";
import qs from "qs";

Zeeguu_API.prototype.getUserBookmarksScheduledForToday = function (count, callback) {
  this._getJSON(`bookmarks_scheduled_for_today/${count}`, callback);
};

Zeeguu_API.prototype.getUserBookmarksInPipeline = function (isWithTokens, callback) {
  let endpoint = `bookmarks_in_pipeline`;
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

// Mircea: This could probably be removed - was used in the past for
// showing words "not yet in learning" but i've removed that feature because
// it's not very useful... or at least, it's not useful at the bottom of the :Learning: tab
Zeeguu_API.prototype.getBookmarksToLearn = function (isWithTokens, callback) {
  let payload = {
    with_tokens: isWithTokens,
  };
  let endpoint = `bookmarks_to_learn_not_scheduled`;
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

Zeeguu_API.prototype.getNewBookmarksToStudy = function (count, callback) {
  this._getJSON(`new_bookmarks_to_study/${count}`, callback);
};

Zeeguu_API.prototype.getAllBookmarksAvailableForStudyCount = function (callback) {
  this._getJSON(`all_bookmarks_available_for_study_count`, callback);
};

Zeeguu_API.prototype.getAllBookmarksAvailableForStudy = function (count, callback) {
  this._getJSON(`all_bookmarks_available_for_study/${count}`, callback);
};

Zeeguu_API.prototype.getScheduledBookmarksCount = function (callback) {
  this._getJSON(`scheduled_bookmarks_count`, callback);
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
