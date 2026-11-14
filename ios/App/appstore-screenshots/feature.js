/**
 * Renders the Play Store feature graphic (1024×500) for a language from the
 * live captures (feed + reader) that render-live.js made.
 *
 * Usage: FIXTURE_LANG=da node feature.js   → output/store-da/feature-graphic.png
 *        FIXTURE_LANG=it node feature.js   → output/store/feature-graphic.png (main listing)
 */

const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

// "|" breaks the line, *x* is orange.
const CAPTIONS = {
  it: { title: "Learn a language|from *the news*", sub: "Real stories, simplified to your level. Tap any word to see what it means." },
  da: { title: "Understand the|*Danish news*", sub: "Real stories, simplified to your level. Tap any word to see it in English." },
};

async function main() {
  const lang = process.env.FIXTURE_LANG || "da";
  const caption = CAPTIONS[lang];
  if (!caption) throw new Error(`No feature-graphic caption for "${lang}"`);

  const outputDir = path.join(__dirname, "output");
  const rawDir = lang === "it" ? outputDir : path.join(outputDir, lang);
  const storeDir = path.join(outputDir, lang === "it" ? "store" : `store-${lang}`);
  fs.mkdirSync(storeDir, { recursive: true });

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 500, deviceScaleFactor: 1 });
  const params = new URLSearchParams({
    feed: "file://" + path.join(rawDir, "screenshot-iphone-03.png"),
    reader: "file://" + path.join(rawDir, "screenshot-iphone-05.png"),
    ...caption,
  });
  await page.goto(`file://${path.join(__dirname, "feature.html")}?${params}`, { waitUntil: "load" });
  await page.evaluate(() => Promise.all([...document.images].map((i) => i.decode())));
  const out = path.join(storeDir, "feature-graphic.png");
  await page.screenshot({ path: out });
  await browser.close();
  console.log(`→ ${path.relative(__dirname, out)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
