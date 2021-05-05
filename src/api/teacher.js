import { Zeeguu_API } from "./classDef";
import queryString from "query-string";

//Plugging teacher-related functions into the Zeeguu_API

Zeeguu_API.prototype.isTeacher = function (callback) {
  this._getPlainText(`is_teacher`, callback);
};

Zeeguu_API.prototype.getTeacherTexts = function (callback) {
  /*
    Example return:
    [
      {
          "id": 1505942,
          "title": "lala",
          "summary": "lulu",
          "language": "da",
          "topics": "",
          "metrics": {
              "difficulty": 0.63,
              "word_count": 1
          },
          "authors": "Mir",
          "cohorts": [
              "Friends of Friends"
          ]
      }
    ]
*/
  this._get(`teacher_texts`, callback);
};

Zeeguu_API.prototype.createCohort = async function (data) {
  return await this.apiPost(`/create_own_cohort`, data, true);
};

Zeeguu_API.prototype.deleteCohort = async function (id) {
  return await this.apiPost(`/remove_cohort/${id}`, id);
};

Zeeguu_API.prototype.updateCohort = async function (data, id) {
  return await this.apiPost(`/update_cohort/${id}`, data, true);
};

Zeeguu_API.prototype.getCohortFromArticle = function (article_id, callback) {
  this._get(`/get_cohorts_for_article/${article_id}`, callback);
};

Zeeguu_API.prototype.getCohortsInfo = function (callback) {
  /*
  Example return:
  [
    {
        "id": "90",
        "name": "Friends of Friends",
        "inv_code": "friends-are-friends-forever",
        "max_students": 40,
        "cur_students": 0,
        "language_name": "Spanish",
        "declared_level_min": 0,
        "declared_level_max": 10
    }
  ]
  */
  this._get(`cohorts_info`, callback);
};

Zeeguu_API.prototype.addArticleToCohort = function (
  articleID,
  cohortID,
  onSuccess,
  onError
) {
  let payload = {
    article_id: articleID,
    cohort_id: cohortID,
  };
  this._post(
    `add_article_to_cohort`,
    queryString.stringify(payload),
    onSuccess,
    onError
  );
};
/*
  In case addArticleToCohort succeeds it returns "OK" in onSuccess.
  e.g.
  temp2.addArticleToCohort(1505942,90, x=>console.log("answer is: " + x),err=>console.log(err))
  > answer is: OK
  or if you ignore the ok:
  temp2.addArticleToCohort(1505942,90, ()=>console.log("All iz vell!"),err=>console.log(err))
  > All iz vell!
  (Same goes for deleteArticleFromCohort)
*/

Zeeguu_API.prototype.deleteArticleFromCohort = function (
  articleID,
  cohortID,
  onSuccess,
  onError
) {
  let payload = {
    article_id: articleID,
    cohort_id: cohortID,
  };
  this._post(
    `delete_article_from_cohort`,
    queryString.stringify(payload),
    onSuccess,
    onError
  );
};

Zeeguu_API.prototype.getStudents = function (cohortID, duration, callback) {
  this._get(`/users_from_cohort/${cohortID}/${duration}`, callback);
};

Zeeguu_API.prototype.parseArticleFromUrl = function (url, callback, onError) {
  /* example return:
    json_result(
      {
        'article_title':title,
        'text':art.text,
        'top_image': art.top_image,
      }
    )*/
  this._post(`parse_url`, `url=${url}`, callback, onError, true);
};
