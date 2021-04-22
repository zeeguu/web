import { Zeeguu_API } from "./classDef";
import queryString from "query-string";

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

/*
  In case it succeeds it returns "OK" in onSuccess
  e.g.

  temp2.addArticleToCohort(1505942,90, x=>console.log("answer is: " + x),err=>console.log(err))
  > answer is: OK

  or if you ignore the ok:
  temp2.addArticleToCohort(1505942,90, ()=>console.log("All iz vell!"),err=>console.log(err))
  > All iz vell!
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

// Parrallel usage with deleteArticleFromCohort
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
