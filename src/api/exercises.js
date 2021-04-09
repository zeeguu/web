import { Zeeguu_API } from "./classDef";

Zeeguu_API.prototype.getUserBookmarksToStudy = function (count, callback) {
  this._get(`bookmarks_to_study/${count}`, callback);
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
  this._get(`similar_words/${bookmark_id}`, callback);
};
