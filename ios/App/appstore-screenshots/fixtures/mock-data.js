// Mock API data for App Store screenshot generation
// All responses are frozen so screenshots are deterministic

const FIXTURE_IMAGE_HOST = "fixtures.zeeguu.test";

// ─── Helpers ───────────────────────────────────────────────────

function tok(text, sentI, tokenI, extra = {}) {
  return {
    text,
    is_sent_start: tokenI === 0,
    is_punct: /^[^\w\u00C0-\u024F']+$/.test(text),
    is_symbol: false,
    is_left_punct: false,
    is_right_punct: false,
    is_like_num: /^\d+$/.test(text),
    sent_i: sentI,
    token_i: tokenI,
    paragraph_i: 0,
    is_like_email: false,
    is_like_url: false,
    has_space: true,
    ...extra,
  };
}

function tokenizeSentence(text, sentI = 0, startI = 0) {
  const parts = text.match(/[\w\u00C0-\u024F']+|[^\w\s]/g) || [];
  return parts.map((part, i) => {
    const nextPunct =
      i < parts.length - 1 &&
      /^[^\w\u00C0-\u024F']+$/.test(parts[i + 1]);
    return tok(part, sentI, startI + i, {
      has_space: i < parts.length - 1 ? !nextPunct : false,
    });
  });
}

// Wrap a flat token array as the 3-level structure the frontend expects:
// [paragraph [sentence [tokens]]]
function wrapTokens(flatTokens) {
  return [[flatTokens]];
}

function makeInteractive(text, articleId, pastBookmarks = []) {
  return {
    tokens: wrapTokens(tokenizeSentence(text)),
    past_bookmarks: pastBookmarks,
    context_identifier: { article_id: articleId },
  };
}

// ─── User ──────────────────────────────────────────────────────

const USER_DETAILS = {
  name: "Alex",
  email: "alex@example.com",
  learned_language: "it",
  native_language: "en",
  is_teacher: false,
  is_student: false,
  learned_cefr_level: "A2",
  requires_email_verification: false,
  daily_audio_status: "done",
};

const USER_PREFERENCES = {
  audio_exercises: "true",
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

// ─── Article 1 — with pre-translated words in title ────────────

// Title tokens — no bookmarks on feed (translations shown in reader instead)
const article1TitleTokens = tokenizeSentence(
  "Nordic latte, la bevanda svedese detox per una pelle luminosa"
);

// ─── Articles feed ─────────────────────────────────────────────

function articleBase(id, overrides) {
  return {
    id,
    source_id: 100 + id,
    video: false,
    reading_completion: 0,
    has_personal_copy: false,
    hidden: false,
    has_uploader: false,
    uploader_name: null,
    matched_searches: [],
    interactiveSummary: null,
    interactiveTitle: null,
    ...overrides,
  };
}

const RECOMMENDED_ARTICLES = [
  articleBase(1, {
    url: "https://vogue.it/article/nordic-latte",
    title:
      "Nordic latte, la bevanda svedese detox per una pelle luminosa",
    summary:
      "Il Nordic latte è una bevanda svedese a base di ortica e latte. Ha benefici per la pelle, è detox e fa bene alla salute. Ecco come prepararlo.",
    language: "it",
    img_url: `https://${FIXTURE_IMAGE_HOST}/article1-nordic-latte.jpg`,
    cefr_level: "A2",
    metrics: { cefr_level: "A2", word_count: 450 },
    word_count: 450,
    parent_article_id: 100,
    parent_url: "https://vogue.it/original/nordic-latte",
    feed_name: "vogue.it",
    topics_list: [["Health & Society", 2]],
    published: new Date(Date.now() - 3 * 3600000).toISOString(),
    interactiveTitle: {
      tokens: wrapTokens(article1TitleTokens),
      past_bookmarks: [],
      context_identifier: { article_id: 1 },
    },
    interactiveSummary: makeInteractive(
      "Il Nordic latte è una bevanda svedese a base di ortica e latte. Ha benefici per la pelle, è detox e fa bene alla salute. Ecco come prepararlo.",
      1
    ),
  }),
  articleBase(2, {
    url: "https://vogue.it/article/invecchiare",
    title:
      "A che età si inizia a invecchiare davvero? Uno studio indica due momenti precisi.",
    summary:
      "Uno studio di Stanford trova due picchi di invecchiamento a 44 e 60 anni. Sport e dieta corretta sono consigliati per affrontarli.",
    language: "it",
    img_url: `https://${FIXTURE_IMAGE_HOST}/article2-aging-study.jpg`,
    cefr_level: "A2",
    metrics: { cefr_level: "A2", word_count: 250 },
    word_count: 250,
    parent_article_id: 200,
    parent_url: "https://vogue.it/original/invecchiare",
    feed_name: "vogue.it",
    topics_list: [["Health & Society", 2]],
    published: new Date(Date.now() - 16 * 3600000).toISOString(),
  }),
  articleBase(3, {
    url: "https://internazionale.it/article/ai",
    title:
      "Possiamo appropriarci delle intelligenze artificiali in modo critico",
    summary:
      "Una mappa storica mostra come il potere usa la tecnologia. Spiega che le IA hanno una base materiale. Invece di rifiutarle, possiamo appropriarcene in modo critico.",
    language: "it",
    img_url: `https://${FIXTURE_IMAGE_HOST}/article3-ai.jpg`,
    cefr_level: "A2",
    metrics: { cefr_level: "A2", word_count: 320 },
    word_count: 320,
    parent_article_id: 300,
    parent_url: "https://internazionale.it/original/ai",
    feed_name: "internazionale.it",
    topics_list: [["Technology & Science", 2]],
    published: new Date(Date.now() - 22 * 3600000).toISOString(),
  }),
  articleBase(4, {
    url: "https://panorama.it/article/energia",
    title: "Energia: la grande ipocrisia verde",
    summary:
      "L'articolo critica l'ipocrisia della transizione energetica. Un calo del 20% del petrolio causa panico, mentre si pianifica di tagliarne il 90%.",
    language: "it",
    img_url: `https://${FIXTURE_IMAGE_HOST}/article4-energy.jpg`,
    cefr_level: "A2",
    metrics: { cefr_level: "A2", word_count: 240 },
    word_count: 240,
    parent_article_id: 400,
    parent_url: "https://panorama.it/original/energia",
    feed_name: "panorama.it",
    topics_list: [["Business", 2]],
    published: new Date(Date.now() - 16 * 3600000).toISOString(),
  }),
  articleBase(5, {
    url: "https://ilfattoquotidiano.it/article/musetti",
    title:
      "Musetti perde a Montecarlo e scende in classifica, sconfitto anche Cobolli",
    summary:
      "Musetti perde a Montecarlo contro Vacherot e scende al nono posto ATP. Anche Cobolli viene eliminato dal giovane Blockx.",
    language: "it",
    img_url: `https://${FIXTURE_IMAGE_HOST}/article5-tennis.jpg`,
    cefr_level: "A2",
    metrics: { cefr_level: "A2", word_count: 230 },
    word_count: 230,
    parent_article_id: 500,
    parent_url: "https://ilfattoquotidiano.it/original/musetti",
    feed_name: "ilfattoquotidiano.it",
    topics_list: [["Sports", 2]],
    published: new Date(Date.now() - 16 * 3600000).toISOString(),
  }),
];

// ─── Article reader content (for /read/article?id=1) ──────────

const ARTICLE_CONTENT = {
  id: 1,
  title: "Nordic latte, la bevanda svedese detox per una pelle luminosa",
  url: "https://vogue.it/article/nordic-latte",
  language: "it",
  img_url: `https://${FIXTURE_IMAGE_HOST}/article1-nordic-latte.jpg`,
  video: false,
  author: "",
  authors: "",
  source_id: 101,
  parent_url: "https://vogue.it/original/nordic-latte",
  liked: false,
  starred: false,
  relative_difficulty: "easy",
  word_count: 120,
  avg_difficulty: 0.3,
  body: "",
  tokenized_fragments: (() => {
    // Fragment 1: pre-attach bookmark on "bevanda svedese" (tokens 5-6)
    const frag1Tokens = tokenizeSentence(
      "Il Nordic latte è una bevanda svedese che viene dalla Scandinavia. È fatto con latte caldo e ortica in polvere. Il colore verde viene dall'ortica."
    );
    frag1Tokens[5].bookmark = {
      id: 2001, origin: "bevanda svedese", translation: "Swedish drink",
      t_total_token: 2, is_mwe: false,
    };
    frag1Tokens[5].mergedTokens = [
      { ...frag1Tokens[5], bookmark: null },
      { ...frag1Tokens[6] },
    ];
    frag1Tokens[6].skipRender = true;

    // "latte caldo" at tokens 15-16
    frag1Tokens[15].bookmark = {
      id: 2003, origin: "latte caldo", translation: "warm milk",
      t_total_token: 2, is_mwe: false,
    };
    frag1Tokens[15].mergedTokens = [
      { ...frag1Tokens[15], bookmark: null },
      { ...frag1Tokens[16] },
    ];
    frag1Tokens[16].skipRender = true;

    // Fragment 2: pre-attach bookmark on "pelle" (token 7)
    const frag2Tokens = tokenizeSentence(
      "Questa bevanda ha molti benefici per la pelle. L'ortica è ricca di vitamine e minerali. Aiuta la pelle a essere più luminosa e sana.",
      1, 0
    );
    frag2Tokens[7].bookmark = {
      id: 2002, origin: "pelle", translation: "skin",
      t_total_token: 1, is_mwe: false,
    };

    return [
      {
        tokens: wrapTokens(frag1Tokens),
        past_bookmarks: [],
        context_identifier: { article_id: 1, article_fragment_id: 1 },
      },
      {
        tokens: wrapTokens(frag2Tokens),
        past_bookmarks: [],
        context_identifier: { article_id: 1, article_fragment_id: 2 },
      },
      {
        tokens: wrapTokens(
          tokenizeSentence(
            "Per preparare il Nordic latte servono pochi ingredienti. Si scalda il latte e si aggiunge un cucchiaino di polvere di ortica. Si può anche aggiungere miele per il sapore.",
            2,
            0
          )
        ),
        past_bookmarks: [],
        context_identifier: { article_id: 1, article_fragment_id: 3 },
      },
    ];
  })(),
  tokenized_title_new: {
    tokens: wrapTokens(
      tokenizeSentence(
        "Nordic latte, la bevanda svedese detox per una pelle luminosa"
      )
    ),
    past_bookmarks: [],
    context_identifier: { article_id: 1 },
  },
};

// ─── Exercises (Match needs 3 bookmarks) ───────────────────────

function makeBookmark(id, from, to, context, extra = {}) {
  const contextTokens = tokenizeSentence(context);
  // Find the target word index
  const targetIdx = contextTokens.findIndex(
    (t) => t.text.toLowerCase() === from.split(" ")[0].toLowerCase()
  );
  return {
    id,
    user_word_id: id + 5000,
    meaning_id: id + 9000,
    from,
    to,
    origin: from, // alias used by audio lessons
    from_lang: "it",
    to_lang: "en",
    origin_rank: 500,
    fit_for_study: true,
    context: context,
    context_tokenized: wrapTokens(contextTokens),
    context_sent: 0,
    context_token: 0,
    t_sentence_i: 0,
    t_token_i: Math.max(targetIdx, 0),
    t_total_token: from.split(" ").length,
    url: "https://example.com/article",
    source_id: 101,
    article_id: 1,
    title: "Nordic latte",
    level: 1,
    cooling_interval: 1,
    is_last_in_cycle: false,
    is_about_to_be_learned: false,
    can_update_schedule: true,
    consecutive_correct_answers: 0,
    left_ellipsis: false,
    right_ellipsis: false,
    context_in_content: true,
    is_mwe: false,
    mwe_partner_token_i: null,
    translation_source: "reading",
    user_preference: 0,
    is_user_added: false,
    learned_datetime: null,
    scheduling_reason: "due_today",
    days_until_practice: 0,
    next_practice_time: new Date().toISOString(),
    ...extra,
  };
}

const EXERCISE_BOOKMARKS = [
  makeBookmark(
    101,
    "pelle luminosa",
    "glowing skin",
    "Questa bevanda ha molti benefici per la pelle luminosa e sana."
  ),
  makeBookmark(
    102,
    "impegnativo",
    "demanding",
    "Il percorso è stato molto impegnativo ma alla fine ne è valsa la pena."
  ),
  makeBookmark(
    103,
    "gridato",
    "shouted",
    "Il popolo romeno ha gridato forte e chiaro che vuole la pace."
  ),
  // Extra bookmarks for a richer exercise session
  makeBookmark(
    104,
    "ortica",
    "nettle",
    "Il Nordic latte è fatto con latte caldo e ortica in polvere."
  ),
  makeBookmark(
    105,
    "svedese",
    "Swedish",
    "Il Nordic latte è una bevanda svedese molto popolare."
  ),
  makeBookmark(
    106,
    "benefici",
    "benefits",
    "Questa bevanda ha molti benefici per la salute e per la pelle."
  ),
];

const SIMILAR_WORDS = ["albeit", "massively", "frequently"];

// ─── Words page (scheduled words) ─────────────────────────────

const SCHEDULED_WORDS = [
  makeBookmark(101, "pelle luminosa", "glowing skin", "Ha benefici per la pelle luminosa.", { level: 2, cooling_interval: 3, consecutive_correct_answers: 4 }),
  makeBookmark(102, "impegnativo", "demanding", "Il corso è molto impegnativo.", { level: 1, cooling_interval: 1, consecutive_correct_answers: 1 }),
  makeBookmark(103, "gridato", "shouted", "Ha gridato forte dalla finestra.", { level: 2, cooling_interval: 2, consecutive_correct_answers: 3 }),
  makeBookmark(104, "ortica", "nettle", "L'ortica è una pianta comune.", { level: 1, cooling_interval: 1 }),
  makeBookmark(105, "svedese", "Swedish", "La cucina svedese è semplice.", { level: 3, cooling_interval: 5, consecutive_correct_answers: 6 }),
  makeBookmark(106, "benefici", "benefits", "I benefici sono evidenti.", { level: 2, cooling_interval: 3, consecutive_correct_answers: 3 }),
  makeBookmark(107, "bevanda", "drink", "Questa bevanda è molto buona.", { level: 1, cooling_interval: 1, consecutive_correct_answers: 1 }),
  makeBookmark(108, "sapore", "taste", "Il sapore è dolce e fresco.", { level: 2, cooling_interval: 2 }),
  makeBookmark(109, "scalda", "heats up", "Si scalda il latte lentamente.", { level: 1, cooling_interval: 0 }),
  makeBookmark(110, "ingredienti", "ingredients", "Servono pochi ingredienti semplici.", { level: 2, cooling_interval: 4, consecutive_correct_answers: 5 }),
  makeBookmark(111, "classifica", "ranking", "Musetti scende in classifica dopo la sconfitta.", { level: 1, cooling_interval: 1 }),
  makeBookmark(112, "transizione", "transition", "La transizione energetica è un tema importante.", { level: 2, cooling_interval: 2, consecutive_correct_answers: 2 }),
];

const NEXT_IN_LEARNING = [
  makeBookmark(201, "ipocrisia", "hypocrisy", "L'ipocrisia verde è un grande problema.", { level: 0 }),
  makeBookmark(202, "invecchiamento", "aging", "Lo studio parla di invecchiamento precoce.", { level: 0 }),
];

// ─── Daily Audio ───────────────────────────────────────────────

const TODAYS_LESSON = {
  lesson_id: 42,
  audio_url: "https://api.zeeguu.org/audio/daily_lessons/42.mp3",
  duration_seconds: 285,
  created_at: new Date().toISOString(),
  words: [
    makeBookmark(101, "pelle luminosa", "glowing skin", "Ha benefici per la pelle luminosa."),
    makeBookmark(104, "ortica", "nettle", "L'ortica è una pianta medicinale."),
    makeBookmark(108, "sapore", "taste", "Il sapore è dolce e fresco."),
  ],
  pause_position_seconds: 0,
  is_paused: false,
  is_completed: false,
  listened_count: 0,
  canonical_suggestion: null,
  lesson_type: "three_words_lesson",
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
        { origin: "impegnativo", translation: "demanding" },
        { origin: "gridato", translation: "shouted" },
        { origin: "svedese", translation: "Swedish" },
      ],
      word_count: 3,
      pause_position_seconds: 0,
      is_paused: false,
      listened_count: 2,
      canonical_suggestion: null,
      lesson_type: "three_words_lesson",
    },
    {
      lesson_id: 40,
      audio_url: "/audio/daily_lessons/40.mp3",
      audio_exists: true,
      duration_seconds: 290,
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      completed_at: new Date(Date.now() - 2 * 86400000 + 3600000).toISOString(),
      is_completed: true,
      words: [
        { origin: "bevanda", translation: "drink" },
        { origin: "benefici", translation: "benefits" },
        { origin: "scalda", translation: "heats up" },
      ],
      word_count: 3,
      pause_position_seconds: 0,
      is_paused: false,
      listened_count: 1,
      canonical_suggestion: null,
      lesson_type: "three_words_lesson",
    },
  ],
  pagination: { total: 2, limit: 20, offset: 0, has_more: false },
};

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

module.exports = { getResponse, FIXTURE_IMAGE_HOST };
