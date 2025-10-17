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
