/*global chrome*/
import SessionStorage from "../assorted/SessionStorage";

const PREFERRED_LOCALES = {
  fr: "fr-FR",
  nl: "nl-NL",
  en: "en-US",
  es: "es-ES",
};
const PREFERRED_VOICE_NAMES = { fr: ["Google", "Thomas", "Audrey", "Aurelie"] };

function voiceForLanguageCode(code, voices) {
  let specificCode = PREFERRED_LOCALES[code] ?? code;

  let languageVoices = voices.filter((x) => x.lang.startsWith(specificCode));

  let preferredVoiceNames = PREFERRED_VOICE_NAMES[code] || [];

  for (let i = 0; i < preferredVoiceNames.length; i++) {
    let preferredName = preferredVoiceNames[i];
    let favoriteVoices = languageVoices.filter((x) =>
      x.name.startsWith(preferredName),
    );

    if (favoriteVoices.length > 0) {
      let voice = favoriteVoices[0];
      console.log("Found preferred voice: " + voice.name + " " + voice.lang);
      return voice;
    }
  }

  let voice = languageVoices[0];
  if (voice)
    console.log("Found default voice: " + voice.name + " " + voice.lang);
  return voice;
}

const DeprecatedZeeguuSpeech = class {
  constructor(api, language) {
    console.log("Creating Speech Object!");
    this.api = api;
    this.language = language;
    this.runningFromExtension = true;

    this.pronunciationPlayer = new Audio();
    this.pronunciationPlayer.autoplay = true;

    // onClick of first interaction on page before I need the sounds
    // (This is a tiny MP3 file that is silent and extremely short - retrieved from https://bigsoundbank.com and then modified)
    const SHORT_SILENT_MP3 =
      "data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";
    this.pronunciationPlayer.src = SHORT_SILENT_MP3;

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
      (voices) => (this.voice = voiceForLanguageCode(this.language, voices)),
    );
  }

  async speakOut(word, setIsSpeaking) {
    function handleSetIsSpeakingButton(setIsSpeaking, isPlayingSound) {
      if (setIsSpeaking !== undefined) {
        setIsSpeaking(isPlayingSound);
        SessionStorage.setAudioBeingPlayed(isPlayingSound);
      }
    }

    handleSetIsSpeakingButton(setIsSpeaking, true);

    // For Danish, we always use the Google Speech API generated sound
    if (this.language === "da") {
      await this._playFromAPI(this.api, word, this.pronunciationPlayer);
      handleSetIsSpeakingButton(setIsSpeaking, false);
    } else {
      // For other languages
      // 1. If we are running from the extension, we send a message to the background script to play the sound
      if (this.runningFromExtension) {
        chrome.runtime.sendMessage({
          type: "SPEAK",
          options: {
            text: word,
            language: this.language,
          },
        });
        handleSetIsSpeakingButton(setIsSpeaking, false);
      } else {
        // 2. If we are not running from the extension, we use the browser's built-in speech synthesis
        var utterance = new SpeechSynthesisUtterance(word);
        utterance.voice = this.voice;
        utterance.addEventListener("end", (event) => {
          console.log(
            `Utterance has finished being spoken after ${event.elapsedTime} seconds.`,
          );
          handleSetIsSpeakingButton(setIsSpeaking, false);
        });
        speechSynthesis.speak(utterance);
      }
    }
  }

  playFullArticle(articleInfo, api, player) {
    return new Promise(function (resolve, reject) {
      api.getLinkToFullArticleReadout(
        articleInfo,
        articleInfo.id,
        (linkToMp3) => {
          console.log("about to play..." + linkToMp3);
          player.src = linkToMp3;
          player.autoplay = true;
          player.onerror = reject;
          player.onended = resolve;
        },
      );
    });
  }

  _playFromAPI(api, word, player) {
    return new Promise(function (resolve, reject) {
      api.getLinkToDanishSpeech(word, (linkToMp3) => {
        player.src = linkToMp3;
        player.autoplay = true;
        player.onerror = reject;
        player.onended = resolve;
      });
    });
  }
};

export default DeprecatedZeeguuSpeech;
