/*global chrome*/
import SessionStorage from "../assorted/SessionStorage";

const ZeeguuSpeech = class {
  constructor(api, languageCode) {
    this.api = api;
    this.language = languageCode;

    this.pronunciationPlayer = new Audio();
    this.pronunciationPlayer.autoplay = true;
  }

  playFromAPI(word) {
    return new Promise(function (resolve, reject) {
      this.api.getLinkToSpeechFile(word, this.language, (linkToMp3) => {
        this.pronunciationPlayer.src = linkToMp3;
        // TODO: remove this next line after ensuring that it's not needed; we've already initialized
        // the attribute in the constructor
        this.pronunciationPlayer.onerror = reject;
        this.pronunciationPlayer.onended = resolve;
      });
    });
  }

  async speakOut(word, setIsSpeaking) {
    function handleSetIsSpeakingButton(setIsSpeaking, isPlayingSound) {
      if (setIsSpeaking !== undefined) {
        setIsSpeaking(isPlayingSound);
        SessionStorage.setAudioBeingPlayed(isPlayingSound);
      }
    }

    handleSetIsSpeakingButton(setIsSpeaking, true);
    await this.playFromAPI(word);
    handleSetIsSpeakingButton(setIsSpeaking, false);
  }

  playFullArticle(articleInfo, api, player) {
    return new Promise(function (resolve, reject) {
      api.getLinkToFullArticleReadout(
        articleInfo,
        articleInfo.id,
        (linkToMp3) => {
          player.src = linkToMp3;
          player.autoplay = true;
          player.onerror = reject;
          player.onended = resolve;
        },
      );
    });
  }
};

export default ZeeguuSpeech;
