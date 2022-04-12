export const expressRegex = /(http|https):\/\/(www.express.co.uk).*/;

export function cleanExpressBefore(documentClone) {
  const newsletter = documentClone.getElementsByClassName("newsletter-pure");
  if (newsletter) {
    while (newsletter.length > 0) {
      newsletter[0].parentNode.removeChild(newsletter[0]);
    }
  }

  const relatedArticlesTwo = documentClone.getElementsByClassName("two-related-articles");
  if (relatedArticlesTwo) {
    while (relatedArticlesTwo.length > 0) {
      relatedArticlesTwo[0].parentNode.removeChild(relatedArticlesTwo[0]);
    }
  }

  const relatedArticles =
    documentClone.getElementsByClassName("related-articles");
  if (relatedArticles) {
    while (relatedArticles.length > 0) {
      relatedArticles[0].parentNode.removeChild(relatedArticles[0]);
    }
  }

  const navigation = documentClone.getElementsByClassName("main-navigation");
  if (navigation) {
    while (navigation.length > 0) {
      navigation[0].parentNode.removeChild(navigation[0]);
    }
  }

  const caption = documentClone.getElementsByClassName("newsCaption");
  if (caption) {
    while (caption.length > 0) {
      caption[0].parentNode.removeChild(caption[0]);
    }
  }

  const playerTitle = documentClone.getElementsByClassName("jw-player-title");
  if (playerTitle) {
    while (playerTitle.length > 0) {
      playerTitle[0].parentNode.removeChild(playerTitle[0]);
    }
  }

  return documentClone;
}
