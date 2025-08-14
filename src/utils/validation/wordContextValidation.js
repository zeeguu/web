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
  
  // Count occurrences using regex with word boundaries
  const wordPattern = new RegExp(`\\b${wordToFind.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
  const matches = contextText.match(wordPattern);
  const occurrenceCount = matches ? matches.length : 0;
  
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