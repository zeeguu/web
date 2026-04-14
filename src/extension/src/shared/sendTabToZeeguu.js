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

  // Send Readability's cleaned HTML, not the full outerHTML — the raw DOM
  // of modern pages (social widgets, SPA shells, inline scripts) easily
  // blows past server body-size limits.
  const article = new Readability(doc).parse();
  if (!article) throw new Error("Readability could not extract an article from this page.");

  const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute("content") || null;

  return {
    url,
    rawHtml: article.content,
    textContent: article.textContent,
    title: article.title,
    author: article.byline,
    imageUrl: ogImage,
  };
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
