import { Zeeguu_API } from "./classDef";
import { AUDIO_STATUS } from "../dailyAudio/AudioLessonConstants";
import * as Sentry from "@sentry/react";

function getTimezoneOffsetMinutes() {
  return new Date().getTimezoneOffset() * -1;
}

Zeeguu_API.prototype.getTodaysLesson = function (callback, onError) {
  this._getJSON(
    `get_todays_lesson?timezone_offset=${getTimezoneOffsetMinutes()}`,
    (data) => {
      if (data.lesson === null) return callback(null);
      const audioUrl = `${this.baseAPIurl}${data.audio_url}?session=${this.session}`;
      callback({ ...data, audio_url: audioUrl });
    },
    { onError },
  );
};

Zeeguu_API.prototype.generateDailyLesson = function (callback, onError, suggestion, suggestionType) {
  this.apiLog("POST generate_daily_lesson");

  const formData = new FormData();
  const timezoneOffset = getTimezoneOffsetMinutes();
  formData.append("timezone_offset", timezoneOffset);
  if (suggestion) {
    formData.append("suggestion", suggestion);
    if (suggestionType) {
      formData.append("lesson_type", suggestionType);
    }
  }

  fetch(this._appendSessionToUrl("generate_daily_lesson"), {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then(data => {
          throw new Error(data.error || "Network response was not ok");
        });
      }
      return response.json();
    })
    .then((data) => {
      if (data.status === AUDIO_STATUS.GENERATING) {
        // Generation started in background — polling will handle the rest
        callback(data);
      } else if (data.audio_url) {
        // Existing lesson returned directly
        const audioUrl = `${this.baseAPIurl}${data.audio_url}?session=${this.session}`;
        callback({ ...data, audio_url: audioUrl });
      } else {
        throw new Error("No audio URL in response");
      }
    })
    .catch((error) => {
      console.error("Error generating daily lesson:", error);
      Sentry.captureException(error, { tags: { endpoint: "generate_daily_lesson" } });
      if (onError) {
        onError(error);
      }
    });
};

Zeeguu_API.prototype.getSharedAudioLesson = function (lessonId, callback, onError) {
  this._getJSON(
    `shared_audio_lesson/${lessonId}`,
    (data) => callback({ ...data, audio_url: `${this.baseAPIurl}${data.audio_url}` }),
    { onError },
  );
};

Zeeguu_API.prototype.deleteTodaysLesson = function (callback, onError) {
  this.apiLog("DELETE delete_todays_lesson");
  
  const timezoneOffset = getTimezoneOffsetMinutes();
  
  fetch(this._appendSessionToUrl(`delete_todays_lesson?timezone_offset=${timezoneOffset}`), {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then(data => {
          throw new Error(data.error || "Network response was not ok");
        });
      }
      return response.json();
    })
    .then((data) => {
      callback(data);
    })
    .catch((error) => {
      console.error("Error deleting today's lesson:", error);
      Sentry.captureException(error, { tags: { endpoint: "delete_todays_lesson" } });
      if (onError) {
        onError(error);
      }
    });
};

Zeeguu_API.prototype.getPastDailyLessons = function (limit, offset, callback, onError) {
  const params = new URLSearchParams();
  if (limit) params.set("limit", limit);
  if (offset) params.set("offset", offset);
  params.set("timezone_offset", getTimezoneOffsetMinutes());
  this._getJSON(`past_daily_lessons?${params}`, callback, { onError });
};

Zeeguu_API.prototype.updateLessonState = function (lessonId, action, positionSeconds, callback, onError) {
  this.apiLog(`POST update_lesson_state/${lessonId}`);
  
  const payload = { action };
  
  // Add position_seconds for pause action
  if (action === 'pause' && positionSeconds !== undefined) {
    payload.position_seconds = Math.floor(positionSeconds);
  }
  
  fetch(this._appendSessionToUrl(`update_lesson_state/${lessonId}`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then(data => {
          throw new Error(data.error || "Network response was not ok");
        });
      }
      return response.json();
    })
    .then((data) => {
      if (callback) callback(data);
    })
    .catch((error) => {
      console.error("Error updating lesson state:", error);
      Sentry.captureException(error, { tags: { endpoint: "update_lesson_state" } });
      if (onError) {
        onError(error);
      }
    });
};

Zeeguu_API.prototype.checkDailyLessonFeasibility = function (callback, onError) {
  this._getJSON("check_daily_lesson_feasibility", callback, { onError });
};

Zeeguu_API.prototype.getAudioLessonGenerationProgress = function (callback, onError) {
  this._getJSON("audio_lesson_generation_progress", (data) => callback(data.progress), { onError });
};