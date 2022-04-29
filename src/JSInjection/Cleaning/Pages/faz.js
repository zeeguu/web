export const fazRegex = /(http|https):\/\/(www.faz.net).*/;

export function displayEntireArticle(url) {
    let entireArticleUrl = url + "?printPagedArticle=true"
    return entireArticleUrl
}
