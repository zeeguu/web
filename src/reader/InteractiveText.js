import LinkedWordList from "./LinkedWordListClass";
import ZeeguuSpeech from "../speech/APIBasedSpeech";

export default class InteractiveText {
  constructor(
    tokenizedParagraphs,
    articleID,
    isArticleContent,
    api,
    previousBookmarks,
    translationEvent = api.TRANSLATE_TEXT,
    language,
    source = "",
    zeeguuSpeech,
  ) {
    function _updateBookmarks(previousBookmarks, paragraphs) {
      console.log(previousBookmarks);
      for (let i = 0; i < previousBookmarks.length; i++) {
        let bookmark = previousBookmarks[i];
        let target_p_i, target_s_i, target_t_i;
        let target_token;

        if (isArticleContent) {
          target_p_i = bookmark["context_paragraph"];
          target_s_i = bookmark["context_sent"] + bookmark["t_sentence_i"];
          target_t_i = bookmark["context_token"] + bookmark["t_token_i"];
          if (target_t_i == null) return;
          target_token = paragraphs[target_p_i][target_s_i][target_t_i];
        } else {
          // Discuss with Mircea
          target_p_i = 0;
          target_s_i = bookmark["t_sentence_i"];
          target_t_i = bookmark["t_token_i"];
          if (target_t_i == null) return;
          target_token = paragraphs[target_p_i][target_s_i][target_t_i];
        }
        if (target_token === undefined) return;
        target_token.bookmark = bookmark;

        /*
          When rendering the words in the frontend, we alter the word object to be composed
          of multiple tokens.
          In case of deleting a bookmark, we need to make sure that all the tokens are 
          available to re-render the original text. 
          To do this, we need to ensure that the stored token is stored without a bookmark,
          so when those are retrieved the token is seen as a token rather than a bookmark. 
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
    this.api = api;
    this.article_id = articleID;
    this.language = language;
    this.isArticleContent = articleID && isArticleContent;
    this.translationEvent = translationEvent;
    this.source = source;

    // Might be worth to store a flag to keep track of wether or not the
    // bookmark / text are part of the content or stand by themselves.
    this.previousBookmarks = previousBookmarks.filter(
      (each) =>
        (isArticleContent && each.in_content) ||
        (!isArticleContent && !each.in_content),
    );
    this.paragraphs = tokenizedParagraphs;
    _updateBookmarks(this.previousBookmarks, this.paragraphs);
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

  translate(word, onSuccess) {
    let context, cParagraph_i, cSent_i, cToken_i;

    [context, cParagraph_i, cSent_i, cToken_i] =
      this.getContextAndStartingIndex(word);
    word = word.fuseWithNeighborsIfNeeded(this.api);
    let wordSent_i = word.sent_i - cSent_i;
    let wordToken_i = word.token_i - cToken_i;

    this.api
      .getOneTranslation(
        this.language,
        localStorage.native_language,
        word.word,
        [wordSent_i, wordToken_i, word.total_tokens],
        context,
        [cParagraph_i, cSent_i, cToken_i],
        this.article_id,
        this.isArticleContent,
      )
      .then((response) => response.json())
      .then((data) => {
        word.translation = data.translation;
        word.service_name = data.service_name;
        word.bookmark_id = data.bookmark_id;
        onSuccess();
      })
      .catch(() => {
        console.log("could not retreive translation");
      });

    this.api.logReaderActivity(
      this.translationEvent,
      this.article_id,
      word.word,
      this.source,
    );
  }

  selectAlternative(word, alternative, preferredSource, onSuccess) {
    let context, pargraph_i, sentence_i, token_i;
    [context, pargraph_i, sentence_i, token_i] =
      this.getContextAndStartingIndex(word);
    this.api.updateBookmark(
      word.bookmark_id,
      word.word,
      alternative,
      context,
      this.isArticleContent,
    );
    word.translation = alternative;
    word.service_name = "Own alternative selection";

    let alternative_info = `${word.translation} => ${alternative} (${preferredSource})`;
    this.api.logReaderActivity(
      this.api.SEND_SUGGESTION,
      this.article_id,
      alternative_info,
      this.source,
    );

    onSuccess();
  }

  alternativeTranslations(word, onSuccess) {
    let context = this.getContextAndStartingIndex(word);
    this.api
      .getMultipleTranslations(
        this.language,
        localStorage.native_language,
        word.word,
        context,
        -1,
        word.service_name,
        word.translation,
        this.article_id,
      )
      .then((response) => response.json())
      .then((data) => {
        word.alternatives = data.translations;
        onSuccess();
      });
  }

  playAll() {
    console.log("playing all");
    this.zeeguuSpeech.playAll(this.article_id);
  }

  pause() {
    console.log("pausing");
    this.zeeguuSpeech.pause();
  }

  resume() {
    console.log("resuming");
    this.zeeguuSpeech.resume();
  }

  pronounce(word) {
    this.zeeguuSpeech.speakOut(word.word);

    this.api.logReaderActivity(
      this.api.SPEAK_TEXT,
      this.articleInfo.id,
      word.word,
      this.source,
    );
  }

  /**
   * Homemade... might not work that well for all languages...
   * - won't catch a sentence that ends with ...
   * might be tricked by I'm going to N.Y. to see my friend.
   */
  getContextAndStartingIndex(word) {
    function getLeftContextAndStartIndex(word, count) {
      let currentWord = word;
      let contextBuilder = "";
      while (count > 0 && currentWord) {
        contextBuilder = currentWord.word + " " + contextBuilder;
        if (currentWord.is_sent_start || currentWord.token_i === 0) {
          break;
        }
        count--;
        currentWord = currentWord.prev;
      }
      return [
        contextBuilder,
        currentWord.paragraph_i,
        currentWord.sent_i,
        currentWord.token_i,
      ];
    }

    function getRightContext(word, count) {
      let currentWord = word;
      let contextBuilder = "";
      while (count > 0 && currentWord) {
        if (
          currentWord.is_sent_start &&
          currentWord.sent_i > currentWord.prev.sent_i
        ) {
          break;
        }
        contextBuilder = contextBuilder + " " + currentWord.word;
        count++;
        currentWord = currentWord.next;
      }
      return contextBuilder;
    }

    let [leftContext, paragraph_i, sent_i, token_i] = [
      "",
      word.paragraph_i,
      word.sent_i,
      word.token_i,
    ];
    if (word.prev)
      [leftContext, paragraph_i, sent_i, token_i] = getLeftContextAndStartIndex(
        word.prev,
        32,
      );
    let rightContext = getRightContext(word.next, 32);
    let context = leftContext + word.word + rightContext;
    console.log("DEBUGGING CONTEXT");
    console.log(leftContext);
    console.log(rightContext);
    console.log(context);
    return [context, paragraph_i, sent_i, token_i];
  }
}
