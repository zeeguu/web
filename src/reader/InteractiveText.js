import LinkedWordList from "./LinkedWordListClass";
import ZeeguuSpeech from "../speech/ZeeguuSpeech";

export default class InteractiveText {
  constructor(content, articleInfo, api) {
    this.articleInfo = articleInfo;
    this.api = api;

    //
    this.paragraphs = content.split(/\n\n/);
    this.paragraphsAsLinkedWordLists = this.paragraphs.map(
      (each) => new LinkedWordList(each)
    );

    this.zeeguuSpeech = new ZeeguuSpeech(api, this.articleInfo.language);
  }

  getParagraphs() {
    return this.paragraphsAsLinkedWordLists;
  }

  translate(word, onSucess) {
    // this.history.push(_.cloneDeep(this.paragraphsAsLinkedWordLists));
    let context = this.getContext(word);

    console.log(word);
    word = word.fuseWithNeighborsIfNeeded();

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
        word.translation = data["translations"][0].translation;
        word.service_name = data["translations"][0].service_name;
        onSucess();
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
      .getNextTranslations(
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
        word.alternatives = data.translations.map((each) => each.translation);
        onSuccess();
      });
  }

  pronounce(word) {
    this.zeeguuSpeech.speakOut(word.word);
    this.api.logReaderActivity(this.api.SPEAK_TEXT, this.articleInfo.id);
  }

  getContext(word) {
    function endOfSentenceIn(word) {
      let text = word.word;
      return text[text.length - 1] === ".";
    }
    function getLeftContext(word, count) {
      if (count === 0 || !word || endOfSentenceIn(word)) return "";
      return getLeftContext(word.prev, count - 1) + " " + word.word;
    }

    function getRightContext(word, count) {
      if (count === 0 || !word || endOfSentenceIn(word)) return "";
      return word.word + " " + getRightContext(word.next, count - 1);
    }
    let context =
      getLeftContext(word.prev, 2) +
      " " +
      word.word +
      " " +
      getRightContext(word.next, 2);

    return context;
  }
}
