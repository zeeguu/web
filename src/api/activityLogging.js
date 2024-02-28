import { Zeeguu_API } from "./classDef";
import qs from "qs";

// Reader Opening Actions
Zeeguu_API.prototype.OPEN_ARTICLE = "OPEN ARTICLE";
Zeeguu_API.prototype.ARTICLE_FOCUSED = "ARTICLE FOCUSED";
Zeeguu_API.prototype.OPEN_EXTENSION_INSTALLED = "OPEN EXTENSION INSTALLED";
Zeeguu_API.prototype.SEARCH_QUERY = "SEARCH QUERY";

// Reader Interaction Actions
Zeeguu_API.prototype.TRANSLATE_TEXT = "TRANSLATE TEXT";
Zeeguu_API.prototype.SPEAK_TEXT = "SPEAK TEXT";
Zeeguu_API.prototype.OPEN_ALTERMENU = "OPEN ALTERMENU";
Zeeguu_API.prototype.CLOSE_ALTERMENU = "CLOSE ALTERMENU";
Zeeguu_API.prototype.SEND_SUGGESTION = "SEND SUGGESTION";
Zeeguu_API.prototype.CHANGE_ORIENTATION = "CHANGE ORIENTATION";
Zeeguu_API.prototype.SCROLL = "SCROLL";
Zeeguu_API.prototype.STAR_ARTICLE = "STAR ARTICLE";
Zeeguu_API.prototype.LIKE_ARTICLE = "LIKE ARTICLE";
Zeeguu_API.prototype.USER_FEEDBACK = "USER FEEDBACK";
Zeeguu_API.prototype.EXTENSION_FEEDBACK = "EXTENSION FEEDBACK";
Zeeguu_API.prototype.PERSONAL_COPY = "PERSONAL COPY";
Zeeguu_API.prototype.WORDS_REVIEW = "WORDS_REVIEW";

// Reader Closing Actions
Zeeguu_API.prototype.ARTICLE_CLOSED = "ARTICLE CLOSED";
Zeeguu_API.prototype.ARTICLE_UNFOCUSED = "ARTICLE LOST FOCUS";
Zeeguu_API.prototype.ARTICLE_LIST_REQUESTED = "ARTICLES REQUESTED FROM ZEEGUU";
Zeeguu_API.prototype.TO_EXERCISES_AFTER_REVIEW = "TO EXERCISES AFTER REVIEW";

// Exercises Interaction
Zeeguu_API.prototype.STAR_WORD = "STAR WORD";
Zeeguu_API.prototype.UNSTAR_WORD = "UNSTAR WORD";
Zeeguu_API.prototype.DELETE_WORD = "DELETE WORD";
Zeeguu_API.prototype.BACK_TO_READING = "BACK TO READING";
Zeeguu_API.prototype.COMPLETED_EXERCISES = "COMPLETED EXERCISES";
Zeeguu_API.prototype.KEEP_EXERCISING = "KEEP EXERCISING";

// Extension Interaction
Zeeguu_API.prototype.OPEN_POPUP = "OPEN POPUP";
Zeeguu_API.prototype.OPEN_CONTEXT = "OPEN CONTEXT";
Zeeguu_API.prototype.OPEN_MODAL = "OPEN MODAL";
Zeeguu_API.prototype.CLOSE_MODAL = "CLOSE MODAL";

// Audio Experiment
Zeeguu_API.prototype.AUDIO_EXP = "AUDIO_EXP";

// User Activity Dashboard
Zeeguu_API.prototype.USER_DASHBOARD_OPEN = "UD - USER DASHBOARD OPEN";
Zeeguu_API.prototype.USER_DASHBOARD_USER_FEEDBACK =
  "UD - USER DASHBOARD FEEDBACK";
Zeeguu_API.prototype.USER_DASHBOARD_TAB_CHANGE =
  "UD - USER DASHBOARD TAB CHANGE";
Zeeguu_API.prototype.USER_DASHBOARD_PERIOD_CHANGE =
  "UD - USER DASHBOARD PERIOD CHANGE";
Zeeguu_API.prototype.USER_DASHBOARD_TIME_COUNT_CHANGE =
  "UD - USER DASHBOARD TIME COUNT CHANGE";
Zeeguu_API.prototype.USER_DASHBOARD_DATE_CHANGE =
  "UD - USER DASHBOARD DATE CHANGE";

Zeeguu_API.prototype.logUserActivity = function (
  event,
  article_id = "",
  value = "",
  extra_data = "",
) {
  let event_information = {
    time: new Date().toJSON(),
    event: event,
    value: value,
    extra_data: extra_data,
    article_id: article_id,
  };

  const currentDate = new Date();
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");
  const seconds = String(currentDate.getSeconds()).padStart(2, "0");

  console.log(`${hours}:${minutes}:${seconds} -- ` + event);

  return this._post(
    `upload_user_activity_data`,
    qs.stringify(event_information),
  );
};

// Used only for events that happen in the text reader;
// for any other events, use logUserActivity
Zeeguu_API.prototype.logReaderActivity = function (
  event,
  article_id = "",
  value = "",
  extra_data = "",
) {
  return this.logUserActivity(event, article_id, value, extra_data);
};
