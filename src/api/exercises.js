import { Zeeguu_API } from "./classDef";
import qs from "qs";

Zeeguu_API.prototype.getUserBookmarksToStudy = function (count, callback) {
  this._getJSON(`bookmarks_to_study/${count}`, callback);
};

Zeeguu_API.prototype.uploadExerciseFeedback = function (
  exercise_outcome,
  exercise_source,
  exercise_solving_speed,
  bookmark_id
) {
  this._post(
    `report_exercise_outcome/${exercise_outcome}/${exercise_source}/${exercise_solving_speed}/${bookmark_id}`,
    null
  );
};

Zeeguu_API.prototype.wordsSimilarTo = function (bookmark_id, callback) {
  this._getJSON(`similar_words/${bookmark_id}`, callback);
};


Zeeguu_API.prototype.getConfusionWords = function (lang, original_sentence, callback) {
  let sent_to_conf = {
    original_sent: original_sentence,
    language: lang
  }
  
  return this._post(`/create_confusion_words`, qs.stringify(sent_to_conf), callback)
};

Zeeguu_API.prototype.annotateClues = function (word_props, og_sent, lang, callback) {
  
  let words_to_correct = {
    word_with_props: JSON.stringify(word_props),
    original_sentence: og_sent,
    language: lang
  }
  console.log(words_to_correct);
  return this._post(`/annotate_clues`, qs.stringify(words_to_correct), callback)
};