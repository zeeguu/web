/**
 * The value the variety field should hold for a language: the country stored for
 * *that* language, or "" for no preference.
 *
 * Varieties are stored per language on userDetails, under `<code>_feed_variety`,
 * the same shape as the CEFR level. A variety is an answer about one language --
 * Belgian is an answer about Dutch -- so it has to be re-read whenever the chosen
 * language changes, or the field would offer Portuguese a variety of Dutch.
 *
 * `feed_variety` rather than `variety` because the API now stores two preferences
 * per language: this one -- which country's sources to show -- and `dialect`,
 * which variety the learner is studying. Nothing here reads the dialect yet.
 */
export function varietyFieldValue(userDetails, languageCode) {
  if (!userDetails || !languageCode) return "";
  return userDetails[languageCode + "_feed_variety"] || "";
}
