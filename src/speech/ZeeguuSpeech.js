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
        if (language === "nl") {
          let dutchVoice = _getDutchNetherlandsVoice(data.voices);
          this.speech.setVoice(dutchVoice.name);
        } else {
          let randomVoice = _getRandomVoice(data.voices, language);
          this.speech.setVoice(randomVoice.name);
        }
      })
      .catch((e) => {
        console.error("An error occured while initializing : ", e);
      });
  }

  speakOut(word) {
    if (this.language === "da") {
      return playFromAPI(this.api, word);
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

function playFromAPI(api, word) {
  return new Promise(function (resolve, reject) {
    api.getLinkToDanishSpeech(word, (linkToMp3) => {
      var mp3Player = new Audio();
      mp3Player.src = linkToMp3;
      mp3Player.autoplay = true;
      mp3Player.onerror = reject;
      mp3Player.onended = resolve;
    });
  });
}

function _randomElement(x) {
  return x[Math.floor(Math.random() * x.length)];
}

function _getRandomVoice(voices, language) {
  let x = _randomElement(voices.filter((v) => v.lang.toLowerCase().includes(language)));
  return x;
}

function _getDutchNetherlandsVoice(voices) {
  let x = _randomElement(voices.filter((v) => v.lang.includes("NL")));
  return x;
}


export default ZeeguuSpeech;
