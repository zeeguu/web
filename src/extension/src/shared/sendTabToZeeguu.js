import { BROWSER_API } from "../utils/browserApi";

// Two-step injection: scrapeForUpload.js attaches __zeeguuScrape to the tab's
// isolated-world window (because Readability needs DOM APIs the MV3 service
// worker doesn't have); a second executeScript invokes it and returns the
// structured result. The popup goes through the same path so both flows
// share one parsing implementation.
async function scrapeActiveTab(tab) {
  await BROWSER_API.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["scrapeForUpload.js"],
  });
  const [injection] = await BROWSER_API.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => window.__zeeguuScrape && window.__zeeguuScrape(),
  });
  const scraped = injection?.result;
  if (!scraped) {
    throw new Error("Could not run page scraper.");
  }
  if (scraped.error) {
    throw new Error(scraped.error);
  }
  return scraped;
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
