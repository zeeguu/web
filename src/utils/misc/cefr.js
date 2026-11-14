/**
 * The CEFR levels: their order, and the one policy for a level between two.
 * The web's twin of the API's zeeguu/core/cefr.py; keep the two in step.
 *
 * Deliberately free of i18n: `assorted/cefrLevels` builds the labelled options
 * for a picker and imports `strings` to do it, so anything that merely needs to
 * know that B2 is harder than B1 imports this instead of dragging the
 * translation bundle along with it.
 *
 * A split level ("B1/B2") is what the API writes when its two assessments of a
 * text disagree by one step (combine below). It counts as the HIGHER of the
 * two everywhere: the question we ask of a level is nearly always "is this too
 * hard for the learner?", and too easy beats too hard.
 */

export const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

// A user's level is stored as an index into this (0..6); null means not set.
// A0 exists only for learners: no text is assessed below A1.
export const STORED_LEVELS = ["A0", ...LEVELS];

/** True for exactly one of A1..C2 (not a split level, not A0). */
export function isLevel(value) {
  return LEVELS.includes(value);
}

/** A1 -> 0 .. C2 -> 5; a split level ranks as its higher part; null otherwise. */
export function rank(level) {
  if (typeof level !== "string") return null;
  const ranks = level
    .split("/")
    .map((part) => LEVELS.indexOf(part.trim()))
    .filter((index) => index >= 0);
  return ranks.length ? Math.max(...ranks) : null;
}

/** `level` as one of A1..C2 (a split level as its higher part), or null. */
export function single(level) {
  const r = rank(level);
  return r === null ? null : LEVELS[r];
}

/**
 * The level of the texts a learner at `level` reads, as one of A1..C2: A0
 * reads A1 (nothing is written below A1), a split level its higher part.
 */
export function readable(level) {
  return level === "A0" ? "A1" : single(level);
}

/**
 * One level out of two assessments of the same text (LLM and ML): the level
 * when they agree, a split level when one step apart, the higher when further
 * apart. When only one is a level, that one; when neither, null.
 */
export function combine(level, other) {
  const a = rank(level);
  const b = rank(other);
  if (a === null || b === null) return single(level) || single(other);
  const [low, high] = [a, b].sort((x, y) => x - y);
  return high - low === 1 ? `${LEVELS[low]}/${LEVELS[high]}` : LEVELS[high];
}

/** The levels strictly below `level`, easiest first; [] when not a level. */
export function below(level) {
  const r = rank(level);
  return r === null ? [] : LEVELS.slice(0, r);
}

/** True when `level` is harder than `other`; false when either is not a level. */
export function isAbove(level, other) {
  const a = rank(level);
  const b = rank(other);
  return a !== null && b !== null && a > b;
}

/**
 * A stored level (0..6, as a number or a string like "3") as A0..C2, or null.
 * Never test a stored level with `if (level)`: 0 is A0.
 */
export function fromNumber(number) {
  if (number === null || number === undefined || number === "") return null;
  if (typeof number !== "number" && typeof number !== "string") return null;
  const index = Number(number);
  return Number.isInteger(index) ? STORED_LEVELS[index] ?? null : null;
}

/** A0..C2 as the number a user's level is stored as, or null. */
export function toNumber(level) {
  const index = STORED_LEVELS.indexOf(level);
  return index === -1 ? null : index;
}
