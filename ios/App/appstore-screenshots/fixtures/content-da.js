// Danish screenshot content, for the en-GB store localization: what
// English-language phones in the Danish App Store see.
//
// Storyline: the feed opens with northern lights over Denmark and the
// handball world title; the reader, exercises and audio lesson follow one
// article about swimming in Copenhagen's harbor.
//
// Photos (Unsplash License: free for commercial use, no attribution needed):
//   article6-aurora.jpg  Dante Fabillar  unsplash.com/photos/_cQ66UoJjLo (Norway)
//   da-handball.jpg      Miguel Puig     unsplash.com/photos/phU8NHF85rU
//   da-harbor.jpg        Patrick Federi  unsplash.com/photos/iLf0aM4L7Os (Copenhagen)
const {
  FIXTURE_IMAGE_HOST,
  tokenizeSentence,
  wrapTokens,
  articleBase,
  bookmarkMaker,
  lookUp,
} = require("./helpers");

const USER_DETAILS = {
  name: "Alex",
  email: "alex@example.com",
  learned_language: "da",
  native_language: "en",
  is_teacher: false,
  is_student: false,
  learned_cefr_level: "A2",
  requires_email_verification: false,
  daily_audio_status: "done",
};

// Index of the first token with this text (throws if the sentence changes).
function at(tokens, text) {
  const i = tokens.findIndex((t) => t.text === text);
  if (i < 0) throw new Error(`token "${text}" not found`);
  return i;
}

function interactive(tokens, articleId) {
  return {
    tokens: wrapTokens(tokens),
    past_bookmarks: [],
    context_identifier: { article_id: articleId },
  };
}

// ─── Feed ──────────────────────────────────────────────────────

// Northern lights: seen over all of Denmark several times since 2024, and
// covered by DR each time. "Nordlys" is already looked up.
const AURORA_TITLE = "Nordlys over hele Danmark: se de smukke billeder";
const auroraTitle = tokenizeSentence(AURORA_TITLE);
lookUp(auroraTitle, 0, 1, 2006, "Nordlys", "northern lights");

// Denmark won the men's handball World Championship in February 2025, the
// fourth title in a row.
const HANDBALL_TITLE = "Danmark er verdensmester i håndbold for fjerde gang i træk";

const HARBOR_TITLE = "Københavnerne bader i havnen hele året";
const HARBOR_URL = "https://www.dr.dk/nyheder/indland/havnebad";

const RECOMMENDED_ARTICLES = [
  articleBase(6, {
    url: "https://www.dr.dk/nyheder/indland/nordlys",
    title: AURORA_TITLE,
    summary:
      "En stærk solstorm gav nordlys over hele landet i nat. Mange gik ud for at se himlen blive grøn og rød.",
    language: "da",
    img_url: `https://${FIXTURE_IMAGE_HOST}/article6-aurora.jpg`,
    cefr_level: "A2",
    metrics: { cefr_level: "A2", word_count: 320 },
    word_count: 320,
    parent_article_id: 600,
    parent_url: "https://www.dr.dk/nyheder/indland/nordlys",
    feed_name: "dr.dk",
    topics_list: [["Technology & Science", 2]],
    published: new Date(Date.now() - 2 * 3600000).toISOString(),
    interactiveTitle: interactive(auroraTitle, 6),
  }),
  articleBase(7, {
    url: "https://sport.tv2.dk/haandbold/vm",
    title: HANDBALL_TITLE,
    summary:
      "Danmark vandt finalen og er igen verdensmester. Det er fjerde gang i træk, at holdet vinder VM.",
    language: "da",
    img_url: `https://${FIXTURE_IMAGE_HOST}/da-handball.jpg`,
    cefr_level: "A2",
    metrics: { cefr_level: "A2", word_count: 260 },
    word_count: 260,
    parent_article_id: 700,
    parent_url: "https://sport.tv2.dk/haandbold/vm",
    feed_name: "tv2.dk",
    topics_list: [["Sports", 2]],
    published: new Date(Date.now() - 9 * 3600000).toISOString(),
  }),
  articleBase(1, {
    url: HARBOR_URL,
    title: HARBOR_TITLE,
    summary:
      "I København kan man bade i havnen. Vinterbadning er blevet meget populært, og der er nu over tyve badesteder i byen.",
    language: "da",
    img_url: `https://${FIXTURE_IMAGE_HOST}/da-harbor.jpg`,
    cefr_level: "A2",
    metrics: { cefr_level: "A2", word_count: 280 },
    word_count: 280,
    parent_article_id: 100,
    parent_url: HARBOR_URL,
    feed_name: "dr.dk",
    topics_list: [["Health & Society", 2]],
    published: new Date(Date.now() - 5 * 3600000).toISOString(),
  }),
];

// ─── Article reader content (for /read/article?id=1) ──────────

const ARTICLE_CONTENT = {
  id: 1,
  title: HARBOR_TITLE,
  url: HARBOR_URL,
  language: "da",
  img_url: `https://${FIXTURE_IMAGE_HOST}/da-harbor.jpg`,
  video: false,
  author: "",
  authors: "",
  source_id: 101,
  parent_url: HARBOR_URL,
  liked: false,
  starred: false,
  relative_difficulty: "easy",
  word_count: 120,
  avg_difficulty: 0.3,
  body: "",
  tokenized_fragments: (() => {
    const frag1 = tokenizeSentence(
      "I København kan man bade i havnen. Vandet er rent, og mange tager en dukkert før arbejde. Om vinteren er vandet kun fire grader.",
      0, 0
    );
    lookUp(frag1, at(frag1, "en"), 2, 2001, "en dukkert", "a dip");

    const frag2 = tokenizeSentence(
      "Vinterbadning er blevet meget populært i Danmark. Mange siger, at det giver energi og godt humør. Bagefter går de i sauna for at blive varme.",
      1, 0
    );
    lookUp(frag2, 0, 1, 2003, "Vinterbadning", "winter swimming");
    lookUp(frag2, at(frag2, "godt"), 2, 2002, "godt humør", "good mood");

    const frag3 = tokenizeSentence(
      "Der er nu over tyve badesteder i byen. Det er gratis at bade, og alle er velkomne.",
      2, 0
    );

    return [frag1, frag2, frag3].map((tokens, i) => ({
      tokens: wrapTokens(tokens),
      past_bookmarks: [],
      context_identifier: { article_id: 1, article_fragment_id: i + 1 },
    }));
  })(),
  tokenized_title_new: interactive(tokenizeSentence(HARBOR_TITLE), 1),
};

// ─── Exercises (Match needs 3 bookmarks) ───────────────────────

const makeBookmark = bookmarkMaker("da", "Københavnerne bader i havnen");

const EXERCISE_BOOKMARKS = [
  makeBookmark(101, "en dukkert", "a dip", "Mange tager en dukkert i havnen før arbejde."),
  makeBookmark(102, "humør", "mood", "Koldt vand giver godt humør hele dagen."),
  makeBookmark(103, "verdensmester", "world champion", "Danmark er verdensmester i håndbold."),
  makeBookmark(104, "vinterbadning", "winter swimming", "Vinterbadning er blevet meget populært."),
  makeBookmark(105, "badested", "bathing spot", "Der er et nyt badested i havnen."),
  makeBookmark(106, "nordlys", "northern lights", "I nat kunne man se nordlys over hele Danmark."),
];

const SIMILAR_WORDS = ["albeit", "massively", "frequently"];

// ─── Words page (scheduled words) ─────────────────────────────

const SCHEDULED_WORDS = [
  makeBookmark(101, "en dukkert", "a dip", "Mange tager en dukkert før arbejde.", { level: 2, cooling_interval: 3, consecutive_correct_answers: 4 }),
  makeBookmark(102, "humør", "mood", "Koldt vand giver godt humør.", { level: 1, cooling_interval: 1, consecutive_correct_answers: 1 }),
  makeBookmark(103, "verdensmester", "world champion", "Danmark er verdensmester igen.", { level: 2, cooling_interval: 2, consecutive_correct_answers: 3 }),
  makeBookmark(104, "vinterbadning", "winter swimming", "Vinterbadning er sundt.", { level: 1, cooling_interval: 1 }),
  makeBookmark(105, "badested", "bathing spot", "Der er et nyt badested i havnen.", { level: 3, cooling_interval: 5, consecutive_correct_answers: 6 }),
  makeBookmark(106, "nordlys", "northern lights", "Vi så nordlys i nat.", { level: 2, cooling_interval: 3, consecutive_correct_answers: 3 }),
  makeBookmark(107, "velkomne", "welcome", "Alle er velkomne.", { level: 1, cooling_interval: 1, consecutive_correct_answers: 1 }),
  makeBookmark(108, "bagefter", "afterwards", "Bagefter går de i sauna.", { level: 2, cooling_interval: 2 }),
];

const NEXT_IN_LEARNING = [
  makeBookmark(201, "solstorm", "solar storm", "En stærk solstorm gav nordlys.", { level: 0 }),
  makeBookmark(202, "i træk", "in a row", "Det er fjerde gang i træk.", { level: 0 }),
];

// ─── Daily Audio ───────────────────────────────────────────────

const TODAYS_LESSON = {
  lesson_id: 42,
  audio_url: "/audio/daily_lessons/42.mp3",
  duration_seconds: 351,
  created_at: new Date().toISOString(),
  title: "Mette og Jonas taler om vinterbadning",
  words: [
    makeBookmark(101, "en dukkert", "a dip", "Jeg tager en dukkert hver morgen."),
    makeBookmark(102, "humør", "mood", "Koldt vand giver godt humør."),
    makeBookmark(105, "badested", "bathing spot", "Der er et nyt badested i havnen."),
  ],
  pause_position_seconds: 134,
  is_paused: true,
  is_completed: false,
  listened_count: 1,
  canonical_suggestion: "vinterbadning",
  lesson_type: "topic",
};

const PAST_LESSONS = {
  lessons: [
    {
      lesson_id: 41,
      audio_url: "/audio/daily_lessons/41.mp3",
      audio_exists: true,
      duration_seconds: 310,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      completed_at: new Date(Date.now() - 82800000).toISOString(),
      is_completed: true,
      words: [
        { origin: "verdensmester", translation: "world champion" },
        { origin: "nordlys", translation: "northern lights" },
        { origin: "velkomne", translation: "welcome" },
      ],
      word_count: 3,
      pause_position_seconds: 0,
      is_paused: false,
      listened_count: 2,
      canonical_suggestion: null,
      lesson_type: "three_words_lesson",
    },
  ],
  pagination: { total: 1, limit: 20, offset: 0, has_more: false },
};

// ─── Interests / Topics picker ─────────────────────────────────

const SUBSCRIBED_TOPICS = [
  { id: 5, title: "Technology & Science" },
  { id: 7, title: "Sports" },
];

const AVAILABLE_TOPICS = [
  { id: 1, title: "Arts" },
  { id: 3, title: "Business" },
  { id: 4, title: "Culture" },
  { id: 2, title: "Health & Society" },
  { id: 6, title: "Environment" },
  { id: 8, title: "Food & Cooking" },
  { id: 9, title: "Politics" },
  { id: 10, title: "Travel" },
];

// ─── Share / Simplify prompt ───────────────────────────────────

const DETECT_ARTICLE_INFO = {
  language: "da",
  title: HARBOR_TITLE,
  url: HARBOR_URL,
  img_url: `https://${FIXTURE_IMAGE_HOST}/da-harbor.jpg`,
};

// What render-live.js taps or sets for this language.
const CAPTURE = {
  readerWords: ["en dukkert", "Vinterbadning", "godt humør"],
  feedWords: ["Nordlys"],
  audioTopic: "vinterbadning",
  sharedArticleUrl: HARBOR_URL,
  // record-preview.js: the video starts with nothing looked up and taps
  // these (single words, translated by the mocked translate_word).
  videoTaps: {
    feed: [["Nordlys", "northern lights"]],
    reader: [["dukkert", "dip"], ["Vinterbadning", "winter swimming"], ["humør", "mood"]],
  },
};

module.exports = {
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
};
