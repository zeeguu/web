// Shared helpers for the screenshot fixtures (one content file per language).
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

// Bookmarks (looked-up words) in one learned language, from one article.
function bookmarkMaker(lang, articleTitle) {
  return function makeBookmark(id, from, to, context, extra = {}) {
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
      from_lang: lang,
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
      title: articleTitle,
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
}

// Mark tokens[i .. i+n-1] as a word the learner already looked up, so the
// translation shows above it once tapped.
function lookUp(tokens, i, n, id, origin, translation) {
  tokens[i].bookmark = { id, origin, translation, t_total_token: n, is_mwe: false };
  if (n > 1) {
    tokens[i].mergedTokens = [
      { ...tokens[i], bookmark: null },
      ...tokens.slice(i + 1, i + n).map((t) => ({ ...t })),
    ];
    for (let k = i + 1; k < i + n; k++) tokens[k].skipRender = true;
  }
  return tokens;
}

module.exports = {
  FIXTURE_IMAGE_HOST,
  tok,
  tokenizeSentence,
  wrapTokens,
  makeInteractive,
  articleBase,
  bookmarkMaker,
  lookUp,
};
