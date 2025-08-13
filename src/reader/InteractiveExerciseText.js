import InteractiveText from "./InteractiveText.js";

export default class InteractiveExerciseText extends InteractiveText {
  constructor(
    tokenizedParagraphs,
    sourceId,
    api,
    previousBookmarks,
    translationEvent = api.TRANSLATE_TEXT,
    language,
    source = "",
    zeeguuSpeech,
    contextIdentifier,
    formatting,
    expectedSolution = null,
    expectedPosition = null,
    onSolutionFound = null,
  ) {
    // Call parent constructor
    super(
      tokenizedParagraphs,
      sourceId,
      api,
      previousBookmarks,
      translationEvent,
      language,
      source,
      zeeguuSpeech,
      contextIdentifier,
      formatting,
    );

    // Exercise-specific properties
    this.clickedWords = []; // Track clicked words and their positions
    this.expectedSolution = expectedSolution; // Words that should be clicked for exercises
    this.expectedPosition = expectedPosition; // Position info for the expected solution
    this.onSolutionFound = onSolutionFound; // Callback when solution is found
  }

  // Track a clicked word for exercises
  trackWordClick(word) {
    console.log("trackWordClick called with:", word.word);

    this.clickedWords.push({
      word: word.word,
      sentenceIndex: word.token ? word.token.sent_i : null,
      tokenIndex: word.token ? word.token.token_i : null,
    });

    // Check if this word is part of the expected solution
    if (this.expectedSolution && this.onSolutionFound) {
      const solutionWords = this.expectedSolution.split(" ").map((w) => w.toLowerCase());
      const clickedWord = word.word.toLowerCase();

      // First check if the word matches
      if (solutionWords.includes(clickedWord)) {
        // If we have position info, verify it's the correct instance
        if (this.expectedPosition && word.token) {
          const targetSentenceIndex = this.expectedPosition.sentenceIndex;
          const targetTokenIndex = this.expectedPosition.tokenIndex;
          const targetTotalTokens = this.expectedPosition.totalTokens || 1;
          const contextOffset = this.expectedPosition.contextOffset || 0;
          const adjustedSentIndex = word.token.sent_i - contextOffset;

          // FIRST: Try the original bookmark position (most reliable when correct)
          const solutionWordCount = solutionWords.length;
          const expectedEndToken = targetTokenIndex + solutionWordCount;

          if (
            adjustedSentIndex === targetSentenceIndex &&
            word.token.token_i >= targetTokenIndex &&
            word.token.token_i < expectedEndToken
          ) {
            // Bookmark position is valid - use it (handles multiple "ikke" correctly)
            console.log("Using bookmark position - correct solution word clicked!");
            this.onSolutionFound(word);
            return;
          }

          // FALLBACK: If bookmark position doesn't work, check if it's a position mismatch
          // This happens when alternative examples change tokenization
          console.log("Bookmark position mismatch detected - checking if word exists at expected position");

          // Check if there's actually a word at the bookmark position
          const wordAtBookmarkPosition = this.getWordAtPosition(targetSentenceIndex, targetTokenIndex, contextOffset);
          if (wordAtBookmarkPosition && solutionWords.includes(wordAtBookmarkPosition.toLowerCase())) {
            // The bookmark position points to a different instance of the solution word
            console.log("Different instance of solution word at bookmark position - not accepting click");
            return;
          }

          // The bookmark position is completely wrong (likely due to tokenization change)
          // Fall back to dynamic position finding, but only accept the FIRST occurrence
          console.log("Bookmark position invalid - using fallback to first occurrence");
          const actualSolutionPositions = this.findSolutionPositionsInContext(solutionWords);
          if (actualSolutionPositions.length > 0) {
            const firstOccurrence = actualSolutionPositions[0];
            if (
              adjustedSentIndex === firstOccurrence.sentenceIndex &&
              word.token.token_i === firstOccurrence.tokenIndex
            ) {
              console.log("Fallback: accepting first occurrence of solution");
              this.onSolutionFound(word);
            }
          }
        } else {
          // No position info - accept any word match
          this.onSolutionFound(word);
        }
      }
    }
  }

  // Get clicked words (for exercises)
  getClickedWords() {
    return this.clickedWords.map((click) => click.word);
  }

  // Get clicked word positions (for exercises)
  getClickedWordPositions() {
    return this.clickedWords.map((click) => ({
      sentenceIndex: click.sentenceIndex,
      tokenIndex: click.tokenIndex,
    }));
  }

  // Clear clicked words (for exercise reset)
  clearClickedWords() {
    this.clickedWords = [];
  }

  // Find the actual positions of solution words in the current context
  findSolutionPositionsInContext(solutionWords) {
    const positions = [];

    if (!this.paragraphsAsLinkedWordLists || !this.paragraphsAsLinkedWordLists[0]) {
      return positions;
    }

    const contextOffset = this.expectedPosition?.contextOffset || 0;
    let currentWord = this.paragraphsAsLinkedWordLists[0].linkedWords.head;

    while (currentWord) {
      // Check if this word starts a match for the solution phrase
      if (solutionWords.includes(currentWord.word.toLowerCase())) {
        // Try to match the complete solution phrase starting from this position
        let tempWord = currentWord;
        let matchedWords = [];
        let allMatched = true;

        for (let i = 0; i < solutionWords.length && tempWord; i++) {
          if (tempWord.word.toLowerCase() === solutionWords[i]) {
            matchedWords.push({
              word: tempWord.word,
              sentenceIndex: tempWord.token.sent_i - contextOffset,
              tokenIndex: tempWord.token.token_i,
            });
            tempWord = tempWord.next;
          } else {
            allMatched = false;
            break;
          }
        }

        // If we found a complete match, add all positions
        if (allMatched && matchedWords.length === solutionWords.length) {
          positions.push(...matchedWords);
          // Skip ahead to avoid overlapping matches
          for (let skip = 0; skip < solutionWords.length - 1 && currentWord.next; skip++) {
            currentWord = currentWord.next;
          }
        }
      }
      currentWord = currentWord.next;
    }

    return positions;
  }

  // Get the word at a specific position in the context
  getWordAtPosition(sentenceIndex, tokenIndex, contextOffset = 0) {
    if (!this.paragraphsAsLinkedWordLists || !this.paragraphsAsLinkedWordLists[0]) {
      return null;
    }

    let currentWord = this.paragraphsAsLinkedWordLists[0].linkedWords.head;
    const targetSentenceIndex = sentenceIndex + contextOffset;

    while (currentWord) {
      if (currentWord.token.sent_i === targetSentenceIndex && currentWord.token.token_i === tokenIndex) {
        return currentWord.word;
      }
      currentWord = currentWord.next;
    }

    return null;
  }

  // Check if a word should be highlighted (for solution display)
  shouldHighlightWord(word) {
    if (!this.expectedSolution || !word.token) return false;

    const solutionWords = this.expectedSolution.split(" ").map((w) => w.toLowerCase());
    const wordToCheck = word.word.toLowerCase();

    // First check if the word matches
    if (!solutionWords.includes(wordToCheck)) return false;

    // If we have position info, use the same prioritized logic as click detection
    if (this.expectedPosition) {
      const targetSentenceIndex = this.expectedPosition.sentenceIndex;
      const targetTokenIndex = this.expectedPosition.tokenIndex;
      const contextOffset = this.expectedPosition.contextOffset || 0;
      const adjustedSentIndex = word.token.sent_i - contextOffset;

      // FIRST: Try the original bookmark position (most reliable when correct)
      const solutionWordCount = solutionWords.length;
      const expectedEndToken = targetTokenIndex + solutionWordCount;

      if (
        adjustedSentIndex === targetSentenceIndex &&
        word.token.token_i >= targetTokenIndex &&
        word.token.token_i < expectedEndToken
      ) {
        // Bookmark position is valid - highlight this word
        return true;
      }

      // FALLBACK: Check if bookmark position is invalid due to tokenization change
      const wordAtBookmarkPosition = this.getWordAtPosition(targetSentenceIndex, targetTokenIndex, contextOffset);
      if (wordAtBookmarkPosition && solutionWords.includes(wordAtBookmarkPosition.toLowerCase())) {
        // Bookmark position points to a different instance - don't highlight this word
        return false;
      }

      // Bookmark position is invalid - fall back to first occurrence only
      const actualSolutionPositions = this.findSolutionPositionsInContext(solutionWords);
      if (actualSolutionPositions.length > 0) {
        const firstOccurrence = actualSolutionPositions[0];
        return adjustedSentIndex === firstOccurrence.sentenceIndex && word.token.token_i === firstOccurrence.tokenIndex;
      }

      return false;
    }

    // No position info - highlight any word match
    return true;
  }
}
