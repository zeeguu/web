import LinkedWordList from "./LinkedWordListClass";
import ZeeguuSpeech from "../speech/APIBasedSpeech";
import { tokenize } from "../utils/text/preprocessing";
import { removePunctuation } from "../utils/text/preprocessing";
import isNullOrUndefinied from "../utils/misc/isNullOrUndefinied";
import { EXERCISE_TYPES } from "../exercises/ExerciseTypeConstants";

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
    _updateTokensWithBookmarks(this.previousBookmarks, this.paragraphs);
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

    // MWE-aware fusion:
    // - If word is part of an MWE, fuse only with MWE partners (not neighbors)
    // - Otherwise, use normal neighbor fusion
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
    this.zeeguuSpeech.speakOut(word.word);

    this.api.logUserActivity(this.api.SPEAK_TEXT, null, word.word, this.source, this.sourceId);
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

// ============================================================================
// BOOKMARK RESTORATION HELPERS
// ============================================================================

/**
 * Build a map from (sent_i, token_i) -> token info for fast lookup.
 * Needed because sent_i is GLOBAL but paragraphs are nested [para][sent][token].
 */
function _buildTokenMap(paragraphs) {
  const map = new Map();
  for (let p = 0; p < paragraphs.length; p++) {
    for (let s = 0; s < paragraphs[p].length; s++) {
      for (let t = 0; t < paragraphs[p][s].length; t++) {
        const token = paragraphs[p][s][t];
        const key = `${token.sent_i}_${token.token_i}`;
        map.set(key, { paragraph_i: p, sentence_i: s, token });
      }
    }
  }
  return map;
}

/**
 * Find the token for a bookmark using coordinates, with fallback search.
 * Returns { token, sentenceTokens } or null if not found.
 */
function _findTokenForBookmark(bookmark, tokenMap, paragraphs) {
  const target_s_i = bookmark["context_sent"] + bookmark["t_sentence_i"];
  const target_t_i = bookmark["context_token"] + bookmark["t_token_i"];

  if (isNullOrUndefinied(target_s_i) || isNullOrUndefinied(target_t_i)) {
    MWE_DEBUG && console.log("Bookmark skip - null coords:", bookmark["origin"]);
    return null;
  }

  const key = `${target_s_i}_${target_t_i}`;
  const tokenInfo = tokenMap.get(key);

  if (!tokenInfo) {
    MWE_DEBUG && console.log("Bookmark skip - token not found:", bookmark["origin"]);
    return null;
  }

  let { paragraph_i, sentence_i, token: target_token } = tokenInfo;
  const sentenceTokens = paragraphs[paragraph_i][sentence_i];

  // For multi-word bookmarks, verify first word matches; if not, search for it
  const bookmarkWords = tokenize(bookmark["origin"]);
  if (bookmarkWords.length > 1) {
    const firstWord = removePunctuation(bookmarkWords[0]);
    const tokenWord = removePunctuation(target_token.text);
    if (firstWord !== tokenWord) {
      const foundToken = sentenceTokens.find(t => removePunctuation(t.text) === firstWord);
      if (foundToken) {
        target_token = foundToken;
      } else {
        MWE_DEBUG && console.log("Multi-word bookmark - first word not found:", bookmark["origin"]);
        return null;
      }
    }
  }

  return { token: target_token, sentenceTokens };
}

/**
 * Validate MWE bookmark words match the tokens.
 * Returns { isValid, isSeparated, partnerToken } or { isValid: false }.
 */
function _validateMweBookmark(bookmark, targetToken, sentenceTokens) {
  const bookmarkWords = tokenize(bookmark["origin"]);
  const firstWord = bookmarkWords[0];
  const secondWord = bookmarkWords.length > 1 ? bookmarkWords[1] : null;
  const targetWord = removePunctuation(targetToken.text);
  const storedPartnerTokenI = bookmark["mwe_partner_token_i"];

  MWE_DEBUG && console.log("[MWE] Validating:", { origin: bookmark["origin"], firstWord, secondWord, targetWord, storedPartnerTokenI });

  // First word must match
  if (removePunctuation(firstWord).toLowerCase() !== targetWord.toLowerCase()) {
    MWE_DEBUG && console.log("[MWE] First word mismatch, skipping");
    return { isValid: false };
  }

  // Find partner token - try stored index first, then mwe_group_id fallback
  let partnerToken = null;
  let isSeparated = false;

  if (storedPartnerTokenI != null && storedPartnerTokenI !== targetToken.token_i) {
    // Strategy 1: Use stored partner index
    partnerToken = sentenceTokens.find(t => t.token_i === storedPartnerTokenI);
    if (partnerToken && secondWord) {
      const partnerWord = removePunctuation(partnerToken.text).toLowerCase();
      const expectedWord = removePunctuation(secondWord).toLowerCase();
      if (partnerWord !== expectedWord) {
        MWE_DEBUG && console.log("[MWE] Partner word mismatch:", { expected: expectedWord, found: partnerWord });
        return { isValid: false };
      }
      isSeparated = Math.abs(storedPartnerTokenI - targetToken.token_i) > 1;
    }
  } else if (targetToken.mwe_group_id) {
    // Strategy 2: Find partners via mwe_group_id (fallback for older bookmarks)
    const partners = sentenceTokens.filter(t =>
      t !== targetToken && t.mwe_group_id === targetToken.mwe_group_id
    );
    if (partners.length > 0) {
      // Check if contiguous with all partners
      const allIndices = [targetToken.token_i, ...partners.map(p => p.token_i)].sort((a, b) => a - b);
      isSeparated = !allIndices.every((idx, i) => i === 0 || idx - allIndices[i - 1] === 1);
      MWE_DEBUG && console.log("[MWE] Found partners via group_id:", { partners: partners.map(p => p.text), isSeparated });
      // Return all partners for separated MWEs
      return { isValid: true, isSeparated, partnerTokens: partners };
    }
  }

  return { isValid: true, isSeparated, partnerToken };
}

/**
 * Restore a separated MWE - style all partner words, don't fuse.
 * Used when MWE words have other words between them (e.g., "ruft ... an").
 */
function _restoreSeparatedMwe(bookmark, targetToken, partnerTokens) {
  targetToken.bookmark = bookmark;
  targetToken.mergedTokens = [{ ...targetToken, bookmark: null }];
  targetToken.mweExpression = bookmark["origin"];

  // Style all partner tokens - mark them as MWE partners so they get styling
  const partners = Array.isArray(partnerTokens) ? partnerTokens : (partnerTokens ? [partnerTokens] : []);
  for (const partner of partners) {
    partner.mweExpression = bookmark["origin"];
    partner.isMwePartner = true; // Flag for isMWEWord() to detect
  }

  MWE_DEBUG && console.log("[MWE] Separated - styling all:", { target: targetToken.text, partners: partners.map(p => p.text) });
  return true;
}

/**
 * Validate that bookmark words match the tokens at the expected positions.
 * Returns false if the article was re-tokenized and tokens no longer match.
 */
function _validateBookmarkTokens(bookmark, localStartIndex, sentenceTokens) {
  const bookmarkWords = tokenize(bookmark["origin"]);
  let bookmark_i = 0;
  let text_i = 0;

  while (bookmark_i < bookmarkWords.length) {
    const bookmark_word = removePunctuation(bookmarkWords[bookmark_i]);
    if (bookmark_word.length === 0) {
      bookmark_i++;
      continue;
    }

    const tokenIndex = localStartIndex + text_i + bookmark_i;
    if (tokenIndex >= sentenceTokens.length) return false;

    const text_word = removePunctuation(sentenceTokens[tokenIndex].text);
    if (text_word.length === 0 && tokenIndex + 1 < sentenceTokens.length) {
      text_i++;
      continue;
    }
    if (bookmark_word.toLowerCase() !== text_word.toLowerCase()) return false;
    bookmark_i++;
  }

  return true;
}

/**
 * Restore a contiguous (adjacent) bookmark - fuse tokens into one.
 * Works for both MWE and non-MWE multi-word bookmarks.
 */
function _restoreContiguousBookmark(bookmark, targetToken, sentenceTokens) {
  // Find the LOCAL index of targetToken within sentenceTokens array
  // (token_i is GLOBAL but sentenceTokens uses local 0-based indices)
  const localStartIndex = sentenceTokens.findIndex(t => t === targetToken);
  MWE_DEBUG && console.log("[Contiguous] localStartIndex:", localStartIndex, "targetToken:", targetToken.text, "t_total_token:", bookmark["t_total_token"]);
  if (localStartIndex === -1) {
    MWE_DEBUG && console.log("[Contiguous] FAILED - token not found in sentenceTokens");
    return false;
  }

  // Validate bookmark words match tokens (guards against re-tokenized articles)
  if (!_validateBookmarkTokens(bookmark, localStartIndex, sentenceTokens)) {
    MWE_DEBUG && console.log("[Contiguous] FAILED - bookmark words don't match tokens");
    return false;
  }

  // Attach bookmark and merge tokens
  targetToken.bookmark = bookmark;
  targetToken.mergedTokens = [{ ...targetToken, bookmark: null }];

  for (let i = 1; i < bookmark["t_total_token"]; i++) {
    const nextTokenIndex = localStartIndex + i;
    if (nextTokenIndex < sentenceTokens.length) {
      MWE_DEBUG && console.log("[Contiguous] Merging token at index", nextTokenIndex, ":", sentenceTokens[nextTokenIndex].text);
      targetToken.mergedTokens.push({ ...sentenceTokens[nextTokenIndex] });
      sentenceTokens[nextTokenIndex].skipRender = true;
    }
  }
  MWE_DEBUG && console.log("[Contiguous] Done - mergedTokens:", targetToken.mergedTokens.map(t => t.text));
  return true;
}

// ============================================================================
// MAIN BOOKMARK RESTORATION
// ============================================================================

function _updateTokensWithBookmarks(bookmarks, paragraphs) {
  if (!bookmarks) return;

  MWE_DEBUG && console.log("[Bookmark] Starting restoration, bookmarks:", bookmarks?.length, "paragraphs structure:", paragraphs?.length, paragraphs?.[0]?.length, paragraphs?.[0]?.[0]?.length);

  const tokenMap = _buildTokenMap(paragraphs);

  for (const bookmark of bookmarks) {
    MWE_DEBUG && console.log("[Bookmark] Processing:", bookmark["origin"], "is_mwe:", bookmark["is_mwe"], "t_total_token:", bookmark["t_total_token"]);

    const result = _findTokenForBookmark(bookmark, tokenMap, paragraphs);
    if (!result) {
      MWE_DEBUG && console.log("[Bookmark] Token not found for:", bookmark["origin"]);
      continue;
    }

    const { token: targetToken, sentenceTokens } = result;
    MWE_DEBUG && console.log("[Bookmark] Found token:", targetToken.text, "sentenceTokens count:", sentenceTokens.length);

    // Skip if token already has a bookmark
    if (targetToken.bookmark) {
      MWE_DEBUG && console.log("[Bookmark] Token already has bookmark, skipping");
      continue;
    }

    if (bookmark["is_mwe"]) {
      const validation = _validateMweBookmark(bookmark, targetToken, sentenceTokens);
      MWE_DEBUG && console.log("[Bookmark] MWE validation:", validation);
      if (!validation.isValid) continue;

      if (validation.isSeparated) {
        // Use partnerTokens (array) if available, otherwise partnerToken (single)
        const partners = validation.partnerTokens || validation.partnerToken;
        MWE_DEBUG && console.log("[Bookmark] Restoring separated MWE with partners:", partners);
        _restoreSeparatedMwe(bookmark, targetToken, partners);
        continue;
      }
    }

    const success = _restoreContiguousBookmark(bookmark, targetToken, sentenceTokens);
    MWE_DEBUG && console.log("[Bookmark] Contiguous restore result:", success, "mergedTokens:", targetToken.mergedTokens?.length);
  }
}
