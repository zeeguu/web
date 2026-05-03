// Frontend API client for verbal flashcards
import { Zeeguu_API } from "./classDef";

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
  onError,
) {
  const payload = {
    flashcard_id: flashcardId,
    user_answer: userAnswer,
    is_correct: isCorrect,
    answer_source: answerSource,
    response_time_ms: responseTimeMs,
    session_id: sessionId,
  };

  return this._postJSON("verbal_flashcards/submit", payload, callback, onError);
};

Zeeguu_API.prototype.transcribeAudio = function (audioFile, callback, onError) {
  const formData = new FormData();
  formData.append("file", audioFile);

  this._postFormData("verbal_flashcards/transcribe", formData, callback, onError);
};

Zeeguu_API.prototype.checkPronunciation = function (userSpeech, expectedText, callback, onError) {
  const payload = {
    user_speech: userSpeech,
    expected_text: expectedText,
  };

  this._postJSON("verbal_flashcards/check_pronunciation", payload, callback, onError);
};
