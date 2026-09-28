/**
 * The CEFR levels as an ordered scale, for comparing one level against another.
 *
 * Deliberately free of i18n: `assorted/cefrLevels` builds the labelled options
 * for a picker and imports `strings` to do it, so anything that merely needs to
 * know that B2 is harder than B1 imports this instead of dragging the
 * translation bundle along with it.
 */
export const CEFR_ORDINAL = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };

/**
 * The ordinal of an article's level, or undefined if it isn't one.
 *
 * An article's effective level can be compound ("B1/B2") when its two
 * assessments disagree by one step (update_effective_cefr_level in the API's
 * article_cefr_assessment.py); that reads as the harder of the two.
 */
export function cefrOrdinal(level) {
  if (!level) return undefined;
  const ordinals = String(level)
    .split("/")
    .map((part) => CEFR_ORDINAL[part.trim()])
    .filter(Boolean);
  return ordinals.length ? Math.max(...ordinals) : undefined;
}
