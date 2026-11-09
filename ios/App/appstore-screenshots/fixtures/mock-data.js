// Mock API data for App Store screenshot generation
// All responses are frozen so screenshots are deterministic.
//
// The language-specific content (user, articles, words, lessons) comes from
// content-<lang>.js, chosen with FIXTURE_LANG (default: it).

const { FIXTURE_IMAGE_HOST } = require("./helpers");

const FIXTURE_LANG = process.env.FIXTURE_LANG || "it";
const {
  USER_DETAILS,
  RECOMMENDED_ARTICLES,
  ARTICLE_CONTENT,
  EXERCISE_BOOKMARKS,
  SIMILAR_WORDS,
  SCHEDULED_WORDS,
  NEXT_IN_LEARNING,
  TODAYS_LESSON,
  PAST_LESSONS,
  SUBSCRIBED_TOPICS,
  AVAILABLE_TOPICS,
  DETECT_ARTICLE_INFO,
  CAPTURE,
} = require(`./content-${FIXTURE_LANG}`);

const USER_PREFERENCES = {
  audio_exercises: "true",
  filter_disturbing_content: "true",
};

const SYSTEM_LANGUAGES = {
  learnable_languages: [
    { id: 1, code: "da", name: "Danish" },
    { id: 2, code: "nl", name: "Dutch" },
    { id: 3, code: "en", name: "English" },
    { id: 4, code: "fr", name: "French" },
    { id: 5, code: "de", name: "German" },
    { id: 6, code: "el", name: "Greek" },
    { id: 7, code: "it", name: "Italian" },
    { id: 8, code: "pt", name: "Portuguese" },
    { id: 9, code: "ro", name: "Romanian" },
    { id: 10, code: "es", name: "Spanish" },
    { id: 11, code: "sv", name: "Swedish" },
  ],
  native_languages: [
    { id: 12, code: "en", name: "English" },
    { id: 13, code: "de", name: "German" },
    { id: 14, code: "fr", name: "French" },
    { id: 15, code: "es", name: "Spanish" },
    { id: 16, code: "zh", name: "Chinese" },
    { id: 17, code: "ar", name: "Arabic" },
    { id: 18, code: "pt", name: "Portuguese" },
    { id: 19, code: "ro", name: "Romanian" },
  ],
};

// ─── Filters page ──────────────────────────────────────────────

const FILTERED_SEARCHES = [
  { id: 71, search: "celebrity gossip" },
  { id: 72, search: "horoscope" },
];

// ─── Route matching ────────────────────────────────────────────

function getResponse(url, method) {
  const match = url.match(/api\.zeeguu\.org\/+([^?]*)/);
  if (!match) return null;
  const route = match[1].replace(/^\/+/, ""); // strip leading slashes

  // ── App-level ──
  if (route === "validate") return "OK";
  if (route === "get_user_details") return USER_DETAILS;
  if (route === "user_preferences") return USER_PREFERENCES;
  if (route === "system_languages") return SYSTEM_LANGUAGES;
  if (route === "audio_lesson_generation_progress") return { progress: null };
  if (route === "next_word_due_time") return { next_word_due_time: null };
  if (route === "all_language_streaks") return [];
  if (route === "daily_streak") return { streak: 5, longest_streak: 12, today_completed: true };

  // ── Articles feed ──
  if (route === "get_unfinished_user_reading_sessions") return [];
  if (route.startsWith("user_articles/recommended")) return RECOMMENDED_ARTICLES;

  // ── Article reader ──
  if (route === "user_article") return ARTICLE_CONTENT;
  if (route.startsWith("user_article_summary")) return {};
  if (route.startsWith("bookmarks_for_article")) return { bookmarks: [] };
  if (route.startsWith("reading_session")) return { id: 1 };
  if (route === "article_opened") return "OK";

  // ── Exercises ──
  if (route === "user_words_recommended_for_practice") return EXERCISE_BOOKMARKS;
  if (route === "count_of_user_words_recommended_for_practice")
    return EXERCISE_BOOKMARKS.length;
  if (route.startsWith("similar_words/")) return SIMILAR_WORDS;
  if (route.startsWith("bookmark_with_context/")) {
    const bId = parseInt(route.split("/")[1]);
    const bk = EXERCISE_BOOKMARKS.find((b) => b.id === bId);
    return bk || EXERCISE_BOOKMARKS[2]; // fallback to gridato
  }

  // ── Words ──
  if (route === "all_scheduled_user_words") return SCHEDULED_WORDS;
  if (route === "count_of_all_scheduled_user_words") return SCHEDULED_WORDS.length;
  if (route === "user_words_next_in_learning") return NEXT_IN_LEARNING;
  if (route.startsWith("bookmarks_next_in_learning")) return NEXT_IN_LEARNING;
  if (route === "total_learned_bookmarks") return 47;

  // ── Interests / Filters ──
  if (route === "available_topics") return AVAILABLE_TOPICS;
  if (route === "subscribed_topics") return SUBSCRIBED_TOPICS;
  if (route === "subscribed_searches") return [];
  if (route === "filtered_searches") return FILTERED_SEARCHES;

  // ── Share / Simplify prompt ──
  if (route === "detect_article_info") return DETECT_ARTICLE_INFO;

  // ── Daily Audio ──
  if (route === "get_todays_lesson") return TODAYS_LESSON;
  if (route === "past_daily_lessons") return PAST_LESSONS;
  if (route === "check_daily_lesson_feasibility")
    return { feasible: true, available_words: 5, required_words: 2 };

  // ── Activity / logging (fire-and-forget) ──
  if (route === "upload_user_activity_data") return "OK";
  if (route === "report_exercise_outcome") return "OK";
  if (route === "cohort_articles") return [];
  if (route.startsWith("hide_article")) return "OK";

  // Catch-all for POST endpoints
  if (method === "POST") return "OK";

  return null;
}

module.exports = { getResponse, FIXTURE_IMAGE_HOST, CAPTURE, FIXTURE_LANG };
