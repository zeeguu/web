// eslint-disable-next-line
/*global chrome*/

const ZeeguuSpeech = class {
  constructor(api, languageCode) {
    this.api = api;
    this.language = languageCode;

    this.pronunciationPlayer = new Audio();
    this.pronunciationPlayer.autoplay = true;
    this.isCurrentlySpeaking = false;
    this.lastSetter = null;
  }

  resetClip() {
    this.pronunciationPlayer.currentTime = 0;
  }

  animateSpeechButton(setIsSpeaking, isPlayingSound) {
    if (typeof setIsSpeaking !== "undefined") setIsSpeaking(isPlayingSound);
  }

  stopAudio() {
    this.animateSpeechButton(this.lastSetter, false);
    this.pronunciationPlayer.pause();
    this.isCurrentlySpeaking = false;
  }

  async speakOut(word, setIsSpeaking) {
    if (this.isCurrentlySpeaking) {
      this.stopAudio();
    }
    this.isCurrentlySpeaking = true;
    this.animateSpeechButton(setIsSpeaking, true);
    this.lastSetter = setIsSpeaking;
    await this.api
      .fetchLinkToSpeechMp3(word, this.language)
      .then((linkToMp3) => {
        this.pronunciationPlayer.src = linkToMp3;
        this.pronunciationPlayer.addEventListener("ended", (e) => {
          // Only terminate the animation after playing the sound.
          this.animateSpeechButton(setIsSpeaking, false);
          this.isCurrentlySpeaking = false;
        });

        var promise = this.pronunciationPlayer.play();
        if (promise !== undefined) {
          promise
            .then((_) => {
              // Autoplay started!
            })
            .catch((error) => {
              this.animateSpeechButton(setIsSpeaking, false);
              this.isCurrentlySpeaking = false;
            });
        }
      })
      .catch(() => {
        // in case anything goes wrong here... we should still deactivate the animation
        this.animateSpeechButton(setIsSpeaking, false);
        this.isCurrentlySpeaking = false;
      });
  }

  playFullArticle(article_id, api, player) {
    return new Promise(function (resolve, reject) {
      api.getLinkToFullArticleReadout(article_id, (linkToMp3) => {
        player.src = linkToMp3;
        player.autoplay = true;
        player.onerror = reject;
        player.onended = resolve;
      });
    });
  }
};

export default ZeeguuSpeech;
