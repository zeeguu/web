/**
 * App Store Screenshot Generator
 *
 * Takes screenshots of the real Zeeguu app with mocked API data.
 * Produces deterministic screenshots at iPhone and iPad sizes.
 *
 * Usage:
 *   node render-live.js                   # render all 9 live screens (localhost:3000)
 *   node render-live.js 8 9               # only screenshots 08 and 09
 *   node render-live.js 5-7               # range 05..07
 *   BASE_URL=https://www.zeeguu.org node render-live.js   # use production
 */

const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const { CAPTURE, FIXTURE_LANG } = require("./fixtures/mock-data");
const { setupRequestInterception, HIDE_WEB_CHROME } = require("./intercept");

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

// Apple required screenshot sizes
// CSS px × deviceScaleFactor = actual pixel dimensions
const devices = [
  { name: "iphone", width: 430, height: 932, scale: 3 },          // → 1290×2796 (6.7")
  { name: "ipad", width: 1024, height: 1366, scale: 2 },          // → 2048×2732 (13")
  { name: "android-phone", width: 360, height: 640, scale: 3 },   // → 1080×1920
  { name: "android-tablet", width: 600, height: 960, scale: 2 },  // → 1200×1920
];

// Final ordering (slot 10 is the "Start now!" marketing slide from render.js):
//  1. Live: Topics / Interests picker  ← screenshot01
//  2. Live: Filters                    ← screenshot02
//  3. Live: Articles feed              ← screenshot03
//  4. Live: Simplify prompt            ← screenshot04
//  5. Live: Article reader             ← screenshot05
//  6. Live: Match exercise             ← screenshot06
//  7. Live: Multiple choice exercise   ← screenshot07
//  8. Live: Daily audio — generate     ← screenshot08
//  9. Live: Daily audio — lesson ready ← screenshot09
// 10. Marketing: "Start now!"          (screenshot6.html via render.js)
const screens = [
  { name: "screenshot01", path: "/account_settings/interests?fromArticles=1", wait: 3000 },
  { name: "screenshot02", path: "/account_settings/filters?fromArticles=1", wait: 3000 },
  { name: "screenshot03", path: "/articles", wait: 5000 },
  {
    name: "screenshot04",
    path: `/shared-article?url=${encodeURIComponent(CAPTURE.sharedArticleUrl)}`,
    wait: 4000,
  },
  { name: "screenshot05", path: "/read/article?id=1", wait: 6000 },
  { name: "screenshot06", path: "/exercise/Match/101,102,103", wait: 5000 },
  { name: "screenshot07", path: "/exercise/MultipleChoiceL2toL1/101,102,103", wait: 5000 },
  {
    name: "screenshot08",
    path: "/daily-audio",
    wait: 4000,
    mockOverrides: { get_todays_lesson: { lesson: null } },
    preLoad: async (page) => {
      await page.evaluateOnNewDocument((lang, topic) => {
        localStorage.setItem(`audio_lesson_lesson_type_${lang}`, "topic");
        localStorage.setItem(
          `audio_lesson_suggestion_topic_${lang}`,
          topic,
        );
      }, FIXTURE_LANG, CAPTURE.audioTopic);
    },
  },
  { name: "screenshot09", path: "/daily-audio", wait: 5000 },
];

// Parse CLI args like `8`, `8 9`, `5-7` into a set of zero-padded screen numbers.
// Empty set means "render all".
function parseScreenFilter(argv) {
  const selected = new Set();
  for (const arg of argv) {
    const range = arg.match(/^(\d+)-(\d+)$/);
    if (range) {
      const [lo, hi] = [parseInt(range[1]), parseInt(range[2])].sort((a, b) => a - b);
      for (let i = lo; i <= hi; i++) selected.add(String(i).padStart(2, "0"));
    } else if (/^\d+$/.test(arg)) {
      selected.add(arg.padStart(2, "0"));
    }
  }
  return selected;
}

async function renderScreenshots() {
  // Italian (the default set) goes straight into output/, other languages
  // into output/<lang>/.
  const outputDir = FIXTURE_LANG === "it"
    ? path.join(__dirname, "output")
    : path.join(__dirname, "output", FIXTURE_LANG);
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const selected = parseScreenFilter(process.argv.slice(2));
  const activeScreens = selected.size
    ? screens.filter((s) => selected.has(s.name.replace(/^screenshot/, "")))
    : screens;
  if (selected.size && !activeScreens.length) {
    console.error(`No screens matched filter: ${[...selected].join(", ")}`);
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  for (const device of devices) {
    for (const screen of activeScreens) {
      const num = screen.name.replace(/^screenshot/, "");
      const label = `screenshot-${device.name}-${num}`;
      console.log(`${label}...`);

      const page = await browser.newPage();

      await page.setViewport({
        width: device.width,
        height: device.height,
        deviceScaleFactor: device.scale,
      });

      // Light theme: the app default, and it reads better at search-result size
      await page.emulateMediaFeatures([
        { name: "prefers-color-scheme", value: "light" },
      ]);

      await page.setRequestInterception(true);
      setupRequestInterception(page, screen.mockOverrides || {});

      // Set session cookie so the app thinks we're logged in
      const domain = new URL(BASE_URL).hostname;
      await page.setCookie({
        name: "sessionID",
        value: "mock-session-screenshot",
        domain,
        path: "/",
      });

      if (screen.preLoad) await screen.preLoad(page);

      try {
        await page.goto(`${BASE_URL}${screen.path}`, {
          waitUntil: "networkidle2",
          timeout: 30000,
        });

        // Wait for React to finish rendering
        await new Promise((r) => setTimeout(r, screen.wait));

        await page.addStyleTag({ content: HIDE_WEB_CHROME });

        // Exercise screenshots: hide the exercise type debug label
        if (screen.path.includes("/exercise/")) {
          await page.evaluate(() => {
            // The IndividualExercise component shows the type name as a small label
            // (e.g. "Match", "MultipleChoiceL2toL1"). Match the bare component name
            // exactly — a prefix match would also hide the instruction text
            // ("Match each word with its translation").
            const DEBUG_LABELS = new Set([
              "Match",
              "MultipleChoice",
              "MultipleChoiceContext",
              "MultipleChoiceL2toL1",
              "MultipleChoiceAudio",
              "TranslateL2toL1",
              "TranslateWhatYouHear",
              "SpellWhatYouHear",
              "FindWordInContext",
              "FindWordInContextCloze",
              "ClickWordInContext",
            ]);
            const allElements = document.querySelectorAll("*");
            for (const el of allElements) {
              if (el.children.length === 0 && DEBUG_LABELS.has(el.textContent.trim())) {
                el.style.display = "none";
              }
            }
          });
        }

        // Click bookmarked words to make translation bubbles visible
        // (reader, and the looked-up word in the first feed title)
        const wordTargetsByPath = {
          "/read/article": CAPTURE.readerWords,
          "/articles": CAPTURE.feedWords,
        };
        const pathKey = Object.keys(wordTargetsByPath).find((p) => screen.path.startsWith(p));
        if (pathKey) {
          const wordTargets = wordTargetsByPath[pathKey];
          for (const target of wordTargets) {
            const selector = await page.evaluateHandle((t) => {
              const spans = document.querySelectorAll("z-orig > span");
              for (const span of spans) {
                if (span.textContent.trim().startsWith(t)) return span;
              }
              return null;
            }, target);
            if (selector && selector.asElement()) {
              await selector.asElement().click();
              await new Promise((r) => setTimeout(r, 300));
            }
          }
          await new Promise((r) => setTimeout(r, 1000));
        }

        const outputName = `${label}.png`;
        await page.screenshot({
          path: path.join(outputDir, outputName),
          fullPage: false,
        });
        console.log(`  → output/${outputName}`);
      } catch (err) {
        console.error(`  ✗ ${label} failed: ${err.message}`);
      }

      await page.close();
    }
  }

  await browser.close();
  console.log("\nDone!");
}

renderScreenshots().catch(console.error);
