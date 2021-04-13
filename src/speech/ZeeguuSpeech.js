import Speech from "speak-tts";

const ZeeguuSpeech = class {
  constructor(api, language) {
    this.api = api;

    this.mp3Player = new Audio();

    this.speech = new Speech();
    this.speech
      .init()
      .then((data) => {
        // The "data" object contains the list of available voices and the voice synthesis params
        let randomVoice = _getRandomVoice(data.voices, language);

        this.speech.setVoice(randomVoice.name);
      })
      .catch((e) => {
        console.error("An error occured while initializing : ", e);
      });
  }

  speakOut(word) {
    if (this.language == "da" && !_isMobile()) {
      this.api.getLinkToDanishSpeech(word, (linkToMp3) => {
        this.mp3Player.src = this.api.baseAPIurl + linkToMp3;
        this.mp3Player.play();
      });
    } else {
      this.speech.speak({
        text: word,
      });
    }
  }
};

function _randomElement(x) {
  return x[Math.floor(Math.random() * x.length)];
}

function _getRandomVoice(voices, language) {
  let x = _randomElement(voices.filter((v) => v.lang.includes(language)));
  return x;
}

function _isMobile() {
  try {
    document.createEvent("TouchEvent");
    return true;
  } catch (e) {
    return false;
  }
}

export default ZeeguuSpeech;
