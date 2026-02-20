import { removePunctuation } from "../../utils/text/preprocessing";

/**
 * Find word IDs by searching for a phrase in the text.
 *
 * This is a fallback for when position-based lookup isn't available.
 * Used by exercises like OrderWords that compute their own cloze phrase.
 *
 * @param {Object} interactiveText - The InteractiveText instance
 * @param {string} phrase - The phrase to find
 * @returns {Array<string>} Array of word IDs for the first matching phrase
 */
export function findWordIdsByPhrase(interactiveText, phrase) {
  if (!interactiveText || !phrase) return [];

  const paragraphs = interactiveText.paragraphsAsLinkedWordLists;
  if (!paragraphs || !paragraphs[0]) return [];

  const targetWords = phrase.split(" ").map(w => removePunctuation(w).toLowerCase());
  let word = paragraphs[0].linkedWords.head;

  while (word) {
    if (removePunctuation(word.word).toLowerCase() === targetWords[0]) {
      let matchedIds = [];
      let currentWord = word;
      let matched = true;

      for (let i = 0; i < targetWords.length; i++) {
        if (currentWord && removePunctuation(currentWord.word).toLowerCase() === targetWords[i]) {
          matchedIds.push(currentWord.id);
          currentWord = currentWord.next;
        } else {
          matched = false;
          break;
        }
      }

      if (matched && matchedIds.length === targetWords.length) {
        return matchedIds;
      }
    }
    word = word.next;
  }

  return [];
}
