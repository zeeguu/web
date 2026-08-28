// Convert numeric level (1-6) to CEFR string (A1-C2)
const NUMERIC_TO_CEFR = {
  1: "A1",
  2: "A2",
  3: "B1",
  4: "B2",
  5: "C1",
  6: "C2",
};

export const CEFR_ORDINAL = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };

/**
 * The single difficulty a teacher sees for an article.
 *
 * The rule itself lives on the server, in
 * ArticleCefrAssessment.update_effective_cefr_level -- it is persisted as
 * article_cefr_assessment.effective_cefr_level and shipped in the payload, so
 * the normal answer here is simply to read it. Note it can be a compound level
 * ("B1/B2") when the two estimators disagree by one step.
 *
 * The fallback below exists for one caller only: the article editor, where the
 * teacher is changing the text and the estimators are re-running client-side,
 * so no stored value describes what is on screen yet. It mirrors the server's
 * priority deliberately -- if you change one, change the other.
 *
 * @param assessments article.cefr_assessments; the API sends it to teachers only
 * @param adaptedLevel level the text has just been rewritten to, not yet saved
 */
export function effectiveCefrLevel(assessments, adaptedLevel = null) {
  if (adaptedLevel) return adaptedLevel;
  if (!assessments) return null;
  if (assessments.effective_cefr_level) return assessments.effective_cefr_level;

  return synthesizeCefrLevel(assessments);
}

/**
 * Client-side stand-in for the server's synthesis, for the editor's unsaved
 * state. Same priority: a teacher's own level wins; otherwise the estimators
 * agree (one level), disagree by one step (compound), or disagree by more (the
 * harder one, conservatively).
 */
function synthesizeCefrLevel({ llm, ml, teacher }) {
  if (teacher?.level) return teacher.level;

  const llmLevel = llm?.level || null;
  const mlLevel = ml?.level || null;
  if (!llmLevel || !mlLevel) return llmLevel || mlLevel || null;
  if (llmLevel === mlLevel) return llmLevel;

  const [lower, higher] = [llmLevel, mlLevel].sort(
    (a, b) => CEFR_ORDINAL[a] - CEFR_ORDINAL[b],
  );
  const distance = Math.abs(CEFR_ORDINAL[llmLevel] - CEFR_ORDINAL[mlLevel]);

  return distance === 1 ? `${lower}/${higher}` : higher;
}

/**
 * Read the user's CEFR level (1-6) for a given language code from the
 * userDetails object. Returns undefined when the level isn't set.
 *
 * userDetails stores per-language CEFR under `<lang>_cefr_level` keys
 * (e.g. `de_cefr_level`, `en_cefr_level`).
 */
export function getUserCefrLevel(userDetails, languageCode) {
  if (!userDetails || !languageCode) return undefined;
  return userDetails[languageCode + "_cefr_level"];
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
  const articleOrd = CEFR_ORDINAL[articleCefrLevel];
  if (!articleOrd || userNumeric == null) return true;
  return articleOrd > userNumeric;
}

/**
 * Convert numeric CEFR level to string.
 * User settings store levels as 1-6, API expects "A1"-"C2".
 *
 * @param {number|string} numericLevel - Level as number (1-6)
 * @returns {string} CEFR level string (A1-C2), defaults to B1
 */
export function numericToCefr(numericLevel) {
  return NUMERIC_TO_CEFR[numericLevel] || "B1";
}

/**
 * Extract the highest CEFR level from a display string.
 *
 * Examples:
 * - "B1/B2" -> "B2"
 * - "A1/B2 ⚠️" -> "B2"
 * - "C1" -> "C1"
 *
 * @param {string} displayLevel - The CEFR level display string
 * @returns {string} The highest CEFR level
 */
export function getHighestCefrLevel(displayLevel) {
  if (!displayLevel) return 'B1';

  // Convert to string in case it's not
  const levelStr = String(displayLevel);

  // Remove warning emoji if present
  const cleanLevel = levelStr.replace(/⚠️/g, '').trim();

  // If it contains a slash, split and take the highest (last one after sorting)
  if (cleanLevel.includes('/')) {
    const levels = cleanLevel.split('/').map(l => l.trim());
    const cefrOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    levels.sort((a, b) => cefrOrder.indexOf(a) - cefrOrder.indexOf(b));
    return levels[levels.length - 1]; // Return highest (last after sorting)
  }

  return cleanLevel;
}
