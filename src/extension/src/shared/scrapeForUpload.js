import { Readability } from "@mozilla/readability";

// Runs in the tab's isolated world, where `document`, `DOMParser`, etc. exist.
// The MV3 service worker has none of those, so background.js can't run
// Readability itself — it injects this file via scripting.executeScript
// and then calls __zeeguuScrape() in a follow-up executeScript to retrieve
// the structured result.
window.__zeeguuScrape = function () {
  const url = document.location.href;

  // Readability mutates the document it parses, so work on a clone and
  // capture <head> metadata before parsing.
  const docClone = document.cloneNode(true);
  const base = docClone.createElement("base");
  base.href = url;
  docClone.head.prepend(base);

  const meta = (selector) =>
    docClone.querySelector(selector)?.getAttribute("content") || null;
  const metaImage =
    meta('meta[property="og:image"]') ||
    meta('meta[property="og:image:secure_url"]') ||
    meta('meta[name="twitter:image"]') ||
    meta('meta[name="twitter:image:src"]') ||
    null;

  const article = new Readability(docClone).parse();
  if (!article) {
    return { error: "Readability could not extract an article from this page." };
  }

  const firstImageIn = (html) => {
    const articleDoc = new DOMParser().parseFromString(html || "", "text/html");
    for (const img of articleDoc.querySelectorAll("img")) {
      const src = img.getAttribute("src") || img.getAttribute("data-src");
      if (!src) continue;
      if (src.startsWith("data:")) continue;
      if (/icon|placeholder/i.test(src)) continue;
      if (/\.(gif|svg)(\?|$)/i.test(src)) continue;
      return src;
    }
    return null;
  };

  return {
    url,
    rawHtml: article.content,
    textContent: article.textContent,
    title: article.title,
    author: article.byline,
    imageUrl: metaImage || firstImageIn(article.content),
  };
};
