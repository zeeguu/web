import { Zeeguu_API } from "./classDef";

Zeeguu_API.prototype.getLinkToDanishSpeech = function (
  textToPronounce,
  callback
) {
  this._post(
    `text_to_speech`,
    `language_id=da&text=${textToPronounce}`,
    (response) => {
      response.text().then((linkToMp3) => callback(linkToMp3));
    }
  );
};
