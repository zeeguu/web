/**
 * Highlights a word in a context string by wrapping it with HTML.
 *
 * This function handles:
 * - Case-insensitive matching
 * - Unicode normalization (NFC)
 * - Accent-insensitive matching as fallback
 * - Preserves the original case/accents in the highlighted output
 *
 * @param {string} context - The text containing the word to highlight
 * @param {string} word - The word to find and highlight
 * @param {string} highlightTag - HTML tag/wrapper for highlighting (default: '<span class="highlightedWord">$1</span>')
 * @returns {string} Context with the word highlighted, or original context if word not found
 *
 * @example
 * highlightWord("Fire personer var i en båd", "bad")
 * // Returns: "Fire personer var i en <span class="highlightedWord">båd</span>"
 *
 * highlightWord("selon nous oriente toute", "orienté")
 * // Returns: "selon nous <span class="highlightedWord">oriente</span> toute"
 */
export function highlightWord(context, word, highlightTag = '<span class="highlightedWord">$1</span>') {
  if (!context || !word) return context;

  // Normalize both strings for comparison
  const normalizeForComparison = (str) => {
    return str.normalize('NFC').toLowerCase();
  };

  const normalizedWord = normalizeForComparison(word);
  const normalizedContext = normalizeForComparison(context);

  // Try exact normalized match first
  const exactIndex = normalizedContext.indexOf(normalizedWord);
  if (exactIndex !== -1) {
    // Extract the actual substring from the original context (preserving case/accents)
    const actualWord = context.substr(exactIndex, word.length);
    const before = context.substr(0, exactIndex);
    const after = context.substr(exactIndex + word.length);
    return before + highlightTag.replace('$1', actualWord) + after;
  }

  // Fallback: Try accent-insensitive matching using a library if available
  // This handles cases like "orienté" vs "oriente"
  try {
    const removeAccents = require('remove-accents');
    const accentFreeWord = removeAccents(normalizedWord);
    const accentFreeContext = removeAccents(normalizedContext);

    const accentFreeIndex = accentFreeContext.indexOf(accentFreeWord);
    if (accentFreeIndex !== -1) {
      const actualWord = context.substr(accentFreeIndex, word.length);
      const before = context.substr(0, accentFreeIndex);
      const after = context.substr(accentFreeIndex + word.length);
      return before + highlightTag.replace('$1', actualWord) + after;
    }
  } catch (e) {
    // Library not available or error, continue with original context
  }

  // Word not found - return original context unchanged
  return context;
}

/**
 * Replaces a word in context with a placeholder (e.g., "_____").
 * Uses the same robust matching as highlightWord.
 *
 * @param {string} context - The text containing the word to replace
 * @param {string} word - The word to find and replace
 * @param {string} placeholder - The replacement text (default: "_____")
 * @returns {string} Context with the word replaced, or original context if word not found
 */
export function replaceWordWithPlaceholder(context, word, placeholder = "_____") {
  // Reuse the highlighting logic but with a different "tag"
  return highlightWord(context, word, placeholder);
}
