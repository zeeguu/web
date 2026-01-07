import LinkedWordList from "./LinkedWordListClass";
import ZeeguuSpeech from "../speech/APIBasedSpeech";
import { EXERCISE_TYPES } from "../exercises/ExerciseTypeConstants";
import { updateTokensWithBookmarks } from "./bookmarkRestoration";

// Set to true to enable verbose MWE/bookmark debugging
const MWE_DEBUG = false;

// We try to capture about a full sentence around a word.
const MAX_WORD_EXPANSION_COUNT = 28;

function isExerciseSource(source) {
  if (!source) return false;
  
  const exerciseTypeValues = Object.values(EXERCISE_TYPES).filter(value => typeof value === 'string');
  return exerciseTypeValues.some(exerciseType => source.includes(exerciseType.split('_')[0]));
}

function tokenShouldSkipCount(word) {
  //   When building context, we do not count for the context limit punctuation,
  // symbols, and numbers.
  return word.token.is_punct || word.token.is_symbol || word.token.is_like_num;
}

export default class InteractiveText {
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
    getBrowsingSessionId = () => null,
    getReadingSessionId = () => null,
  ) {
    this.api = api;
    this.sourceId = sourceId;
    this.language = language;
    this.translationEvent = translationEvent;
    this.source = source;
    this.formatting = formatting;
    this.contextIdentifier = contextIdentifier;
    this.getBrowsingSessionId = getBrowsingSessionId;
    this.getReadingSessionId = getReadingSessionId;

    // Might be worth to store a flag to keep track of wether or not the
    // bookmark / text are part of the content or stand by themselves.
    this.previousBookmarks = previousBookmarks;
    this.paragraphs = tokenizedParagraphs;
    updateTokensWithBookmarks(this.previousBookmarks, this.paragraphs);
    this.paragraphsAsLinkedWordLists = this.paragraphs.map(
      (sent) => new LinkedWordList(sent),
    );
    if (language !== zeeguuSpeech.language) {
      this.zeeguuSpeech = new ZeeguuSpeech(api, language);
    } else {
      this.zeeguuSpeech = zeeguuSpeech;
    }
  }

  getParagraphs() {
    return this.paragraphsAsLinkedWordLists;
  }


  translate(word, fuseWithNeighbours, onSuccess, onFusionComplete = null) {
    let context, cParagraph_i, cSent_i, cToken_i, leftEllipsis, rightEllipsis;

    [context, cParagraph_i, cSent_i, cToken_i, leftEllipsis, rightEllipsis] = this.getContextAndCoordinates(word);

    // MWE-aware fusion: if word is part of an MWE, fuse with partners
    // (disabled MWEs have their metadata cleared by backend, so isMWE() returns false)
    if (word.isMWE && word.isMWE()) {
      word = word.fuseMWEPartners(this.api);
      // If null, MWE partner already has translation - don't create duplicate
      if (word === null) {
        onSuccess();
        return;
      }
      // Trigger re-render after fusion so UI shows fused word immediately
      if (onFusionComplete) onFusionComplete();
    } else if (fuseWithNeighbours) {
      word = word.fuseWithNeighborsIfNeeded(this.api);
    }
    let wordSent_i = word.token.sent_i - cSent_i;
    let wordToken_i = word.token.token_i - cToken_i;

    // Use mweExpression for translation if available (separated MWEs)
    const textToTranslate = word.mweExpression || word.word;
    const isMweExpression = !!word.mweExpression;

    // Check if this is a separated MWE (has gaps between parts)
    // Backend sets mwe_is_separated=true when MWE words aren't contiguous
    const isSeparatedMwe = !!word.token?.mwe_is_separated;

    // Get MWE partner token index (for proper bookmark restoration)
    // mwe_partner_indices is always a single-element array (head -> [dep] or dep -> [head])
    const mwePartnerTokenI = word.token?.mwe_partner_indices?.[0] ?? null;

    // Get full sentence for LLM translation context (only needed for separated MWEs)
    let mweSentence = null;
    if (isSeparatedMwe) {
      mweSentence = this._getSentenceText(word);
    }

    MWE_DEBUG && console.log("MWE translating:", {
      text: textToTranslate,
      isMwe: isMweExpression,
      separated: isSeparatedMwe,
    });

    const browsingSessionId = this.getBrowsingSessionId?.();
    const readingSessionId = this.getReadingSessionId?.();

    this.api
      .getOneTranslation(
        this.language,
        localStorage.native_language,
        textToTranslate,
        [wordSent_i, wordToken_i, word.total_tokens],
        context,
        [cParagraph_i, cSent_i, cToken_i],
        this.sourceId,
        leftEllipsis,
        rightEllipsis,
        this.contextIdentifier,
        this.source === "article_preview"
          ? "article_preview"
          : isExerciseSource(this.source)
          ? "exercise"
          : "reading",
        browsingSessionId,
        readingSessionId,
        isMweExpression,
        isSeparatedMwe,
        mweSentence,
        mwePartnerTokenI,
      )
      .then((response) => response.data)
      .then((data) => {
        word.updateTranslation(data.translation, data.service_name, data.bookmark_id);
        // Mark word's translation as visible so the component renders it
        // This is especially important for MWEs where clicking any word
        // applies translation to the first word
        word.isTranslationVisible = true;

        // Dispatch event for bookmark creation (used by useAnonymousUpgrade)
        window.dispatchEvent(new CustomEvent('zeeguu-bookmark-created'));

        onSuccess();
      })
      .catch((e) => {
        console.error("Translation failed:", e);
      });

    this.api.logUserActivity(this.translationEvent, null, word.word, this.source, this.sourceId);
  }

  selectAlternative(word, alternative, preferredSource, onSuccess) {
    // Simple translation-only update - preserves all position data
    this.api.updateBookmarkTranslation(word.bookmark_id, alternative);
    word.translation = alternative;
    word.service_name = "Own alternative selection";

    let alternative_info = `${word.translation} => ${alternative} (${preferredSource})`;
    this.api.logUserActivity(this.api.SEND_SUGGESTION, null, alternative_info, this.source, this.sourceId);

    onSuccess();
  }

  alternativeTranslations(word, onUpdate, onComplete) {
    let context;
    [context] = this.getContextAndCoordinates(word);
    // Use mweExpression for MWEs (e.g., "har været" instead of just "har")
    const textToTranslate = word.mweExpression || word.word;
    const isSeparatedMwe = !!word.token?.mwe_is_separated;
    // Get full sentence for separated MWEs
    const fullSentenceContext = isSeparatedMwe ? this._getSentenceText(word) : null;

    // Initialize alternatives array for streaming
    word.alternatives = [];

    this.api.getTranslationsStreaming(
      this.language,
      localStorage.native_language,
      textToTranslate,
      context,
      // Called for each translation as it arrives
      (translation) => {
        word.alternatives.push(translation);
        onUpdate && onUpdate();
      },
      // Called when all translations are done
      () => {
        onComplete && onComplete();
      },
      isSeparatedMwe,
      fullSentenceContext,
    );
  }

  playAll() {
    this.zeeguuSpeech.playAll(this.sourceId);
  }

  pause() {
    this.zeeguuSpeech.pause();
  }

  resume() {
    this.zeeguuSpeech.resume();
  }

  pronounce(word, callback) {
    let textToSpeak = word.word;

    // Check for MWE expression - either already set or compute from partners
    if (word.mweExpression) {
      // Already has expression (from fusion or bookmark restoration)
      textToSpeak = word.mweExpression;
    } else if (word.token?.mwe_group_id) {
      // Unfused MWE - compute full expression from partners
      const partners = word.findMWEPartners?.() || [word];
      if (partners.length > 1) {
        // Join words, handling hyphens (no space after hyphen-ending words)
        textToSpeak = partners.reduce((acc, p, i) => {
          if (i === 0) return p.word;
          if (partners[i - 1].word.endsWith("-")) return acc + p.word;
          return acc + " " + p.word;
        }, "");
      }
    }

    this.zeeguuSpeech.speakOut(textToSpeak);
    this.api.logUserActivity(this.api.SPEAK_TEXT, null, textToSpeak, this.source, this.sourceId);
  }

  /**
   * Get the full sentence text containing this word.
   * Used for LLM translation of separated MWEs, which need sentence context.
   */
  _getSentenceText(word) {
    const sentenceIndex = word.token.sent_i;
    const parts = [];

    // Go backwards to start of sentence
    let current = word;
    while (current.prev && current.prev.token.sent_i === sentenceIndex) {
      current = current.prev;
    }

    // Build sentence from start to end
    while (current && current.token.sent_i === sentenceIndex) {
      parts.push(current.word);
      current = current.next;
    }

    return parts.join(" ");
  }

  getContextAndCoordinates(word) {
    function _wordShouldSkipCount(word) {
      //   When building context, we do not count for the context limit punctuation,
      // symbols, and numbers.
      return word.token.is_punct || word.token.is_symbol || word.token.is_like_num;
    }

    function getLeftContextAndStartIndex(word, maxLeftContextLength) {
      let currentWord = word;
      let contextBuilder = "";
      let count = 0;
      while (count < maxLeftContextLength && currentWord.prev && !currentWord.token.is_sent_start) {
        currentWord = currentWord.prev;
        // Don't add space after words ending with hyphen (e.g., "l-" + "a" -> "l-a")
        const addSpace = currentWord.token.has_space && !currentWord.word.endsWith("-");
        contextBuilder = currentWord.word + (addSpace ? " " : "") + contextBuilder;
        count++;
        if (currentWord.token.is_sent_start || currentWord.token.token_i === 0) {
          break;
        }
      }
      return [
        contextBuilder,
        currentWord.token.paragraph_i,
        currentWord.token.sent_i,
        currentWord.token.token_i,
        count > 0,
      ];
    }

    function getRightContext(word, maxRightContextLength) {
      let currentWord = word;
      let contextBuilder = "";
      let hasRightEllipsis = true;
      let count = 0;
      while (count < maxRightContextLength && currentWord) {
        if (currentWord.token.is_sent_start && currentWord.token.sent_i !== currentWord.prev.token.sent_i) {
          break;
        }
        // Don't add space after words ending with hyphen (e.g., "l-" + "a" -> "l-a")
        const addSpace = currentWord.prev.token.has_space && !currentWord.prev.word.endsWith("-");
        contextBuilder = contextBuilder + (addSpace ? " " : "") + currentWord.word;
        count++;
        currentWord = currentWord.next;
      }
      // We have a word, and it's not the start of a sentence.
      hasRightEllipsis = currentWord !== null && !currentWord.token.is_sent_start;
      return [contextBuilder, hasRightEllipsis, count > 0];
    }

    function radialExpansionContext(startingWord) {
      /**
       * Expands the context from the starting word. It adds words by alternating between
       * left and right until we reach a start/end of sentence or run out of budget.
       *
       * We do this to avoid situations where the user might click a final word in an
       * exercise and we end up creating a new BookmarkContext + Text pair.
       *
       * I reused the methods we had defined for left and right, though here they are
       * exclusively used to expand 1 token to left and right.
       */

      let [leftContext, paragraph_i, sent_i, token_i] = [
        "",
        startingWord.token.paragraph_i,
        startingWord.token.sent_i,
        startingWord.token.token_i,
      ];

      let budget = MAX_WORD_EXPANSION_COUNT;
      let leftEllipsis;
      let rightContext, rightEllipsis;
      let leftWord = startingWord;
      let rightWord = startingWord.next;
      let context = startingWord.word;

      while (budget > 0) {
        let rightUpdated = false;
        let leftUpdated = false;

        [leftContext, paragraph_i, sent_i, token_i, leftUpdated] = getLeftContextAndStartIndex(leftWord, 1);
        if (leftUpdated && !tokenShouldSkipCount(leftWord)) budget -= 1;
        context = leftContext + context;

        if (budget > 0 && rightWord) {
          [rightContext, rightEllipsis, rightUpdated] = getRightContext(rightWord, 1);
          if (rightUpdated && !tokenShouldSkipCount(rightWord)) budget -= 1;
          context += rightContext;
        }

        // We have captured the sentence in its entirety.
        if (!rightUpdated && !leftUpdated) break;

        // If we update one of the sides, we keep going.
        if (leftUpdated) leftWord = leftWord.prev;
        if (rightUpdated) rightWord = rightWord.next;
      }

      // If we are not at the start of the sentence, we need leftEllipsis.
      leftEllipsis = token_i !== 0;

      return [context, paragraph_i, sent_i, token_i, leftEllipsis, rightEllipsis];
    }

    return radialExpansionContext(word);
  }
}
