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
  cefr_level = null,
  assessment_method = null,
  img_url = null,
  htmlContent = null
) {
  let payload = {
    title: title,
    content: content,
    language: language,
  };
  if (cefr_level) {
    payload.cefr_level = cefr_level;
  }
  if (assessment_method) {
    payload.assessment_method = assessment_method;
  }
  if (img_url) {
    payload.img_url = img_url;
  }
  if (htmlContent) {
    payload.htmlContent = htmlContent;
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
  onSuccess,
  htmlContent = null,
  cefr_level = null,
  assessment_method = null
) {
  let payload = {
    title: title,
    content: content,
    language: language,
  };
  if (htmlContent) {
    payload.htmlContent = htmlContent;
  }
  if (cefr_level) {
    payload.cefr_level = cefr_level;
  }
  if (assessment_method) {
    payload.assessment_method = assessment_method;
  }
  this._post(`update_own_text/${id}`, qs.stringify(payload), onSuccess);
};

/*
  Example:

    api.deleteOwnText(1407033, (res) => {
      if (res.success) {
        console.log(res.message); // "Article permanently deleted" or "Article hidden..."
      } else {
        console.log(res.message);
      }
    });
*/
Zeeguu_API.prototype.deleteOwnText = function (id, onSuccess) {
  this._getJSON(`delete_own_text/${id}`, onSuccess);
};

Zeeguu_API.prototype.getOwnTexts = function (callback) {
  this._getJSON("own_texts", callback);
};

Zeeguu_API.prototype.estimateArticleCEFR = function (
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
  this._post("estimate_article_cefr", qs.stringify(payload), (response) => {
    try {
      onSuccess(JSON.parse(response));
    } catch (e) {
      if (onError) {
        onError("Failed to parse CEFR estimation response");
      }
    }
  }, onError);
};

/*
  Get all CEFR assessments for an article (LLM, ML, Teacher resolution)

  Example:
    api.getCEFRAssessments(12345, (data) => {
      console.log(data.display_cefr); // "A1/A2" or "B1"
      console.log(data.assessments.llm); // { cefr_level: "A1", method: "llm_assessed_deepseek", ... }
      console.log(data.assessments.ml);  // { cefr_level: "A2", method: "ml", ... }
    });
*/
Zeeguu_API.prototype.getCEFRAssessments = function (articleId, onSuccess, onError) {
  this._getJSON(`article/${articleId}/cefr_assessments`, onSuccess, onError);
};

/*
  Teacher resolves a CEFR disagreement by choosing a level

  Example:
    api.resolveCEFR(12345, "A1", (result) => {
      console.log(result.display_cefr); // "A1" (now resolved)
    });
*/
Zeeguu_API.prototype.resolveCEFR = function (articleId, cefrLevel, onSuccess, onError) {
  let payload = {
    cefr_level: cefrLevel,
  };
  this._post(`article/${articleId}/resolve_cefr`, qs.stringify(payload), (response) => {
    try {
      onSuccess(JSON.parse(response));
    } catch (e) {
      // If response is not JSON, just pass it through
      onSuccess(response);
    }
  }, onError);
};

/*
  Compute ML assessment for article content (fast, auto-recomputes on edits)

  Example:
    api.assessML(12345, "Article content here", (data) => {
      console.log(data.ml_assessment); // "B1"
      console.log(data.ml_method); // "ml"
    });
*/
Zeeguu_API.prototype.assessML = function (articleId, content, onSuccess, onError) {
  this.apiPost(`/article/${articleId}/assess_ml`, { content: content })
    .then((response) => {
      if (onSuccess) onSuccess(response.data);
    })
    .catch((error) => {
      if (onError) onError(error);
    });
};

/*
  Compute LLM assessment for article (slow, on button click only)

  Example:
    api.assessLLM(12345, "Title", "Content", (data) => {
      console.log(data.llm_assessment); // "B1"
      console.log(data.llm_method); // "llm_assessed_deepseek"
    });
*/
Zeeguu_API.prototype.assessLLM = function (articleId, title, content, onSuccess, onError) {
  this.apiPost(`/article/${articleId}/assess_llm`, { title: title, content: content })
    .then((response) => {
      if (onSuccess) onSuccess(response.data);
    })
    .catch((error) => {
      if (onError) onError(error);
    });
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
