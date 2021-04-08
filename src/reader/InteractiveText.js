import LinkedWordList from "./LinkedWordListClass";

import Speech from "speak-tts";

export default class InteractiveText {
  constructor(content, articleInfo, api) {
    this.articleInfo = articleInfo;
    this.api = api;

    //
    this.paragraphs = content.split(/\n\n/);
    this.paragraphsAsLinkedWordLists = this.paragraphs.map(
      (each) => new LinkedWordList(each)
    );

    // speech
    this.speech = new Speech();
    this.speech
      .init()
      .then((data) => {
        // The "data" object contains the list of available voices and the voice synthesis params
        let randomVoice = _getRandomVoice(
          data.voices,
          this.articleInfo.language
        );

        this.speech.setVoice(randomVoice.name);
      })
      .catch((e) => {
        console.error("An error occured while initializing : ", e);
      });

    this.mp3Player = new Audio();
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
        this.articleInfo.title
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
    if (this.articleInfo.language == "da") {
      this.api.getLinkToDanishSpeech(word.word, (linkToMp3) => {
        this.mp3Player.src = this.api.baseAPIurl + linkToMp3;
        this.mp3Player.play();
      });
    } else {
      this.speech.speak({
        text: word.word,
      });
    }
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

function _randomElement(x) {
  return x[Math.floor(Math.random() * x.length)];
}

function _getRandomVoice(voices, language) {
  let x = _randomElement(voices.filter((v) => v.lang.includes(language)));
  return x;
}
