export const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

/**
 * The levels the teacher can rewrite a text to, easiest first.
 *
 * Every level strictly easier than the original, plus the in-between level just
 * below it ("B1/B2" for a B2 text): a lighter rewrite for a class that finds the
 * original too hard but the next level down too simple (a B1-B2 course).
 *
 * A compound original like "B1/B2" is normalised to its harder end, so we never
 * offer a target that isn't simpler; its in-between level would be the original
 * itself, so none is added.
 */
export function rewriteTargets(level) {
  if (!level) return [];
  const parts = String(level).split("/").map((tok) => tok.trim());
  const hardestIdx = parts
    .map((tok) => CEFR_LEVELS.indexOf(tok))
    .reduce((max, idx) => Math.max(max, idx), -1);
  if (hardestIdx <= 0) return []; // unknown, or already A1 — nothing easier

  const easier = CEFR_LEVELS.slice(0, hardestIdx);
  if (parts.length > 1) return easier;
  return [...easier, `${CEFR_LEVELS[hardestIdx - 1]}/${CEFR_LEVELS[hardestIdx]}`];
}

export function isInBetweenLevel(level) {
  return String(level).includes("/");
}
