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

/**
 * The dialect stored for a language -- which variety of it the learner is
 * studying -- or "" for no preference.
 *
 * A different question from the one above, and a different field: where the news
 * comes from is not which variety you are learning. "" is by far the common
 * answer, and means the language is read in whatever it has always been read in.
 */
export function dialectFieldValue(userDetails, languageCode) {
  if (!userDetails || !languageCode) return "";
  return userDetails[languageCode + "_dialect"] || "";
}

/**
 * Which dialect pill should read as selected, given what is stored.
 *
 * Not simply the stored value. "" means no preference, and a learner with no
 * preference is already being read in the first of these -- the one Zeeguu has
 * served all along -- so showing nothing selected would misdescribe what they
 * hear today. The API sends the catalogue in that order for exactly this.
 *
 * It stays a display rule and never a saved one: a learner who does not touch
 * the control still saves "", because showing what they get is not the same as
 * their having chosen it.
 */
export function effectiveDialect(dialects, storedDialect) {
  return storedDialect || dialects?.[0]?.country || "";
}
