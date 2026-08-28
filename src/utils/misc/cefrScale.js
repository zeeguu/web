/**
 * The CEFR levels as an ordered scale, for comparing one level against another.
 *
 * Deliberately free of i18n: `assorted/cefrLevels` builds the labelled options
 * for a picker and imports `strings` to do it, so anything that merely needs to
 * know that B2 is harder than B1 imports this instead of dragging the
 * translation bundle along with it.
 */
export const CEFR_ORDINAL = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };
