/*global chrome*/
import SessionStorage from "../assorted/SessionStorage";

const ZeeguuSpeech = class {
  constructor(api, languageCode) {
    this.api = api;
    this.language = languageCode;

    this.pronunciationPlayer = new Audio();
    this.pronunciationPlayer.autoplay = true;
  }

  async speakOut(word, setIsSpeaking) {
    function animateSpeechButton(setIsSpeaking, isPlayingSound) {
      if (setIsSpeaking !== undefined) {
        setIsSpeaking(isPlayingSound);
        SessionStorage.setAudioBeingPlayed(isPlayingSound);
      }
    }
    animateSpeechButton(setIsSpeaking, true);
    await this.api
      .fetchLinkToSpeechMp3(word, this.language)
      .then((linkToMp3) => {
        this.pronunciationPlayer.src = linkToMp3;
      })
      .catch(() => {
        // in case anything goes wrong here... we should still deactivate the animation
        animateSpeechButton(setIsSpeaking, false);
      });

    animateSpeechButton(setIsSpeaking, false);
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