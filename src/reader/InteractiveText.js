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
    // beginning of the constructor
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
    this.paragraphsAsLinkedWordLists = this.paragraphs.map((sent) => new LinkedWordList(sent));
    if (language !== zeeguuSpeech.language) {
      this.zeeguuSpeech = new ZeeguuSpeech(api, language);
    } else {
      this.zeeguuSpeech = zeeguuSpeech;
    }
  }

  getParagraphs() {
    return this.paragraphsAsLinkedWordLists;
  }


  translate(word, fuseWithNeighbours, onSuccess) {
    console.log(`[INTERACTIVE-TEXT] translate() called`, {
      timestamp: new Date().toISOString(),
      word: word.word,
      fuseWithNeighbours,
      source: this.source,
      sourceId: this.sourceId,
      isMWE: word.isMWE?.() || false,
      mweGroupId: word.token?.mwe_group_id
    });

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

    // Debug: log context identifier to help diagnose bookmark saving issues
    console.log(`[TRANSLATION-DEBUG] contextIdentifier:`, {
      contextIdentifier: this.contextIdentifier,
      source: this.source,
      word: word.word,
    });

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
      .then((response) => {
        console.log(`[INTERACTIVE-TEXT] Translation response received`, { timestamp: new Date().toISOString(), word: word.word });
        return response.data;
      })
      .then((data) => {
        console.log(`[INTERACTIVE-TEXT] Translation data processed`, { timestamp: new Date().toISOString(), word: word.word, translation: data.translation });
        word.updateTranslation(data.translation, data.service_name, data.bookmark_id);
        // Mark word's translation as visible so the component renders it
        // This is especially important for MWEs where clicking any word
        // applies translation to the first word
        word.isTranslationVisible = true;
        onSuccess();
      })
      .catch((e) => {
        console.error(`[INTERACTIVE-TEXT] Translation ERROR`, { timestamp: new Date().toISOString(), word: word.word, error: e.message, code: e.code });
        console.error(e);
        console.log("could not retreive translation");
      });

    this.api.logUserActivity(this.translationEvent, null, word.word, this.source, this.sourceId);
  }

  selectAlternative(word, alternative, preferredSource, onSuccess) {
    let context;
    [context] = this.getContextAndCoordinates(word);
    // Use mweExpression for MWE bookmarks, otherwise use word.word
    const originText = word.mweExpression || word.word;
    this.api.updateBookmark(word.bookmark_id, originText, alternative, context, this.contextIdentifier);
    word.translation = alternative;
    word.service_name = "Own alternative selection";

    let alternative_info = `${word.translation} => ${alternative} (${preferredSource})`;
    this.api.logUserActivity(this.api.SEND_SUGGESTION, null, alternative_info, this.source, this.sourceId);

    onSuccess();
  }

  alternativeTranslations(word, onSuccess) {
    let context;
    [context] = this.getContextAndCoordinates(word);
    this.api
      .getMultipleTranslations(
        this.language,
        localStorage.native_language,
        word.word,
        context,
        -1,
        word.service_name,
        word.translation,
        this.sourceId,
      )
      .then((response) => response.json())
      .then((data) => {
        word.alternatives = data.translations;
        onSuccess();
      });
  }

  playAll() {
    console.log("playing all");
    this.zeeguuSpeech.playAll(this.sourceId);
  }

  pause() {
    console.log("pausing");
    this.zeeguuSpeech.pause();
  }

  resume() {
    console.log("resuming");
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
        contextBuilder = currentWord.word + (currentWord.token.has_space ? " " : "") + contextBuilder;
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
        contextBuilder = contextBuilder + (currentWord.prev.token.has_space ? " " : "") + currentWord.word;
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

      console.log("Budget: ", budget);
      console.log("Final context: ", context, "(", context.split(" ").length, " words)");
      console.log(paragraph_i, sent_i, token_i, leftEllipsis, rightEllipsis);

      return [context, paragraph_i, sent_i, token_i, leftEllipsis, rightEllipsis];
    }

    return radialExpansionContext(word);
  }
}

function _updateTokensWithBookmarks(bookmarks, paragraphs) {
  // Build a map of (sent_i, token_i) -> {paragraph_i, sentence_i_in_paragraph, token}
  // This is needed because sent_i is GLOBAL across paragraphs, but the structure
  // is paragraphs[paragraph_i][sentence_i_within_paragraph][token_i]
  function buildTokenMap(paragraphs) {
    const map = new Map();
    for (let p = 0; p < paragraphs.length; p++) {
      for (let s = 0; s < paragraphs[p].length; s++) {
        for (let t = 0; t < paragraphs[p][s].length; t++) {
          const token = paragraphs[p][s][t];
          // sent_i is global, token_i is per-sentence
          const key = `${token.sent_i}_${token.token_i}`;
          map.set(key, { paragraph_i: p, sentence_i: s, token });
        }
      }
    }
    return map;
  }

  if (!bookmarks) return;

  const tokenMap = buildTokenMap(paragraphs);

  for (let i = 0; i < bookmarks.length; i++) {
    let bookmark = bookmarks[i];
    // target_s_i and target_t_i are GLOBAL coordinates
    let target_s_i = bookmark["context_sent"] + bookmark["t_sentence_i"];
    let target_t_i = bookmark["context_token"] + bookmark["t_token_i"];

    // If any the coordinates are null / undefined, we skip.
    if (isNullOrUndefinied(target_s_i) || isNullOrUndefinied(target_t_i)) {
      MWE_DEBUG && console.log("Bookmark skip - null coords:", bookmark["origin"]);
      continue;
    }

    // Look up the token using global coordinates
    const key = `${target_s_i}_${target_t_i}`;
    const tokenInfo = tokenMap.get(key);

    if (!tokenInfo) {
      MWE_DEBUG && console.log("Bookmark skip - token not found:", bookmark["origin"]);
      continue;
    }

    let { paragraph_i, sentence_i, token: target_token } = tokenInfo;

    // For multi-word bookmarks, verify the token matches the first word
    // If not, try to find the correct token by searching for the first word
    const bookmarkWords = tokenize(bookmark["origin"]);
    if (bookmarkWords.length > 1) {
      const firstWord = removePunctuation(bookmarkWords[0]);
      const tokenWord = removePunctuation(target_token.text);
      if (firstWord !== tokenWord) {
        // Search for the first word in the same sentence
        let foundToken = null;
        for (let t = 0; t < paragraphs[paragraph_i][sentence_i].length; t++) {
          const token = paragraphs[paragraph_i][sentence_i][t];
          if (removePunctuation(token.text) === firstWord) {
            foundToken = token;
            break;
          }
        }
        if (foundToken) {
          target_token = foundToken;
        } else {
          MWE_DEBUG && console.log("Multi-word bookmark - first word not found:", bookmark["origin"]);
          continue;
        }
      }
    }

    /**
     * Before we update the target token we want to check two cases:
     * 1. The bookmark isn't defined.
     * If the bookmark is defined it means a bookmark is trying to override another
     * previous bookmark.
     * 2. The bookmark text, doesn't match the token.
     * In this case, we might have an error in the coordinates, and for that reason
     * we don't update the original text.
     */

    if (target_token.bookmark) {
      continue;
    }

    // For MWE bookmarks, the tokens aren't consecutive in the text.
    // We need to fuse them visually and hide partner tokens.
    if (bookmark["is_mwe"]) {
      // For MWE: just verify the first word matches and apply bookmark
      let firstWord = tokenize(bookmark["origin"])[0];
      let targetWord = removePunctuation(target_token.text);
      if (removePunctuation(firstWord) === targetWord) {
        target_token.bookmark = bookmark;
        target_token.mergedTokens = [{ ...target_token, bookmark: null }];

        const targetTokenI = target_token.token_i;
        const sentenceTokens = paragraphs[paragraph_i][sentence_i];
        const storedPartnerTokenI = bookmark["mwe_partner_token_i"];

        // Use stored partner token index if available (proper fix)
        // Otherwise fall back to mwe_group_id matching (for older bookmarks)
        if (storedPartnerTokenI != null) {
          // Find partner by stored index
          const partnerToken = sentenceTokens.find(t => t.token_i === storedPartnerTokenI);
          if (partnerToken) {
            const gap = Math.abs(storedPartnerTokenI - targetTokenI);
            // Only fuse if directly adjacent (gap = 1)
            if (gap === 1) {
              // Sort tokens by position for consistent text
              const tokens = [target_token, partnerToken].sort((a, b) => a.token_i - b.token_i);
              target_token.text = tokens.map(t => t.text).join(" ");
              partnerToken.skipRender = true;
              target_token.mergedTokens.push({ ...partnerToken, bookmark: null });
            }
            // Separated MWEs stay in their original positions (no visual fusion)
          }
        } else if (target_token.mwe_group_id && target_token.mwe_is_separated === false) {
          // Fallback: use mwe_group_id matching (for older bookmarks without stored partner)
          const mweGroupId = target_token.mwe_group_id;
          const allAdjacentPartners = [{ token: target_token, tokenI: targetTokenI }];
          for (let t = 0; t < sentenceTokens.length; t++) {
            const token = sentenceTokens[t];
            if (token !== target_token && token.mwe_group_id === mweGroupId) {
              const gap = Math.abs(token.token_i - targetTokenI);
              if (gap === 1) {
                allAdjacentPartners.push({ token, tokenI: token.token_i });
              }
            }
          }
          allAdjacentPartners.sort((a, b) => a.tokenI - b.tokenI);
          if (allAdjacentPartners.length > 1) {
            const adjacentPartnerTexts = [];
            for (const { token } of allAdjacentPartners) {
              adjacentPartnerTexts.push(token.text);
              if (token !== target_token) {
                token.skipRender = true;
                target_token.mergedTokens.push({ ...token, bookmark: null });
              }
            }
            target_token.text = adjacentPartnerTexts.join(" ");
          }
        }
        MWE_DEBUG && console.log("MWE bookmark applied:", target_token.text);
      }
      continue;
    }

    let bookmarkTokensSimplified = tokenize(bookmark["origin"]);
    // Text and Bookmark will have different tokenization.
    let bookmark_i = 0;
    let text_i = 0;
    let shouldSkipBookmarkUpdate = false;

    // Get the token index within the sentence (not global)
    const token_i_in_sentence = target_token.token_i;
    const sentenceTokens = paragraphs[paragraph_i][sentence_i];

    while (bookmark_i < bookmarkTokensSimplified.length) {
      let bookmark_word = removePunctuation(bookmarkTokensSimplified[bookmark_i]);
      // If token is empty, due to removing punctuation, skip.
      if (bookmark_word.length === 0) {
        bookmark_i++;
        continue;
      }

      const tokenIndex = token_i_in_sentence + text_i + bookmark_i;
      if (tokenIndex >= sentenceTokens.length) {
        shouldSkipBookmarkUpdate = true;
        break;
      }

      let text_word = removePunctuation(sentenceTokens[tokenIndex].text);
      // If text is empty and there is more text in the sentence, we update the
      // text pointer.
      if (text_word.length === 0 && tokenIndex + 1 < sentenceTokens.length) {
        text_i++;
        continue;
      }
      // If the tokens don't match, we break and skip this bookmark.

      if (bookmark_word !== text_word) {
        shouldSkipBookmarkUpdate = true;
        break;
      }
      bookmark_i++;
    }
    if (shouldSkipBookmarkUpdate) {
      continue;
    }
    // Because we are trying to find the tokens, we might skip some tokens that
    // weren't included in the original bookmark. E.g. This, is a -> 4 tokens not 3.
    if (bookmark.t_total_token < text_i + bookmark_i) bookmark.total_tokens = text_i + bookmark_i;
    target_token.bookmark = bookmark;

    /**
     * When rendering the words in the frontend, we alter the word object to be composed
     * of multiple tokens.
     * In case of deleting a bookmark, we need to make sure that all the tokens are
     * available to re-render the original text.
     * To do this, we need to ensure that the stored token is stored without a bookmark,
     * so when those are retrieved the token is seen as a token rather than a bookmark.
     */
    target_token.mergedTokens = [{ ...target_token, bookmark: null }];
    for (let i = 1; i < bookmark["t_total_token"]; i++) {
      const nextTokenIndex = token_i_in_sentence + i;
      if (nextTokenIndex < sentenceTokens.length) {
        target_token.mergedTokens.push({
          ...sentenceTokens[nextTokenIndex],
        });
        sentenceTokens[nextTokenIndex].skipRender = true;
      }
    }
  }
}
