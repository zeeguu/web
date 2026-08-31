import getDomainName from "./getDomainName";
import extractDomain from "../web/extractDomain";

// An article is "simplified" if the backend flags it via is_simplified
// OR it carries a parent_article_id (the AI-generated child of a real
// article). Some surfaces also accept parent_url as a fallback when
// the dict was built without is_simplified — keep that branch so the
// reader's "Original: <link>" affordance keeps working.
export function isSimplifiedArticle(article) {
  return !!(article.parent_article_id || article.is_simplified || article.parent_url);
}

// Source label fallback chain: prefer the feed name when known
// (curated, e.g. "Politiken"); otherwise derive a domain from the
// parent URL (for simplified articles) or the article URL.
//
// Empty when there is no publisher to name: a text a teacher typed in has no
// url of its own, so the API mints it a synthetic `userarticle/<uuid>` one,
// whose "domain" used to print on the card as the publisher "userarticle".
// A host without a dot in it is not a host -- say nothing instead.
export function articleSourceLabel(article) {
  if (article.feed_name) return article.feed_name;
  const domain = article.parent_url ? getDomainName(article.parent_url) : extractDomain(article.url);
  return domain && domain.includes(".") ? domain : "";
}
