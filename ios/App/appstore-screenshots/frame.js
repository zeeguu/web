/**
 * Frames the live captures (output/screenshot-<device>-NN.png, from
 * render-live.js) with a caption, in store order, into output/store/.
 * The "Start now!" slide (slot 10 from render.js) goes last, unframed.
 *
 * Usage: node frame.js                  (Italian, the default set → output/store/)
 *        FIXTURE_LANG=da node frame.js  (Danish → output/store-da/)
 * Then:  node copy-to-fastlane.js [da]
 *
 * Search results show only the first three screenshots, so those carry
 * what is different about Zeeguu: real articles at your level (with an
 * appealing first story), tap-to-translate, and the audio lesson.
 */

const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

const devices = [
  { name: "iphone", width: 1290, height: 2796 },
  // 6.3": the only iPhone size custom product pages accept; same capture.
  { name: "iphone-63", capture: "iphone", width: 1206, height: 2622 },
  { name: "ipad", width: 2048, height: 2732 },
  { name: "android-phone", width: 1080, height: 1920 },
  { name: "android-tablet", width: 1200, height: 1920 },
];

// live = number of the render-live.js capture. "|" breaks the line, *x* is orange.
const slides = [
  { live: "03", title: "Real articles,|at *your level*", sub: "Simplified for you" },
  { live: "05", title: "Tap any *word*", sub: "See what it means, right in the sentence" },
  { live: "09", title: "A daily *audio* lesson", sub: "Built from the words you looked up" },
  { live: "07", title: "Practice *your* words", sub: "In the sentences where you met them" },
  { live: "01", title: "Read about what|*you care about*", sub: "Pick your topics, hide the rest" },
];
const START_NOW = "10"; // from render.js

async function main() {
  const lang = process.env.FIXTURE_LANG || "it";
  const outputDir = path.join(__dirname, "output");
  const rawDir = lang === "it" ? outputDir : path.join(outputDir, lang);
  const storeDir = path.join(outputDir, lang === "it" ? "store" : `store-${lang}`);
  fs.mkdirSync(storeDir, { recursive: true });
  for (const f of fs.readdirSync(storeDir)) fs.unlinkSync(path.join(storeDir, f));

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  const template = "file://" + path.join(__dirname, "frame.html");

  for (const device of devices) {
    await page.setViewport({ width: device.width, height: device.height, deviceScaleFactor: 1 });

    for (const [i, slide] of slides.entries()) {
      const src = path.join(rawDir, `screenshot-${device.capture || device.name}-${slide.live}.png`);
      if (!fs.existsSync(src)) {
        console.error(`  ✗ missing ${path.basename(src)}`);
        continue;
      }
      const params = new URLSearchParams({ img: "file://" + src, title: slide.title, sub: slide.sub });
      await page.goto(`${template}?${params}`, { waitUntil: "load" });
      await page.evaluate(() => document.getElementById("shot").decode());

      const out = `screenshot-${device.name}-${String(i + 1).padStart(2, "0")}.png`;
      await page.screenshot({ path: path.join(storeDir, out) });
      console.log(`  → output/store/${out}`);
    }

    const startNow = path.join(outputDir, `screenshot-${device.capture || device.name}-${START_NOW}.png`);
    if (fs.existsSync(startNow)) {
      const out = `screenshot-${device.name}-${String(slides.length + 1).padStart(2, "0")}.png`;
      if (device.capture) {
        // Rendered for another size: scale it to this one.
        await page.setContent(
          `<body style="margin:0"><img src="file://${startNow}" style="width:100vw;height:100vh;object-fit:cover;display:block"></body>`,
        );
        await page.evaluate(() => document.images[0].decode());
        await page.screenshot({ path: path.join(storeDir, out) });
      } else {
        fs.copyFileSync(startNow, path.join(storeDir, out));
      }
      console.log(`  → output/store/${out} (Start now!)`);
    }
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
