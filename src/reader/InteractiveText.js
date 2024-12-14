import LinkedWordList from "./LinkedWordListClass";
import ZeeguuSpeech from "../speech/APIBasedSpeech";

export default class InteractiveText {
  constructor(
    content,
    articleInfo,
    api,
    translationEvent = api.TRANSLATE_TEXT,
    source = "",
    zeeguuSpeech,
  ) {
    this.articleInfo = articleInfo;
    this.api = api;
    this.translationEvent = translationEvent;
    this.source = source;
    //
    this.paragraphs = content.split(/\n\n/);
    this.paragraphsAsLinkedWordLists = this.paragraphs.map(
      (each) => new LinkedWordList(each),
    );
    if (this.articleInfo.language !== zeeguuSpeech.language) {
      this.zeeguuSpeech = new ZeeguuSpeech(api, this.articleInfo.language);
    } else {
      this.zeeguuSpeech = zeeguuSpeech;
    }
  }

  getParagraphs() {
    return this.paragraphsAsLinkedWordLists;
  }

  translate(word, onSuccess) {
    let context = this.getContext(word);

    word = word.fuseWithNeighborsIfNeeded(this.api);

    console.dir(this.api);

    this.api
      .getOneTranslation(
        this.articleInfo.language,
        localStorage.native_language,
        word.word,
        context,
        window.location,
        this.articleInfo.title,
        this.articleInfo.id,
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
      this.articleInfo.id,
      word.word,
      this.source,
    );
  }

  selectAlternative(word, alternative, preferredSource, onSuccess) {
    this.api.updateBookmark(
      word.bookmark_id,
      word.word,
      alternative,
      this.getContext(word),
    );
    word.translation = alternative;
    word.service_name = "Own alternative selection";

    let alternative_info = `${word.translation} => ${alternative} (${preferredSource})`;
    this.api.logReaderActivity(
      this.api.SEND_SUGGESTION,
      this.articleInfo.id,
      alternative_info,
      this.source,
    );

    onSuccess();
  }

  alternativeTranslations(word, onSuccess) {
    let context = this.getContext(word);
    this.api
      .getMultipleTranslations(
        this.articleInfo.language,
        localStorage.native_language,
        word.word,
        context,
        this.articleInfo.url,
        -1,
        word.service_name,
        word.translation,
        this.articleInfo.id,
      )
      .then((response) => response.json())
      .then((data) => {
        word.alternatives = data.translations;
        onSuccess();
      });
  }

  playAll() {
    console.log("playing all");
    this.zeeguuSpeech.playAll(this.articleInfo);
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
  getContext(word) {
    function endOfSentenceIn(word) {
      const endOfSentenceSigns = [".", "?", "!"];
      let text = word.word;

      let lastLetter = text[text.length - 1];

      if (word.next) {
        let startOfNextWord = word.next.word[0];
        let nextWordIsUppercase =
          startOfNextWord === startOfNextWord.toUpperCase();

        return (
          nextWordIsUppercase && endOfSentenceSigns.indexOf(lastLetter) > -1
        );
      } else {
        return endOfSentenceSigns.indexOf(lastLetter) > -1;
      }
    }

    function getLeftContext(word, count) {
      if (count === 0 || !word || endOfSentenceIn(word)) return "";
      return getLeftContext(word.prev, count - 1) + " " + word.word;
    }

    function getRightContext(word, count) {
      if (count === 0 || !word) return "";
      if (endOfSentenceIn(word)) return word.word;
      return word.word + " " + getRightContext(word.next, count - 1);
    }

    let context =
      getLeftContext(word.prev, 32) + " " + getRightContext(word, 32);

    // console.log("context is: " + context);
    return context;
  }
}
