import Speech from "speak-tts";

const ZeeguuSpeech = class {
  constructor(api, language) {
    this.api = api;
    this.language = language;

    console.log("initializing the ZeeguuSpeech object");
    this.speech = new Speech();
    console.log("after Speech() created");
    console.dir(this.speech);

    this.speech
      .init()
      .then((data) => {
        console.log("after speech init()");
        // The "data" object contains the list of available voices and the voice synthesis params
        if (language === "nl") {
          let dutchVoice = _getDutchNetherlandsVoice(data.voices);
          this.speech.setVoice(dutchVoice.name);
        } else {
          let allNames = data.voices.map((e) => e.name);
          let counts = allNames.reduce(
            (acc, val) => acc.set(val, 1 + (acc.get(val) || 0)),
            new Map()
          );
          console.log(counts);
          let uniqueNames = [...counts]
            .filter(([k, v]) => v == 1)
            .map(([k, v]) => k);
          console.log(uniqueNames);

          let target_lang_voices = data.voices.filter(
            (v) =>
              uniqueNames.includes(v.name) &&
              v.lang.toLowerCase().includes(language)
          );

          let randomVoice = _randomElement(target_lang_voices);
          let l =
            "lang: " +
            language +
            " selected: (" +
            randomVoice.name +
            " " +
            randomVoice.lang +
            ") targetLangVoices: " +
            target_lang_voices.map((e) => e.name + " " + e.lang) +
            " allVoices: " +
            data.voices.map((e) => e.name + " " + e.lang);
          console.log(l);
          this.api.logUserActivity("SPEAK VOICES INFO", "", "", l);

          console.log(randomVoice);
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
      console.log("about to play..." + linkToMp3);
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

function _getDutchNetherlandsVoice(voices) {
  let x = _randomElement(voices.filter((v) => v.lang.includes("NL")));
  return x;
}

export default ZeeguuSpeech;
