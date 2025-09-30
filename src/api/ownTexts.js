import { Zeeguu_API } from "./classDef";
import qs from "qs";

/*
  Example:
  
  api.uploadOwnText("title", "content", 'da', 
    (newID)=>{
        console.log(`article created with id: ${newID}`)
      })

      37 vulnerabilities (2 low, 18 moderate, 14 high, 3 critical)
87 vulnerabilities (11 low, 50 moderate, 25 high, 1 critical)
6 moderate severity vulnerabilities

*/

Zeeguu_API.prototype.uploadOwnText = function (
  title,
  content,
  language,
  onSuccess,
  onError,
  original_cefr_level = null
) {
  let payload = {
    title: title,
    content: content,
    language: language,
  };
  if (original_cefr_level) {
    payload.original_cefr_level = original_cefr_level;
  }
  this._post("upload_own_text", qs.stringify(payload), onSuccess, onError);
};

/*
  Example: 
  
    api.updateOwnText(1407061, "new-title", "new-content", 'da', 
        (result)=>{console.log(result)}) 
*/
Zeeguu_API.prototype.updateOwnText = function (
  id,
  title,
  content,
  language,
  onSuccess
) {
  let payload = {
    title: title,
    content: content,
    language: language,
  };
  this._post(`update_own_text/${id}`, qs.stringify(payload), onSuccess);
};

/*
  Example:

    api.deleteOwnText(1407033, (res) => {
      if (res === "OK") {
        console.log("Article successfully deleted");
      } else {console.log(res)}});
*/
Zeeguu_API.prototype.deleteOwnText = function (id, onSuccess) {
  this._getPlainText(`delete_own_text/${id}`, onSuccess);
};

Zeeguu_API.prototype.getOwnTexts = function (callback) {
  this._getJSON("own_texts", callback);
};

Zeeguu_API.prototype.shareTextWithColleague = function (
  articleID,
  receiverEmail,
  onSuccess,
  onError
) {
  let payload = {
    article_id: articleID,
    email: receiverEmail,
  };
  this._post(
    `send_article_to_colleague`,
    qs.stringify(payload),
    onSuccess,
    onError
  );
};
