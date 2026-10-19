import { cefrOrdinal } from "./cefrScale";

// Convert a stored level (0-6) to the CEFR string to pick texts by (A1-C2).
// 0 is A0, and reads as A1: nothing is written below A1. Only the audio
// lessons go below it, and the API decides that on its own.
const NUMERIC_TO_CEFR = {
  0: "A1",
  1: "A1",
  2: "A2",
  3: "B1",
  4: "B2",
  5: "C1",
  6: "C2",
};

/**
 * Read the user's CEFR level (0-6, 0 is A0) for a given language code from the
 * userDetails object. Returns undefined or null when the level isn't set --
 * never test it with `if (level)`, which drops A0.
 *
 * userDetails stores per-language CEFR under `<lang>_cefr_level` keys
 * (e.g. `de_cefr_level`, `en_cefr_level`).
 */
export function getUserCefrLevel(userDetails, languageCode) {
  if (!userDetails || !languageCode) return undefined;
  return userDetails[languageCode + "_cefr_level"];
}

/**
 * The value the CEFR field should hold for a language: the user's stored level
 * for *that* language, as a CEFR_LEVELS value (the strings "0".."6"), or "" when
 * they have no level for it yet.
 *
 * Levels are stored per language, so this has to be re-read whenever the chosen
 * language changes -- otherwise the field keeps showing the previous language's
 * level and saves it under the new one.
 */
export function cefrLevelFieldValue(userDetails, languageCode) {
  const level = getUserCefrLevel(userDetails, languageCode);
  return level === undefined || level === null ? "" : String(level);
}

/**
 * Decide whether the language-choice modal is worth showing for an article
 * the user is about to read.
 *
 * Cross-language: always show — translate-and-adapt is real work regardless
 * of the source CEFR.
 *
 * Same-language: only show if the article is strictly harder than the user's
 * CEFR. If the article is already at or below their level, simplifying it
 * down doesn't help (and the backend rejects it). When we don't have a
 * solid level for either side, default to showing the modal — better to ask
 * than to silently skip an offer.
 */
export function shouldShowLanguageChoice(
  articleLanguage,
  articleCefrLevel,
  userDetails,
) {
  if (!userDetails) return true;
  if (articleLanguage !== userDetails.learned_language) return true;

  const userNumeric = getUserCefrLevel(userDetails, articleLanguage);
  const articleOrd = cefrOrdinal(articleCefrLevel);
  // A stored level that is not one of 0..6 is as good as none: ask.
  if (!articleOrd || !(userNumeric in NUMERIC_TO_CEFR)) return true;
  // Compared as the level the user reads at (A0 reads A1, see numericToCefr).
  return articleOrd > cefrOrdinal(numericToCefr(userNumeric));
}

/**
 * Convert a stored level to the CEFR string to pick texts by.
 * User settings store levels as 0-6 (0 is A0), the API expects "A1"-"C2".
 *
 * @param {number|string} numericLevel - Level as number (0-6)
 * @returns {string} CEFR level string (A1-C2), defaults to B1 for anything
 *   else, including no level at all
 */
export function numericToCefr(numericLevel) {
  return NUMERIC_TO_CEFR[numericLevel] || "B1";
}

/**
 * The level to explain a word at, from what onboarding stored in localStorage:
 * the level as a number in a string ("0".."6"), or nothing. Sent as is, the
 * API got "3" where it expects "B1". A1 when nothing was stored.
 */
export function explanationCefr(storedLevel) {
  if (!storedLevel) return "A1"; // localStorage holds strings, so "0" (A0) is truthy
  // A browser may still hold a CEFR code from before; it is already what the
  // API wants.
  if (cefrOrdinal(storedLevel)) return storedLevel;
  return numericToCefr(storedLevel);
}
