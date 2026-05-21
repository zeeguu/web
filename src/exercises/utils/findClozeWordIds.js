import { findWordIdsByPhrase } from "./findWordIdsByPhrase.js";
import { removePunctuation } from "../../utils/text/preprocessing";

/**
 * Find word IDs for the cloze slot based on bookmark position info.
 *
 * Uses the bookmark's position data (sentence index, token index) to find
 * the exact words to blank out, avoiding ambiguity when the same word
 * appears multiple times in the context.
 *
 * Falls back to string-based search if position lookup fails or returns
 * words that don't match the expected phrase.
 *
 * @param {Object} interactiveText - The InteractiveText instance
 * @param {Object} bookmark - The exercise bookmark with position info
 * @returns {Array<string>} Array of word IDs that should be blanked out
 */
export function findClozeWordIds(interactiveText, bookmark) {
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

    const foundIds = [];
    const foundWords = [];
    let word = paragraphs[0].linkedWords.head;

    while (word) {
      if (word.token) {
        const adjustedSentIndex = word.token.sent_i - contextOffset;
        const tokenIndex = word.token.token_i;
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
      // Use removePunctuation so leading/trailing quotes etc. don't break
      // the match — bookmark-restored tokens can carry a glued apostrophe
      // ("'Se dig ikke tilbage") while bookmark.from doesn't.
      const foundPhrase = removePunctuation(foundWords.join(" ").toLowerCase());
      const expectedPhrase = removePunctuation(targetPhrase.toLowerCase());

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
