import { Zeeguu_API } from "./classDef";

Zeeguu_API.prototype.getLinkToDanishSpeech = function (
  textToPronounce,
  callback
) {
  console.log("get link to danish speech...");

  this._post(
    `text_to_speech`,
    `language_id=da&text=${textToPronounce}`,
    (linkToMp3) => {
      let final_link = this.baseAPIurl + linkToMp3;
      console.log("got link to danish speech: " + final_link);
      callback(final_link);
    },
    (error) => {
      console.log(error);
    }
  );
};

Zeeguu_API.prototype.getLinkToFullArticleReadout = function (
  textToPronounce,
  article_id,
  callback
) {
  this._post(
    `mp3_of_full_article`,
    `language_id=da&article+id=${article_id}&text=${textToPronounce}`,
    (linkToMp3) => {
      let final_link = this.baseAPIurl + linkToMp3;
      console.log("got link to full article readout: " + final_link);
      callback(final_link);
    },
    (error) => {
      console.log(error);
    }
  );
};
