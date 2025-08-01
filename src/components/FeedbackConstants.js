/**
 * Single source of truth for feedback categories
 * These values need to be aligned with the API values in the Database (FeedbackComponent)
 */
const FEEDBACK_CATEGORIES = [
  { id: 1, name: "Article Reader", key: "ARTICLE_READER", urlPatterns: ["/read/article"] },
  { id: 2, name: "Article Recommendations", key: "ARTICLE_RECOMMENDATION", urlPatterns: ["/articles"] }, 
  { id: 3, name: "Translation", key: "TRANSLATION", urlPatterns: [] },
  { id: 4, name: "Sound", key: "SOUND", urlPatterns: [] },
  { id: 5, name: "Exercises", key: "EXERCISE", urlPatterns: ["/exercise", "/exercises"] },
  { id: 6, name: "Extension", key: "EXTENSION", urlPatterns: [] },
  { id: 7, name: "Other", key: "OTHER", urlPatterns: [] },
  { id: 8, name: "Daily Audio", key: "DAILY_AUDIO", urlPatterns: ["/daily-audio"] },
];

// Auto-generated from single source of truth
export const FEEDBACK_CODES = Object.freeze(
  FEEDBACK_CATEGORIES.reduce((acc, cat) => {
    acc[cat.id] = cat.name;
    return acc;
  }, {})
);

export const FEEDBACK_CODES_NAME = Object.freeze(
  FEEDBACK_CATEGORIES.reduce((acc, cat) => {
    acc[cat.key] = cat.id;
    return acc;
  }, {})
);

export const FEEDBACK_OPTIONS = {
  ALL: FEEDBACK_CATEGORIES.map(cat => cat.id),
  EXERCISE: [
    FEEDBACK_CODES_NAME.EXERCISE,
    FEEDBACK_CODES_NAME.SOUND,
    FEEDBACK_CODES_NAME.TRANSLATION,
    FEEDBACK_CODES_NAME.OTHER,
  ],
};

// Helper function to find category by URL
export function getCategoryIdForUrl(url) {
  const category = FEEDBACK_CATEGORIES.find(cat => 
    cat.urlPatterns.some(pattern => url.includes(pattern))
  );
  return category ? category.id : FEEDBACK_CODES_NAME.OTHER;
}
