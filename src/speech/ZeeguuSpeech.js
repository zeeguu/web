/*global chrome*/

function voiceForLanguageCode(code, voices) {
  var specificCode = code;

  // console.log(voices.map((e) => e.lang + " " + e.name));

  let preferredLocales = { fr: "fr-FR", nl: "nl-NL", en: "en-US", es: "es-ES" };
  specificCode = preferredLocales[code] ?? code;

  let languageVoices = voices.filter((x) => x.lang.startsWith(specificCode));
  // console.log(languageVoices.map((e) => e.lang + " " + e.name));
  let voice = languageVoices[0];
  // console.log(voice);
  return voice;
}

const ZeeguuSpeech = class {
  constructor(api, language) {
    this.api = api;
    this.language = language;
    this.runningFromExtension = true;
    this.mp3Player = new Audio();
    soundEffect.autoplay = true;

    // onClick of first interaction on page before I need the sounds
    // (This is a tiny MP3 file that is silent and extremely short - retrieved from https://bigsoundbank.com and then modified)
    soundEffect.src =
      "data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";

    if (
      typeof chrome !== "undefined" &&
      typeof chrome.runtime !== "undefined"
    ) {
      try {
        chrome.runtime.sendMessage({
          type: "SPEAK",
          options: {
            text: "",
            language: this.language,
          },
        });
        // console.log("we're running from extension");
      } catch (error) {
        this.runningFromExtension = false;
      }
    } else {
      this.runningFromExtension = false;
    }

    const allVoicesObtained = new Promise(function (resolve, reject) {
      let voices = window.speechSynthesis.getVoices();
      if (voices.length !== 0) {
        resolve(voices);
      } else {
        window.speechSynthesis.addEventListener("voiceschanged", function () {
          voices = window.speechSynthesis.getVoices();
          resolve(voices);
        });
      }
    });

    allVoicesObtained.then(
      (voices) => (this.voice = voiceForLanguageCode(this.language, voices))
    );
  }

  speakOut(word) {
    if (this.runningFromExtension) {
      chrome.runtime.sendMessage({
        type: "SPEAK",
        options: {
          text: word,
          language: this.language,
        },
      });
    } else {
      if (this.language === "da") {
        return this.playFromAPI(this.api, word);
      } else {
        var utterance = new SpeechSynthesisUtterance(word);
        utterance.voice = this.voice;
        speechSynthesis.cancel();
        speechSynthesis.speak(utterance);
      }
    }
  }

  playAll(articleInfo) {
    this.playFullArticle(articleInfo, this.api, this.mp3Player);
  }

  pause() {
    this.mp3Player.pause();
  }

  resume() {
    this.mp3Player.play();
  }

  playFullArticle(articleInfo, api, mp3Player) {
    return new Promise(function (resolve, reject) {
      api.getLinkToFullArticleReadout(
        articleInfo.content,
        articleInfo.id,
        (linkToMp3) => {
          console.log("about to play..." + linkToMp3);
          mp3Player.src = linkToMp3;
          mp3Player.autoplay = true;
          mp3Player.onerror = reject;
          mp3Player.onended = resolve;
        }
      );
    });
  }

  playFromAPI(api, word) {
    return new Promise(function (resolve, reject) {
      api.getLinkToDanishSpeech(word, (linkToMp3) => {
        // console.log("about to play..." + linkToMp3);
        let mp3Player = new Audio();
        mp3Player.src = linkToMp3;
        mp3Player.autoplay = true;
        mp3Player.onerror = reject;
        mp3Player.onended = resolve;
      });
    });
  }
};

export default ZeeguuSpeech;
