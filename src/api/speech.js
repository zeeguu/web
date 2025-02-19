import { Zeeguu_API } from "./classDef";

Zeeguu_API.prototype.fetchLinkToSpeechMp3 = async function (
  textToPronounce,
  language_code,
) {
  let linkToMp3 = await this._post(
    `text_to_speech`,
    `language_id=${language_code}&text=${textToPronounce}`,
  ).then((response) => response.text());

  return this.baseAPIurl + linkToMp3;
};

Zeeguu_API.prototype.getLinkToFullArticleReadout = function (
  article_id,
  callback,
) {
  this._post(
    `mp3_of_full_article`,
    `article_id=${article_id}`,
    (linkToMp3) => {
      let final_link = this.baseAPIurl + linkToMp3;
      console.log("got link to full article readout: " + final_link);
      callback(final_link);
    },
    (error) => {
      console.log(error);
    },
  );
};
