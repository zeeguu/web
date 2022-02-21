import LinkedWordList from "./LinkedWordListClass";
import ZeeguuSpeech from "../speech/ZeeguuSpeech";

export default class InteractiveHTML {
  constructor(content, articleInfo, api) {
    this.articleInfo = articleInfo;
    this.api = api;

    this.paragraphs = content.split(/<p><\/p>/)
    this.paragraphsAsLinkedWordLists = this.paragraphs.map(
      (each) => new LinkedWordList(each)
    );

    this.zeeguuSpeech = new ZeeguuSpeech(api, this.articleInfo.language);
  }

  getParagraphs() {
    return this.paragraphsAsLinkedWordLists;
  }

  translate(word, onSuccess) {
    let context = this.getContext(word);

    console.log(word);
    word = word.fuseWithNeighborsIfNeeded(this.api);

    this.api
      .getOneTranslation(
        this.articleInfo.language,
        localStorage.native_language,
        word.word,
        context,
        window.location,
        this.articleInfo.title,
        this.articleInfo.id
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

    this.api.logReaderActivity(this.api.TRANSLATE_TEXT, this.articleInfo.id);
  }

  selectAlternative(word, alternative, onSuccess) {
    this.api.contributeTranslation(
      this.articleInfo.language,
      localStorage.native_language,
      word.word,
      alternative,
      this.getContext(word),
      window.location,
      this.articleInfo.title
    );
    word.translation = alternative;
    word.service_name = "Own alternative selection";

    this.api.logReaderActivity(this.api.SEND_SUGGESTION, this.articleInfo.id);

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
        this.articleInfo.id
      )
      .then((response) => response.json())
      .then((data) => {
        word.alternatives = data.translations;
        onSuccess();
      });
  }

  pronounce(word) {
    this.zeeguuSpeech.speakOut(word.word);
    this.api.logReaderActivity(this.api.SPEAK_TEXT, this.articleInfo.id);
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
      getLeftContext(word.prev, 32) +
      " " +
      word.word +
      " " +
      getRightContext(word.next, 32);

    console.log("context is: " + context);
    return context;
  }
}
