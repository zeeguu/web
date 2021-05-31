import { Zeeguu_API } from "./classDef";
import queryString from "query-string";

/*
  Example:
  
  api.uploadOwnText("title", "content", 'da', 
    (newID)=>{
        console.log(`article created with id: ${newID}`)
      })
*/

Zeeguu_API.prototype.uploadOwnText = function (
  title,
  content,
  language,
  onSuccess,
  onError
) {
  let payload = {
    title: title,
    content: content,
    language: language,
  };
  this._post(
    "upload_own_text",
    queryString.stringify(payload),
    onSuccess,
    onError
  );
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
  this._post(
    `update_own_text/${id}`,
    queryString.stringify(payload),
    onSuccess
  );
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
  this._get("own_texts", callback);
};
