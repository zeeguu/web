/*global chrome*/

function voiceForLanguageCode(code, voices) {
  console.log(code);
  console.log(voices);
  console.log(voices.map((e) => e.lang));
  let localeCode = code;
  let preferredLocales = { fr: "fr-FR", nl: "nl-NL", en: "en-US" };
  try {
    localeCode = preferredLocales[code];
  } catch (e) {
    localeCode = code;
  }
  console.log(localeCode);
  let voice = voices.filter((x) => x.lang.startsWith(localeCode))[0];
  console.log(voice);
  return voice;
}

const ZeeguuSpeech = class {
  constructor(api, language) {
    this.api = api;
    this.language = language;
    this.runningFromExtension = true;

    console.log("IN ZEEGUU SPEECH");
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
        console.log("we're running from extension");
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
        return playFromAPI(this.api, word);
      } else {
        var utterance = new SpeechSynthesisUtterance(word);
        utterance.voice = this.voice;
        speechSynthesis.speak(utterance);
      }
    }
  }
};

function playFromAPI(api, word) {
  return new Promise(function (resolve, reject) {
    api.getLinkToDanishSpeech(word, (linkToMp3) => {
      // console.log("about to play..." + linkToMp3);
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

export default ZeeguuSpeech;
