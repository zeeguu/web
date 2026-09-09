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

// Card-level disclosure of what on this article was written by a machine.
//
// EU AI Act Art. 50(4) asks deployers to disclose artificially generated text
// published to inform the public. Labelling every AI element separately would
// mean a tag on each title in the browser, so the card carries ONE mark and the
// reader/overlay spell out the detail.
//
//   - Simplified children: the title AND the body are model output. The tag
//     applies even for an uploaded text's simplified copy, which inherits its
//     parent's uploader (Article.create_simplified_article) but is still
//     machine-written.
//   - Everything else the crawler ingests: assess_summarize_and_classify runs
//     for every article in on-demand mode, so `summary` is the model's.
//   - Uploaded texts (teacher/user) never reach the crawler; their summary is
//     the constructor's 300-char truncation of the author's own prose. Claiming
//     AI there would be a false disclosure, so say nothing.
//
// Residual over-claim: an article whose summary was dropped for being in the
// wrong language keeps the publisher's feed blurb yet still shows "AI summary".
// Rare, and it errs toward disclosing rather than hiding.
export function aiProvenanceLabel(article) {
  if (isSimplifiedArticle(article)) return "AI-simplified";
  if (article.has_uploader) return null;
  return article.summary ? "AI summary" : null;
}
