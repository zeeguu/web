/**
 * These values need to be aligned with the API values in the Database
 * (FeedbackComponent)
 *
 */
export const FEEDBACK_CODES = Object.freeze({
  1: "Article Reader",
  2: "Article Recommendations",
  3: "Translation",
  4: "Sound",
  5: "Exercises",
  6: "Extension",
  7: "Other",
});

export const FEEDBACK_CODES_NAME = Object.freeze({
  ARTICLE_READER: 1,
  ARTICLE_RECOMMENDATION: 2,
  TRANSLATION: 3,
  SOUND: 4,
  EXERCISE: 5,
  EXTENSION: 6,
  OTHER: 7,
});

export const FEEDBACK_OPTIONS = {
  ALL: Object.keys(FEEDBACK_CODES),
  EXERCISE: [
    FEEDBACK_CODES_NAME.EXERCISE,
    FEEDBACK_CODES_NAME.SOUND,
    FEEDBACK_CODES_NAME.TRANSLATION,
    FEEDBACK_CODES_NAME.OTHER,
  ],
};
