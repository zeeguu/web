import { CEFR_ORDINAL } from "./cefrScale";

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
