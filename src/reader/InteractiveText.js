import LinkedWordList from "./LinkedWordListClass";
import ZeeguuSpeech from "../speech/APIBasedSpeech";
import { tokenize } from "../utils/text/preprocessing";
import { removePunctuation } from "../utils/text/preprocessing";
import isNullOrUndefinied from "../utils/misc/isNullOrUndefinied";

// We try to capture about a full sentence around a word.
const MAX_WORD_EXPANSION_COUNT = 28;

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
  ) {
    // beginning of the constructor
    this.api = api;
    this.sourceId = sourceId;
    this.language = language;
    this.translationEvent = translationEvent;
    this.source = source;
    this.formatting = formatting;
    this.contextIdentifier = contextIdentifier;

    // Might be worth to store a flag to keep track of wether or not the
    // bookmark / text are part of the content or stand by themselves.
    this.previousBookmarks = previousBookmarks;
    this.paragraphs = tokenizedParagraphs;
    _updateTokensWithBookmarks(this.previousBookmarks, this.paragraphs);
    this.paragraphsAsLinkedWordLists = this.paragraphs.map((sent) => new LinkedWordList(sent));
    this.clickedWords = []; // Track clicked words and their positions
    if (language !== zeeguuSpeech.language) {
      this.zeeguuSpeech = new ZeeguuSpeech(api, language);
    } else {
      this.zeeguuSpeech = zeeguuSpeech;
    }
  }

  getParagraphs() {
    return this.paragraphsAsLinkedWordLists;
  }

  // Track a clicked word for exercises
  trackWordClick(word) {
    this.clickedWords.push({
      word: word.word,
      sentenceIndex: word.token ? word.token.sent_i : null,
      tokenIndex: word.token ? word.token.token_i : null
    });
  }

  // Get clicked words (for exercises)
  getClickedWords() {
    return this.clickedWords.map(click => click.word);
  }

  // Get clicked word positions (for exercises)
  getClickedWordPositions() {
    return this.clickedWords.map(click => ({
      sentenceIndex: click.sentenceIndex,
      tokenIndex: click.tokenIndex
    }));
  }

  // Clear clicked words (for exercise reset)
  clearClickedWords() {
    this.clickedWords = [];
  }

  translate(word, fuseWithNeighbours, onSuccess) {
    let context, cParagraph_i, cSent_i, cToken_i, leftEllipsis, rightEllipsis;

    [context, cParagraph_i, cSent_i, cToken_i, leftEllipsis, rightEllipsis] = this.getContextAndCoordinates(word);
    if (fuseWithNeighbours) word = word.fuseWithNeighborsIfNeeded(this.api);
    let wordSent_i = word.token.sent_i - cSent_i;
    let wordToken_i = word.token.token_i - cToken_i;
    console.log(word);
    this.api
      .getOneTranslation(
        this.language,
        localStorage.native_language,
        word.word,
        [wordSent_i, wordToken_i, word.total_tokens],
        context,
        [cParagraph_i, cSent_i, cToken_i],
        this.sourceId,
        leftEllipsis,
        rightEllipsis,
        this.contextIdentifier,
      )
      .then((response) => response.data)
      .then((data) => {
        word.updateTranslation(data.translation, data.service_name, data.bookmark_id);
        onSuccess();
      })
      .catch((e) => {
        console.error(e);
        console.log("could not retreive translation");
      });

    this.api.logUserActivity(this.translationEvent, null, word.word, this.source, this.sourceId);
  }

  selectAlternative(word, alternative, preferredSource, onSuccess) {
    let context;
    [context] = this.getContextAndCoordinates(word);
    this.api.updateBookmark(word.bookmark_id, word.word, alternative, context, this.contextIdentifier);
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
  function areCoordinatesInParagraphMatrix(target_s_i, target_t_i, paragraphs) {
    // This can happen when we update the tokenizer, but do not update the bookmarks.
    // They might become misaligned and point to a non existing token.
    return target_s_i < paragraphs[0].length && target_t_i < paragraphs[0][target_s_i].length;
  }

  if (!bookmarks) return;

  for (let i = 0; i < bookmarks.length; i++) {
    let bookmark = bookmarks[i];
    let target_p_i, target_s_i, target_t_i;
    let target_token;
    target_p_i = 0;
    target_s_i = bookmark["context_sent"] + bookmark["t_sentence_i"];
    target_t_i = bookmark["context_token"] + bookmark["t_token_i"];

    // If any the coordinates are null / undefined, we skip.

    if (
      isNullOrUndefinied(target_s_i) ||
      isNullOrUndefinied(target_t_i) ||
      !areCoordinatesInParagraphMatrix(target_s_i, target_t_i, paragraphs)
    ) {
      continue;
    }

    target_token = paragraphs[target_p_i][target_s_i][target_t_i];

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
    let bookmarkTokensSimplified = tokenize(bookmark["origin"]);
    // Text and Bookmark will have different tokenization.
    let bookmark_i = 0;
    let text_i = 0;
    let shouldSkipBookmarkUpdate = false;
    while (bookmark_i < bookmarkTokensSimplified.length) {
      let bookmark_word = removePunctuation(bookmarkTokensSimplified[bookmark_i]);
      // If token is empty, due to removing punctuation, skip.
      if (bookmark_word.length === 0) {
        bookmark_i++;
        continue;
      }
      let text_word = removePunctuation(paragraphs[target_p_i][target_s_i][target_t_i + text_i + bookmark_i].text);
      // If text is empty and there is more text in the sentence, we update the
      // text pointer.
      if (text_word.length === 0 && target_t_i + text_i + bookmark_i + 1 < paragraphs[target_p_i][target_s_i].length) {
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
      target_token.mergedTokens.push({
        ...paragraphs[target_p_i][target_s_i][target_t_i + i],
      });
      paragraphs[target_p_i][target_s_i][target_t_i + i].skipRender = true;
    }
  }
}
