// Pure logic behind the account-less shared-article page, kept out of the
// component so it can be tested directly.

// How many distinct words a visitor may tap before the page invites them to
// sign up. A conversion nudge, not a security boundary: it lives in the
// browser and resets with site data. The API's per-IP / global rate limits are
// what protect the translation bill.
export const FREE_WORDS = 5;

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

// A stranger has no native_language, so guess one from the browser. Never
// translate into the article's own language; fall back to English.
export function pickTranslationTarget(browserLanguages, articleLanguage, supported) {
  for (const tag of browserLanguages || []) {
    const code = (tag || "").split("-")[0].toLowerCase();
    if (code && code !== articleLanguage && supported.includes(code)) return code;
  }
  return articleLanguage === "en" ? supported.find((c) => c !== "en") : "en";
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
  // Only ever an in-app path — never let storage steer to another origin.
  if (!pending.path.startsWith("/read/article?")) return null;
  return pending.path;
}
