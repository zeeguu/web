// Convert numeric level (1-6) to CEFR string (A1-C2)
const NUMERIC_TO_CEFR = {
  1: "A1",
  2: "A2",
  3: "B1",
  4: "B2",
  5: "C1",
  6: "C2",
};

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
