/**
 * The value the variety field should hold for a language: the country stored for
 * *that* language, or "" for no preference.
 *
 * Varieties are stored per language on userDetails, under `<code>_variety`, the
 * same shape as the CEFR level. A variety is an answer about one language --
 * Belgian is an answer about Dutch -- so it has to be re-read whenever the chosen
 * language changes, or the field would offer Portuguese a variety of Dutch.
 */
export function varietyFieldValue(userDetails, languageCode) {
  if (!userDetails || !languageCode) return "";
  return userDetails[languageCode + "_variety"] || "";
}
