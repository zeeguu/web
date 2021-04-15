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
      callback(linkToMp3);
    }
  );
};
