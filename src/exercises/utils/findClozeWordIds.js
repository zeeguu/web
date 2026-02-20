import { findWordIdsByPhrase } from "./findWordIdsByPhrase.js";

/**
 * Find word IDs for the cloze slot based on bookmark position info.
 *
 * Uses the bookmark's position data (sentence index, token index) to find
 * the exact words to blank out, avoiding ambiguity when the same word
 * appears multiple times in the context.
 *
 * For MWEs (multi-word expressions), can optionally use mwe_group_id to find
 * all words that belong to the same expression, even if they're not contiguous
 * (e.g., "se... i øjnene" for "face the reality"). This is useful for highlighting
 * but NOT for cloze blanking (separated blanks don't make sense).
 *
 * Falls back to string-based search if position lookup fails or returns
 * words that don't match the expected phrase.
 *
 * @param {Object} interactiveText - The InteractiveText instance
 * @param {Object} bookmark - The exercise bookmark with position info
 * @param {Object} options - Optional settings
 * @param {boolean} options.includeSeparatedMwe - If true, include all MWE parts even if separated (for highlighting). Default: false.
 * @returns {Array<string>} Array of word IDs that should be blanked out
 */
export function findClozeWordIds(interactiveText, bookmark, options = {}) {
  const { includeSeparatedMwe = false } = options;
  if (!interactiveText || !bookmark) return [];

  const paragraphs = interactiveText.paragraphsAsLinkedWordLists;
  if (!paragraphs || !paragraphs[0]) return [];

  const targetPhrase = bookmark.from;
  const targetSentenceIndex = bookmark.t_sentence_i;
  const targetTokenIndex = bookmark.t_token_i;
  const totalTokens = bookmark.t_total_token || 1;
  const contextOffset = bookmark.context_sent || 0;

  // Try position-based lookup first
  if (targetSentenceIndex !== null && targetSentenceIndex !== undefined &&
      targetTokenIndex !== null && targetTokenIndex !== undefined) {

    // First, find the word at the exact target position
    let targetWord = null;
    let word = paragraphs[0].linkedWords.head;
    while (word) {
      if (word.token) {
        const adjustedSentIndex = word.token.sent_i - contextOffset;
        if (adjustedSentIndex === targetSentenceIndex &&
            word.token.token_i === targetTokenIndex) {
          targetWord = word;
          break;
        }
      }
      word = word.next;
    }

    // If target word has an MWE group ID and we want separated MWE parts (for highlighting)
    if (includeSeparatedMwe && targetWord && targetWord.token.mwe_group_id) {
      const mweGroupId = targetWord.token.mwe_group_id;
      const mweIds = [];
      word = paragraphs[0].linkedWords.head;
      while (word) {
        if (word.token && word.token.mwe_group_id === mweGroupId) {
          mweIds.push(word.id);
        }
        word = word.next;
      }
      if (mweIds.length > 0) {
        return mweIds;
      }
    }

    // Standard position-based lookup for contiguous tokens
    const foundIds = [];
    const foundWords = [];
    word = paragraphs[0].linkedWords.head;

    while (word) {
      if (word.token) {
        const adjustedSentIndex = word.token.sent_i - contextOffset;
        const tokenIndex = word.token.token_i;

        // Check if this word is within the target range
        if (adjustedSentIndex === targetSentenceIndex &&
            tokenIndex >= targetTokenIndex &&
            tokenIndex < targetTokenIndex + totalTokens) {
          foundIds.push(word.id);
          foundWords.push(word.word);
        }
      }
      word = word.next;
    }

    // Verify the found words match the target phrase
    if (foundIds.length > 0 && targetPhrase) {
      const foundPhrase = foundWords.join(" ").toLowerCase().replace(/[.,!?;:]/g, "");
      const expectedPhrase = targetPhrase.toLowerCase().replace(/[.,!?;:]/g, "");

      if (foundPhrase === expectedPhrase) {
        return foundIds;
      }
      // Position didn't match - fall through to string search
    } else if (foundIds.length > 0) {
      return foundIds;
    }
  }

  // Fall back to string-based search
  if (targetPhrase) {
    return findWordIdsByPhrase(interactiveText, targetPhrase);
  }

  return [];
}
