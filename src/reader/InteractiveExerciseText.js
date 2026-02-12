import InteractiveText from "./InteractiveText.js";

// Helper function to normalize strings for comparison
// Handles Greek and other languages with diacritical marks
function normalizeForComparison(str) {
  return str.normalize('NFC').toLowerCase();
}

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
    console.log("=== TRACK WORD CLICK DEBUG ===");
    console.log("Clicked word:", word.word);
    console.log("Expected solution:", this.expectedSolution);
    console.log("Expected position:", this.expectedPosition);
    console.log("Word token info:", word.token);
    
    // Special debugging for "tidligere"
    if (word.word.toLowerCase().includes("tidligere") || (this.expectedSolution && this.expectedSolution.toLowerCase().includes("tidligere"))) {
      console.log("=== SPECIAL DEBUG FOR 'TIDLIGERE' ===");
      console.log("Clicked word full:", word);
      console.log("Expected solution full:", this.expectedSolution);
      console.log("Word matches solution?", word.word.toLowerCase() === this.expectedSolution?.toLowerCase());
      console.log("Solution words array:", this.expectedSolution?.split(" ").map(w => w.toLowerCase()));
    }

    this.clickedWords.push({
      word: word.word,
      sentenceIndex: word.token ? word.token.sent_i : null,
      tokenIndex: word.token ? word.token.token_i : null,
    });

    // Check if this word is part of the expected solution
    if (this.expectedSolution && this.onSolutionFound) {
      const solutionWords = this.expectedSolution.split(" ").map((w) => normalizeForComparison(w));
      const clickedWord = normalizeForComparison(word.word);

      // First check if the word matches any word in the solution
      if (solutionWords.includes(clickedWord)) {
        // Check if we have valid position info
        const hasValidPosition = this.expectedPosition && 
                                 this.expectedPosition.sentenceIndex !== null && 
                                 this.expectedPosition.tokenIndex !== null;
        
        // If we have position info, verify it's the correct instance
        if (hasValidPosition && word.token) {
          const targetSentenceIndex = this.expectedPosition.sentenceIndex;
          const targetTokenIndex = this.expectedPosition.tokenIndex;
          const targetTotalTokens = this.expectedPosition.totalTokens || 1;
          const contextOffset = this.expectedPosition.contextOffset || 0;
          const adjustedSentIndex = word.token.sent_i - contextOffset;

          // FIRST: Try the original bookmark position (most reliable when correct)
          // Note: For multi-word solutions, we should use targetTotalTokens, not solutionWordCount
          const solutionWordCount = solutionWords.length;
          const expectedEndToken = targetTokenIndex + targetTotalTokens; // Use bookmark's total tokens
          
          console.log("Position check debug:");
          console.log("  targetTotalTokens from bookmark:", targetTotalTokens);
          console.log("  solutionWordCount from split:", solutionWordCount);
          console.log("  Using expectedEndToken:", expectedEndToken);

          if (
            adjustedSentIndex === targetSentenceIndex &&
            word.token.token_i >= targetTokenIndex &&
            word.token.token_i < expectedEndToken
          ) {
            // Bookmark position is valid - use it (handles multiple "ikke" correctly)
            console.log("✓ CLICK DETECTION: Using bookmark position - correct solution word clicked!");
            console.log(`  Position: sent_i=${adjustedSentIndex}, token_i=${word.token.token_i} (range: ${targetTokenIndex}-${expectedEndToken-1})`);
            console.log(`  Clicked word "${clickedWord}" is part of multi-word solution "${this.expectedSolution}"`);
            this.onSolutionFound(word);
            return;
          }

          // FALLBACK: If bookmark position doesn't work, check if it's a position mismatch
          // This happens when alternative examples change tokenization
          console.log("Bookmark position mismatch detected - checking if word exists at expected position");

          // Check if there's actually a word at the bookmark position
          const wordAtBookmarkPosition = this.getWordAtPosition(targetSentenceIndex, targetTokenIndex, contextOffset);
          if (wordAtBookmarkPosition && solutionWords.includes(normalizeForComparison(wordAtBookmarkPosition))) {
            // The bookmark position points to a different instance of the solution word
            console.log("✗ CLICK DETECTION: Different instance of solution word at bookmark position - rejecting click");
            console.log(`  Word at bookmark position: "${wordAtBookmarkPosition}" at sent_i=${targetSentenceIndex}, token_i=${targetTokenIndex}`);
            return;
          }

          // The bookmark position is completely wrong (likely due to tokenization change)
          // Fall back to dynamic position finding, but only accept the FIRST complete phrase occurrence
          console.log("⚠ CLICK DETECTION: Bookmark position invalid - using fallback to first phrase occurrence");
          const actualSolutionPositions = this.findSolutionPositionsInContext(solutionWords);
          console.log(`  Found ${actualSolutionPositions.length} solution positions in context:`, actualSolutionPositions);
          if (actualSolutionPositions.length > 0) {
            // Check if the clicked word is part of the first complete phrase occurrence
            const clickedWordMatchesFirstPhrase = actualSolutionPositions.some(pos => 
              adjustedSentIndex === pos.sentenceIndex && word.token.token_i === pos.tokenIndex
            );
            
            if (clickedWordMatchesFirstPhrase) {
              console.log("✓ CLICK DETECTION: Fallback - accepting word as part of first phrase occurrence");
              console.log(`  Clicked word position: sent_i=${adjustedSentIndex}, token_i=${word.token.token_i}`);
              this.onSolutionFound(word);
            } else {
              console.log("✗ CLICK DETECTION: Fallback - clicked word is not part of first phrase occurrence");
              console.log(`  Clicked: sent_i=${adjustedSentIndex}, token_i=${word.token.token_i}`);
              console.log(`  First phrase positions:`, actualSolutionPositions);
            }
          }
        } else if (!hasValidPosition) {
          // No valid position info - fall back to word-based matching
          console.log("⚠ CLICK DETECTION: No valid position data - using word-based matching");
          console.log(`  Clicked word "${clickedWord}" matches solution word`);
          console.log(`  This is likely a user-uploaded word without proper position anchoring`);
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
      if (normalizeForComparison(currentWord.word) === solutionWords[0]) {
        // Try to match the complete solution phrase starting from this position
        let tempWord = currentWord;
        let matchedWords = [];
        let allMatched = true;

        for (let i = 0; i < solutionWords.length && tempWord; i++) {
          if (normalizeForComparison(tempWord.word) === solutionWords[i]) {
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

  // Get the full token object at a specific position in the context
  getTokenAtPosition(sentenceIndex, tokenIndex, contextOffset = 0) {
    if (!this.paragraphsAsLinkedWordLists || !this.paragraphsAsLinkedWordLists[0]) {
      return null;
    }

    let currentWord = this.paragraphsAsLinkedWordLists[0].linkedWords.head;
    const targetSentenceIndex = sentenceIndex + contextOffset;

    while (currentWord) {
      if (currentWord.token.sent_i === targetSentenceIndex && currentWord.token.token_i === tokenIndex) {
        return currentWord.token;
      }
      currentWord = currentWord.next;
    }

    return null;
  }

  // Check if a word should be highlighted (for solution display)
  shouldHighlightWord(word) {
    if (!this.expectedSolution || !word.token) return false;

    const solutionWords = this.expectedSolution.split(" ").map((w) => normalizeForComparison(w));
    const wordToCheck = normalizeForComparison(word.word);

    // First check if the word matches
    if (!solutionWords.includes(wordToCheck)) return false;

    // Check if we have valid position info
    const hasValidPosition = this.expectedPosition &&
                            this.expectedPosition.sentenceIndex !== null &&
                            this.expectedPosition.tokenIndex !== null;

    // If we have position info, use the same prioritized logic as click detection
    if (hasValidPosition) {
      const targetSentenceIndex = this.expectedPosition.sentenceIndex;
      const targetTokenIndex = this.expectedPosition.tokenIndex;
      const contextOffset = this.expectedPosition.contextOffset || 0;
      const adjustedSentIndex = word.token.sent_i - contextOffset;

      // For multi-word expressions, check if this word is in the same MWE group as the target
      if (solutionWords.length > 1 && word.token.mwe_group_id) {
        // Find the token at the bookmark position to get its MWE group
        const targetToken = this.getTokenAtPosition(targetSentenceIndex, targetTokenIndex, contextOffset);
        if (targetToken && targetToken.mwe_group_id === word.token.mwe_group_id) {
          console.log(`✓ HIGHLIGHTING: MWE group match for "${word.word}" (group: ${word.token.mwe_group_id})`);
          return true;
        }
      }

      // FIRST: Try the original bookmark position (most reliable when correct)
      // Use targetTotalTokens from bookmark for multi-word solutions
      const targetTotalTokens = this.expectedPosition.totalTokens || solutionWords.length;
      const expectedEndToken = targetTokenIndex + targetTotalTokens;

      if (
        adjustedSentIndex === targetSentenceIndex &&
        word.token.token_i >= targetTokenIndex &&
        word.token.token_i < expectedEndToken
      ) {
        // Bookmark position is valid - highlight this word
        // Only log for the expected word to reduce noise
        if (solutionWords.includes(wordToCheck)) {
          console.log(`✓ HIGHLIGHTING: Using bookmark position for "${word.word}" at sent_i=${adjustedSentIndex}, token_i=${word.token.token_i}`);
        }
        return true;
      }

      // FALLBACK: Check if bookmark position is invalid due to tokenization change
      const wordAtBookmarkPosition = this.getWordAtPosition(targetSentenceIndex, targetTokenIndex, contextOffset);
      if (wordAtBookmarkPosition && solutionWords.includes(normalizeForComparison(wordAtBookmarkPosition))) {
        // Bookmark position points to a different instance - don't highlight this word
        if (solutionWords.includes(wordToCheck)) {
          console.log(`✗ HIGHLIGHTING: Different instance at bookmark position - not highlighting "${word.word}"`);
          console.log(`  Word at bookmark position: "${wordAtBookmarkPosition}" at sent_i=${targetSentenceIndex}, token_i=${targetTokenIndex}`);
        }
        return false;
      }

      // Bookmark position is invalid - fall back to first phrase occurrence only
      if (solutionWords.includes(wordToCheck)) {
        console.log(`⚠ HIGHLIGHTING: Bookmark position invalid - using fallback for "${word.word}"`);
      }
      const actualSolutionPositions = this.findSolutionPositionsInContext(solutionWords);
      if (actualSolutionPositions.length > 0) {
        // Check if this word is part of the first complete phrase occurrence
        const shouldHighlight = actualSolutionPositions.some(pos => 
          adjustedSentIndex === pos.sentenceIndex && word.token.token_i === pos.tokenIndex
        );
        if (shouldHighlight && solutionWords.includes(wordToCheck)) {
          console.log(`✓ HIGHLIGHTING: Fallback - highlighting "${word.word}" as part of first phrase (sent_i=${adjustedSentIndex}, token_i=${word.token.token_i})`);
        }
        return shouldHighlight;
      }

      return false;
    }

    // No position info - for multi-word solutions, be more careful about highlighting
    // Only highlight if this is likely the first occurrence of the word
    if (solutionWords.length > 1) {
      console.log(`⚠ HIGHLIGHTING: No position data for multi-word solution "${this.expectedSolution}" - using conservative highlighting`);
      
      // For multi-word solutions without position data, try to find the phrase and only highlight it
      const actualSolutionPositions = this.findSolutionPositionsInContext(solutionWords);
      if (actualSolutionPositions.length > 0) {
        const shouldHighlight = actualSolutionPositions.some(pos => {
          const contextOffset = this.expectedPosition?.contextOffset || 0;
          const adjustedSentIndex = word.token.sent_i - contextOffset;
          return adjustedSentIndex === pos.sentenceIndex && word.token.token_i === pos.tokenIndex;
        });
        if (shouldHighlight) {
          console.log(`✓ HIGHLIGHTING: Conservative - highlighting "${word.word}" as part of first phrase occurrence`);
        }
        return shouldHighlight;
      }
      
      // If we can't find the phrase, don't highlight anything to avoid false positives
      console.log(`✗ HIGHLIGHTING: Conservative - cannot find phrase, not highlighting "${word.word}"`);
      return false;
    }
    
    // For single-word solutions without position data, highlight any match
    return true;
  }
}
