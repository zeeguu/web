/*global chrome*/
import { Readability } from "@mozilla/readability";
import { BROWSER_API } from "../utils/browserApi";

async function scrapeActiveTab(tab) {
  const [result] = await BROWSER_API.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => ({
      url: document.location.href,
      fullHtml: document.documentElement.outerHTML,
    }),
  });
  const { url, fullHtml } = result.result;

  const doc = new DOMParser().parseFromString(fullHtml, "text/html");
  const base = doc.createElement("base");
  base.href = url;
  doc.head.prepend(base);

  // Extract metadata from <head> BEFORE running Readability — it mutates
  // the document it parses, and og:image / twitter:image live in <head>.
  const metaImage = extractMetaImage(doc);

  // Readability.parse mutates `doc` — anything we want from the head has to
  // be captured above. A fresh parse guards our fallback img scan.
  const article = new Readability(doc).parse();
  if (!article) throw new Error("Readability could not extract an article from this page.");

  return {
    url,
    rawHtml: article.content,
    textContent: article.textContent,
    title: article.title,
    author: article.byline,
    imageUrl: metaImage || firstImageIn(article.content),
  };
}

function extractMetaImage(pageDoc) {
  const meta = (selector) =>
    pageDoc.querySelector(selector)?.getAttribute("content") || null;
  return (
    meta('meta[property="og:image"]') ||
    meta('meta[property="og:image:secure_url"]') ||
    meta('meta[name="twitter:image"]') ||
    meta('meta[name="twitter:image:src"]') ||
    null
  );
}

function firstImageIn(articleHtml) {
  const articleDoc = new DOMParser().parseFromString(articleHtml || "", "text/html");
  for (const img of articleDoc.querySelectorAll("img")) {
    const src = img.getAttribute("src") || img.getAttribute("data-src");
    if (!src) continue;
    if (src.startsWith("data:")) continue;
    if (/icon|placeholder/i.test(src)) continue;
    if (/\.(gif|svg)(\?|$)/i.test(src)) continue;
    return src;
  }
  return null;
}

export async function sendTabToZeeguu(api, tab) {
  const scraped = await scrapeActiveTab(tab);
  const upload = await new Promise((resolve, reject) =>
    api.createArticleUpload(
      {
        url: scraped.url,
        raw_html: scraped.rawHtml,
        text_content: scraped.textContent,
        title: scraped.title || "",
        image_url: scraped.imageUrl || "",
        author: scraped.author || "",
      },
      resolve,
      reject,
    ),
  );
  return upload;
}

export function isUnsupportedTab(tab) {
  if (!tab?.url) return true;
  if (/^chrome(-extension)?:\/\//.test(tab.url)) return true;
  if (tab.url.includes("zeeguu.org")) return true;
  return false;
}
