import Speech from "speak-tts";

const ZeeguuSpeech = class {
  constructor(api, language) {
    this.api = api;
    this.language = language;

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
    console.log("speaking out");
    console.log(this.language);
    console.log(_isMobile());
    if (this.language === "da" && !_isMobile()) {
      console.log("about to call the api");
      this.api.getLinkToDanishSpeech(word, (linkToMp3) => {
        return play(this.api.baseAPIurl + linkToMp3);
      });
    } else {
      return this.speech.speak({
        text: word,
        listeners: {
          onend: () => {},
        },
      });
    }
  }
};

function play(url) {
  return new Promise(function (resolve, reject) {
    var mp3Player = new Audio();
    mp3Player.src = url;
    mp3Player.autoplay = true;
    mp3Player.onerror = reject;
    mp3Player.onended = resolve;
  });
}

function _randomElement(x) {
  return x[Math.floor(Math.random() * x.length)];
}

function _getRandomVoice(voices, language) {
  let x = _randomElement(voices.filter((v) => v.lang.includes(language)));
  return x;
}

function _isMobile() {
  // cf: https://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-mobile-device
  return /Mobi|Android/i.test(navigator.userAgent);
}

export default ZeeguuSpeech;
