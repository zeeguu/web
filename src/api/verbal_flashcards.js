// Frontend API client for verbal flashcards
import { Zeeguu_API } from "./classDef";

function deliver(callback, payload) {
  if (callback) {
    callback(payload);
  }
}

function fetchJson(url, options, callback, errorLabel) {
  fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      deliver(callback, data);
    })
    .catch((error) => {
      console.error(`${errorLabel}:`, error);
      deliver(callback, { error: error.message });
    });
}

Zeeguu_API.prototype.getFlashcards = function (params, callback) {
  const { limit, offset } = params || {};
  const queryParams = new URLSearchParams();

  if (limit !== undefined && limit !== null) {
    queryParams.set("limit", limit);
  }
  if (offset !== undefined && offset !== null) {
    queryParams.set("offset", offset);
  }

  const queryString = queryParams.toString();
  const url = queryString ? `verbal_flashcards?${queryString}` : "verbal_flashcards";

  this._getJSON(url, callback);
};

Zeeguu_API.prototype.submitFlashcardAnswer = function (
  flashcardId,
  userAnswer,
  isCorrect,
  answerSource,
  responseTimeMs,
  sessionId,
  callback,
) {
  const payload = {
    flashcard_id: flashcardId,
    user_answer: userAnswer,
    is_correct: isCorrect,
    answer_source: answerSource,
    response_time_ms: responseTimeMs,
    session_id: sessionId,
  };

  fetchJson(
    this._appendSessionToUrl("verbal_flashcards/submit"),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
    callback,
    "Submit error",
  );
};

Zeeguu_API.prototype.transcribeAudio = function (audioFile, callback) {
  const formData = new FormData();
  formData.append("file", audioFile);

  fetchJson(
    this._appendSessionToUrl("verbal_flashcards/transcribe"),
    {
      method: "POST",
      body: formData,
    },
    callback,
    "Transcription error",
  );
};

Zeeguu_API.prototype.checkPronunciation = function (userSpeech, expectedText, callback) {
  const payload = {
    user_speech: userSpeech,
    expected_text: expectedText,
  };

  fetchJson(
    this._appendSessionToUrl("verbal_flashcards/check_pronunciation"),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
    callback,
    "Pronunciation check error",
  );
};
