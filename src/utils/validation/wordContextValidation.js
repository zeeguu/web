/**
 * Validates that a word/phrase appears exactly once in a given context.
 *
 * This validation is essential for proper position anchoring in exercises.
 * Words that appear multiple times create ambiguous positioning, making
 * it impossible to determine which instance the user intended.
 *
 * @param {string} word - The word or phrase to validate
 * @param {string} context - The context text to search in
 * @returns {Object} Validation result with success flag and error message
 */
export function validateWordInContext(word, context) {
  const wordToFind = word.trim().toLowerCase();
  const contextText = context.trim().toLowerCase();

  // For multi-word phrases (containing spaces), use simple substring matching
  // Word boundaries don't work well with multi-word phrases, especially those
  // containing non-ASCII characters
  const isPhrase = wordToFind.includes(' ');

  let occurrenceCount;

  if (isPhrase) {
    // Simple case-insensitive substring matching for phrases
    occurrenceCount = countSubstringOccurrences(contextText, wordToFind);
  } else {
    // For single words, use Unicode-aware word boundary checking
    // Standard \b doesn't work with non-ASCII characters (e.g., Danish å, æ, ø)
    occurrenceCount = countWordOccurrences(contextText, wordToFind);
  }

  if (occurrenceCount === 0) {
    return {
      valid: false,
      errorMessage: `The word/phrase "${word.trim()}" does not appear in the context. Please check your spelling or provide a different context.`
    };
  }

  if (occurrenceCount > 1) {
    return {
      valid: false,
      errorMessage: `The word/phrase "${word.trim()}" appears ${occurrenceCount} times in the context. Please provide a context where it appears exactly once to avoid ambiguity in exercises.`
    };
  }

  // Valid - word appears exactly once
  return {
    valid: true,
    errorMessage: null
  };
}

/**
 * Count occurrences of a substring in a text (case-insensitive).
 * Used for multi-word phrases.
 */
function countSubstringOccurrences(text, substring) {
  let count = 0;
  let position = 0;

  while ((position = text.indexOf(substring, position)) !== -1) {
    count++;
    position += substring.length;
  }

  return count;
}

/**
 * Count occurrences of a single word in text, ensuring it's not part of another word.
 * Uses Unicode-aware boundary checking to support non-ASCII characters.
 */
function countWordOccurrences(text, word) {
  const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Match the word when surrounded by non-letter characters or at string boundaries
  // Using Unicode property escapes \p{L} to match any Unicode letter
  const pattern = new RegExp(`(?<!\\p{L})${escapedWord}(?!\\p{L})`, 'gu');
  const matches = text.match(pattern);
  return matches ? matches.length : 0;
}