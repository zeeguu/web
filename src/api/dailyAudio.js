import { Zeeguu_API } from "./classDef";

Zeeguu_API.prototype.getTodaysLesson = function (callback, onError) {
  this.apiLog("GET get_todays_lesson");
  
  // Get user's timezone offset in minutes
  const timezoneOffset = new Date().getTimezoneOffset() * -1; // Flip sign to get offset from UTC
  
  fetch(this._appendSessionToUrl(`get_todays_lesson?timezone_offset=${timezoneOffset}`))
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
  // Add user's timezone offset
  const timezoneOffset = new Date().getTimezoneOffset() * -1; // Flip sign to get offset from UTC
  formData.append("timezone_offset", timezoneOffset);
  
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
  
  // Get user's timezone offset in minutes
  const timezoneOffset = new Date().getTimezoneOffset() * -1; // Flip sign to get offset from UTC
  
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
      if (onError) {
        onError(error);
      }
    });
};

Zeeguu_API.prototype.getPastDailyLessons = function (limit, offset, callback, onError) {
  this.apiLog("GET past_daily_lessons");
  
  let url = "past_daily_lessons";
  const params = [];
  if (limit) params.push(`limit=${limit}`);
  if (offset) params.push(`offset=${offset}`);
  
  // Add user's timezone offset
  const timezoneOffset = new Date().getTimezoneOffset() * -1; // Flip sign to get offset from UTC
  params.push(`timezone_offset=${timezoneOffset}`);
  
  if (params.length > 0) {
    // Check if URL already has query parameters
    url += url.includes('?') ? `&${params.join('&')}` : `?${params.join('&')}`;
  }
  
  fetch(this._appendSessionToUrl(url))
    .then((response) => {
      if (!response.ok) {
        // Try to parse as JSON first, but handle HTML responses
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return response.json().then(data => {
            throw new Error(data.error || "Network response was not ok");
          });
        } else {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
      }
      return response.json();
    })
    .then((data) => {
      callback(data);
    })
    .catch((error) => {
      console.error("Error getting past daily lessons:", error);
      if (onError) {
        onError(error);
      }
    });
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
      if (onError) {
        onError(error);
      }
    });
};

// Removed saveLessonProgress - use updateLessonState with "pause" action instead