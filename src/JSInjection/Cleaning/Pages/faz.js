export const fazRegex = /(http|https):\/\/(www.faz.net).*/;

export function displayEntireArticleFaz(url) {
    let entireArticleUrl = url + "?printPagedArticle=true"
    return entireArticleUrl
}
