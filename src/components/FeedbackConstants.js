/**
 * These values need to be aligned with the API values in the Database
 * (FeedbackComponent)
 *
 */
export const FEEDBACK_CODES = Object.freeze({
  1: "Article Reader",
  2: "Article Recommendations", 
  3: "Daily Audio",
  4: "Exercises",
  5: "Extension",
  6: "Sound",
  7: "Translation",
  8: "Other",
});

export const FEEDBACK_CODES_NAME = Object.freeze({
  ARTICLE_READER: 1,
  ARTICLE_RECOMMENDATION: 2,
  DAILY_AUDIO: 3,
  EXERCISE: 4,
  EXTENSION: 5,
  SOUND: 6,
  TRANSLATION: 7,
  OTHER: 8,
});

export const FEEDBACK_OPTIONS = {
  ALL: Object.keys(FEEDBACK_CODES).map(Number),
  EXERCISE: [
    FEEDBACK_CODES_NAME.EXERCISE,
    FEEDBACK_CODES_NAME.SOUND,
    FEEDBACK_CODES_NAME.TRANSLATION,
    FEEDBACK_CODES_NAME.OTHER,
  ],
};
