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
      console.log("got link to danish speech: " + final_link)
      callback(final_link);
    },
    (error) => {
      console.log(error);
    }
  );
};
