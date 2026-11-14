// Italian screenshot content: the default set, used for every store
// localization without its own (see content-da.js for the Danish one).
const {
  FIXTURE_IMAGE_HOST,
  tokenizeSentence,
  wrapTokens,
  makeInteractive,
  articleBase,
  bookmarkMaker,
} = require("./helpers");

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

// ─── Article 1 — with pre-translated words in title ────────────

// Title tokens, with "pelle luminosa" (tokens 9-10) already looked up, so the
// feed card shows a translation over the title the way it does in the app.
const article1TitleTokens = tokenizeSentence(
  "Nordic latte, la bevanda svedese detox per una pelle luminosa"
);
article1TitleTokens[9].bookmark = {
  id: 2004, origin: "pelle luminosa", translation: "glowing skin",
  t_total_token: 2, is_mwe: false,
};
article1TitleTokens[9].mergedTokens = [
  { ...article1TitleTokens[9], bookmark: null },
  { ...article1TitleTokens[10] },
];
article1TitleTokens[10].skipRender = true;

// AI article title, with "appropriarci" (token 1) already looked up: the
// first feed card shows a translation over a hard word.
const article3TitleTokens = tokenizeSentence(
  "Possiamo appropriarci delle intelligenze artificiali in modo critico"
);
article3TitleTokens[1].bookmark = {
  id: 2005, origin: "appropriarci", translation: "take ownership",
  t_total_token: 1, is_mwe: false,
};

// Northern lights article (the top feed card): a positive story with a
// striking photo. Headline adapted from greenme.it, "L'aurora boreale visibile
// di nuovo in Italia: lo spettacolo sulle Alpi". Photo: Dante Fabillar on
// Unsplash (unsplash.com/photos/_cQ66UoJjLo, taken in Norway), Unsplash
// License: free for commercial use, no attribution needed.
// "Aurora boreale" (tokens 0-1) is already looked up.
const article6TitleTokens = tokenizeSentence(
  "Aurora boreale sulle Alpi: lo spettacolo visto anche in Italia"
);
article6TitleTokens[0].bookmark = {
  id: 2006, origin: "Aurora boreale", translation: "northern lights",
  t_total_token: 2, is_mwe: false,
};
article6TitleTokens[0].mergedTokens = [
  { ...article6TitleTokens[0], bookmark: null },
  { ...article6TitleTokens[1] },
];
article6TitleTokens[1].skipRender = true;

// ─── Articles feed ─────────────────────────────────────────────


// Order matters: the first two cards are what the store screenshot shows,
// so they are science and sport, not lifestyle. The reader screenshot uses
// article 1 (Nordic latte) on its own.
const RECOMMENDED_ARTICLES = [
  articleBase(6, {
    url: "https://www.greenme.it/scienza-e-tecnologia/astronomia/laurora-boreale-visibile-di-nuovo-in-italia-lo-spettacolo-sulle-alpi-alle-prime-luci-di-oggi/",
    title: "Aurora boreale sulle Alpi: lo spettacolo visto anche in Italia",
    summary:
      "Una forte tempesta solare ha portato l'aurora boreale fino all'Italia. Il cielo sopra le Alpi si è colorato di rosso e di verde.",
    language: "it",
    img_url: `https://${FIXTURE_IMAGE_HOST}/article6-aurora.jpg`,
    cefr_level: "A2",
    metrics: { cefr_level: "A2", word_count: 380 },
    word_count: 380,
    parent_article_id: 600,
    parent_url: "https://www.greenme.it/scienza-e-tecnologia/astronomia/laurora-boreale-visibile-di-nuovo-in-italia-lo-spettacolo-sulle-alpi-alle-prime-luci-di-oggi/",
    feed_name: "greenme.it",
    topics_list: [["Technology & Science", 2]],
    published: new Date(Date.now() - 2 * 3600000).toISOString(),
    interactiveTitle: {
      tokens: wrapTokens(article6TitleTokens),
      past_bookmarks: [],
      context_identifier: { article_id: 6 },
    },
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
    interactiveTitle: {
      tokens: wrapTokens(article3TitleTokens),
      past_bookmarks: [],
      context_identifier: { article_id: 3 },
    },
  }),
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

const makeBookmark = bookmarkMaker("it", "Nordic latte");

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
  audio_url: "/audio/daily_lessons/42.mp3",
  duration_seconds: 351,
  created_at: new Date().toISOString(),
  title: "Marco e Anna parlano delle bevande",
  words: [
    makeBookmark(101, "pelle luminosa", "glowing skin", "Ha benefici per la pelle luminosa."),
    makeBookmark(104, "ortica", "nettle", "L'ortica è una pianta medicinale."),
    makeBookmark(108, "sapore", "taste", "Il sapore è dolce e fresco."),
  ],
  pause_position_seconds: 134,
  is_paused: true,
  is_completed: false,
  listened_count: 1,
  canonical_suggestion: "bevande naturali",
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
  language: "it",
  title: "Nordic latte, la bevanda svedese detox per una pelle luminosa",
  url: "https://vogue.it/article/nordic-latte",
  img_url: `https://${FIXTURE_IMAGE_HOST}/article1-nordic-latte.jpg`,
};

// What render-live.js taps or sets for this language.
const CAPTURE = {
  readerWords: ["bevanda svedese", "latte caldo", "pelle"],
  feedWords: ["Aurora"],
  audioTopic: "bevande naturali",
  sharedArticleUrl: "https://vogue.it/article/nordic-latte",
  // record-preview.js: the video starts with nothing looked up and taps
  // these (single words, translated by the mocked translate_word).
  videoTaps: {
    feed: [["spettacolo", "show"]],
    reader: [["bevanda", "drink"], ["caldo", "warm"], ["pelle", "skin"]],
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
