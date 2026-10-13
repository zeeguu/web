// Pure logic behind the account-less shared-article page, kept out of the
// component so it can be tested directly.

// How many distinct words a visitor may tap before the page invites them to
// sign up. A conversion nudge, not a security boundary: it lives in the
// browser and resets with site data. The API's per-IP / global rate limits are
// what protect the translation bill.
export const FREE_WORDS = 10;

const TAPPED_KEY = "public_reader_tapped_words";
const PENDING_KEY = "pending_shared_article";
const PENDING_TTL_MS = 24 * 60 * 60 * 1000;

function read(storage, key, fallback) {
  try {
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(storage, key, value) {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // Private mode / storage disabled: the meter just won't persist.
  }
}

// Distinct words, case-insensitively: re-tapping a word you already looked up
// is free, which stretches the taste further and feels fairer.
export function createWordMeter(storage, freeWords = FREE_WORDS) {
  let tapped = read(storage, TAPPED_KEY, []);
  return {
    allow(text) {
      const key = (text || "").trim().toLowerCase();
      if (tapped.includes(key)) return true;
      if (tapped.length >= freeWords) return false;
      tapped = [...tapped, key];
      write(storage, TAPPED_KEY, tapped);
      return true;
    },
    remaining() {
      return Math.max(0, freeWords - tapped.length);
    },
  };
}

// A stranger has no native_language, so suggest one from the browser for the
// "translate into" question. Never the article's own language. English is the
// fallback — except for an English article, where there is no sensible guess
// and the visitor has to pick (null).
export function pickTranslationTarget(browserLanguages, articleLanguage, supported) {
  for (const tag of browserLanguages || []) {
    const code = (tag || "").split("-")[0].toLowerCase();
    if (code && code !== articleLanguage && supported.includes(code)) return code;
  }
  return articleLanguage === "en" ? null : "en";
}

// Sign-up is several screens (and on the web an email round trip) long, and
// none of them know where the visitor came from. Park the article here; the
// last onboarding step takes the visitor back to it.
export function rememberPendingSharedArticle(storage, path, now = Date.now()) {
  write(storage, PENDING_KEY, { path, at: now });
}

export function consumePendingSharedArticle(storage, now = Date.now()) {
  const pending = read(storage, PENDING_KEY, null);
  try {
    storage.removeItem(PENDING_KEY);
  } catch {
    // ignore
  }
  if (!pending?.path || now - pending.at > PENDING_TTL_MS) return null;
  // Only ever an article or summary link — never let storage steer to another origin.
  if (!/^\/read\/[A-Za-z0-9]+(\/summary(\?level=[ABC][12])?)?$/.test(pending.path)) return null;
  return pending.path;
}

// The link a "Share summary" button hands out: the article's public code, plus
// the level the sharer reads it at so the friend sees the same summary. The
// level says nothing about who shared it.
export function summaryShareUrl(code, level) {
  const url = `https://zeeguu.org/read/${code}/summary`;
  return level ? `${url}?level=${encodeURIComponent(level)}` : url;
}

// The summary page's level pills, from the API's `levels` (easiest first, the
// article's own last) and the summary on screen: its own summary is addressed
// as "summary", a level's as "summary:<row id>". `level` is what ?level= takes
// for that pill; the original's is null when the article has no single level.
export function summaryLevelPills(levels, summaryPart, shownLevel) {
  const options = (levels || []).map(({ level, original }) => ({
    value: original ? "original" : level,
    // The article's own summary is a summary too, not the article: plain level.
    pillLabel: level || "Standard",
    level,
  }));
  const selected = summaryPart === "summary" ? "original" : shownLevel;
  return { options, selected };
}
