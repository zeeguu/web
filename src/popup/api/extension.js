import { Zeeguu_API } from "./classDef";

Zeeguu_API.prototype.findCreateArticle = function (articleInfo, callback ) {
    this._post(
        `find_or_create_article`,
        `url=${articleInfo.url}` +
        `&htmlContent=${articleInfo.htmlContent}` +
        `&title=${articleInfo.title}`,
        callback
    );
};