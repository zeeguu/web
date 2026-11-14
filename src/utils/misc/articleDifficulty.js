import { combine } from "./cefr";

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

  return combine(llm?.level, ml?.level);
}

