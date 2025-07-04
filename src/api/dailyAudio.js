import { Zeeguu_API } from "./classDef";

Zeeguu_API.prototype.getTodaysLesson = function (callback, onError) {
  this.apiLog("GET get_todays_lesson");
  
  fetch(this._appendSessionToUrl("get_todays_lesson"))
    .then((response) => {
      if (!response.ok) {
        return response.json().then(data => {
          throw new Error(data.error || "Network response was not ok");
        });
      }
      return response.json();
    })
    .then((data) => {
      if (data.lesson === null) {
        // No lesson for today, call callback with null to indicate no lesson
        callback(null);
      } else if (data.audio_url) {
        // Convert relative audio URL to full URL with session
        const audioUrl = `${this.baseAPIurl}${data.audio_url}?session=${this.session}`;
        callback({ ...data, audio_url: audioUrl });
      } else {
        throw new Error("No audio URL in response");
      }
    })
    .catch((error) => {
      // Don't log expected "no lesson" errors
      if (!error.message.includes("No lesson generated yet today")) {
        console.error("Error getting today's lesson:", error);
      }
      if (onError) {
        onError(error);
      }
    });
};

Zeeguu_API.prototype.generateDailyLesson = function (callback, onError) {
  this.apiLog("POST generate_daily_lesson");
  
  const formData = new FormData();
  
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
      if (data.audio_url) {
        // Convert relative audio URL to full URL with session
        const audioUrl = `${this.baseAPIurl}${data.audio_url}?session=${this.session}`;
        callback({ ...data, audio_url: audioUrl });
      } else {
        throw new Error("No audio URL in response");
      }
    })
    .catch((error) => {
      console.error("Error generating daily lesson:", error);
      if (onError) {
        onError(error);
      }
    });
};

Zeeguu_API.prototype.deleteTodaysLesson = function (callback, onError) {
  this.apiLog("DELETE delete_todays_lesson");
  
  fetch(this._appendSessionToUrl("delete_todays_lesson"), {
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
      if (onError) {
        onError(error);
      }
    });
};