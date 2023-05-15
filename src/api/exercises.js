import { Zeeguu_API } from "./classDef";
import qs from "qs";

Zeeguu_API.prototype.getUserBookmarksToStudy = function (count, callback) {
  this._getJSON(`bookmarks_to_study/${count}`, callback);
};

Zeeguu_API.prototype.uploadExerciseFeedback = function (
  user_feedback,
  exercise_source,
  exercise_solving_speed,
  bookmark_id
) {
  let payload = {
    outcome: "other_feedback",
    source: exercise_source,
    solving_speed: exercise_solving_speed,
    bookmark_id: bookmark_id,
    other_feedback: user_feedback,
  };
  console.log(payload);
  this._post(`report_exercise_outcome`, qs.stringify(payload));
};

Zeeguu_API.prototype.uploadExerciseFinalizedData = function (
  exercise_outcome,
  exercise_source,
  exercise_solving_speed,
  bookmark_id,
  other_feedback
) {
  let payload = {
    outcome: exercise_outcome,
    source: exercise_source,
    solving_speed: exercise_solving_speed,
    bookmark_id: bookmark_id,
    other_feedback: other_feedback,
  };
  console.log(payload);
  this._post(`report_exercise_outcome`, qs.stringify(payload));
};

Zeeguu_API.prototype.wordsSimilarTo = function (bookmark_id, callback) {
  this._getJSON(`similar_words/${bookmark_id}`, callback);
};
