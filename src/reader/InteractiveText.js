import LinkedWordList from "./LinkedWordListClass";
import ZeeguuSpeech from "../speech/APIBasedSpeech";

export default class InteractiveText {
  constructor(
    tokenized_paragraphs,
    article_id,
    is_article_content,
    api,
    previousTranslations,
    translationEvent = api.TRANSLATE_TEXT,
    language,
    source = "",
    zeeguuSpeech,
  ) {
    function _updateTranslations(previousTranslations, paragraphs) {
      for (let i = 0; i < previousTranslations.length; i++) {
        let translation = previousTranslations[i];
        let target_p_i, target_s_i, target_t_i;

        let target_token, target_sent;
        if (is_article_content) {
          target_p_i = translation["context_paragraph"];
          target_s_i =
            translation["context_sent"] + translation["t_sentence_i"];
          target_t_i = translation["context_token"] + translation["t_token_i"];
          target_sent = paragraphs[target_p_i][target_s_i];
          target_token = paragraphs[target_p_i][target_s_i][target_t_i];
        } else {
          target_s_i = translation["t_sentence_i"];
          target_t_i = translation["t_token_i"];
          target_sent = paragraphs[0][target_s_i];
          target_token = paragraphs[0][target_s_i][target_t_i];
        }

        target_token.translation = translation;
        // Now we update the sentence to reflect the new token.
        let beforeToken = target_sent.slice(0, target_t_i);
        let afterToken = target_sent.slice(
          target_t_i + translation["t_total_token"],
        );
        target_sent = beforeToken.concat([target_token]).concat(afterToken);
      }
    }
    this.api = api;
    this.article_id = article_id;
    this.language = language;
    this.is_article_content = article_id && is_article_content;
    this.translationEvent = translationEvent;
    this.source = source;
    this.previousTranslatons = previousTranslations.filter(
      (each) =>
        (is_article_content && each.context_paragraph !== null) ||
        (!is_article_content && each.context_paragraph === null),
    );
    console.log(this.previousTranslatons);
    this.paragraphs = tokenized_paragraphs;
    _updateTranslations(this.previousTranslatons, this.paragraphs);
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
    let isItTitle = !this.is_article_content;
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
        isItTitle ? undefined : [cParagraph_i, cSent_i, cToken_i],
        this.article_id,
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
    this.api.updateBookmark(
      word.bookmark_id,
      word.word,
      alternative,
      this.getContextAndStartingIndex(word),
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
    function endOfSentenceIn(word) {
      return word.is_sent_start;
    }

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
        contextBuilder = contextBuilder + " " + currentWord.word;
        if (
          currentWord.is_sent_start &&
          currentWord.sent_i > currentWord.prev.sent_i
        ) {
          break;
        }
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
        word.prev.wordIndexInContent,
      );
    let rightContext = getRightContext(word.next, 32);
    let context = leftContext + word.word + rightContext;
    console.log("DEBUGGING CONTEXT");
    console.log(leftContext);
    console.log(rightContext);
    console.log(context);
    return [
      context,
      this.is_article_content ? paragraph_i : null,
      sent_i,
      token_i,
    ];
  }
}
