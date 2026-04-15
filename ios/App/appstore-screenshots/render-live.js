/**
 * App Store Screenshot Generator
 *
 * Takes screenshots of the real Zeeguu app with mocked API data.
 * Produces deterministic screenshots at iPhone and iPad sizes.
 *
 * Usage:
 *   node render-live.js
 *   BASE_URL=http://localhost:5173 node render-live.js   # use local dev server
 */

const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const { getResponse, FIXTURE_IMAGE_HOST } = require("./fixtures/mock-data");

const BASE_URL = process.env.BASE_URL || "https://www.zeeguu.org";

// Apple required screenshot sizes
// CSS px × deviceScaleFactor = actual pixel dimensions
const devices = [
  { name: "iphone", width: 430, height: 932, scale: 3 },          // → 1290×2796 (6.7")
  { name: "ipad", width: 1024, height: 1366, scale: 2 },          // → 2048×2732 (13")
  { name: "android-phone", width: 360, height: 640, scale: 3 },   // → 1080×1920
  { name: "android-tablet", width: 600, height: 960, scale: 2 },  // → 1200×1920
];

// Final ordering (interleaved with marketing screenshots from render.js):
//  1. Marketing: "Follow topics you love"       (screenshot1.html)
//  2. Live: Articles feed                       ← screenshot02
//  3. Marketing: "Read at your own level"       (screenshot2.html)
//  4. Live: Article reader                      ← screenshot04
//  5. Marketing: "Practice words you looked up" (screenshot4.html)
//  6. Live: Match exercise                      ← screenshot06
//  7. Live: Multiple choice exercise            ← screenshot07
//  8. Marketing: "Listen to audio lessons"      (screenshot5.html)
//  9. Live: Daily audio                         ← screenshot09
// 10. Marketing: "Start now!"                   (screenshot6.html)
const screens = [
  { name: "screenshot02", path: "/articles", wait: 5000 },
  { name: "screenshot04", path: "/read/article?id=1", wait: 6000 },
  { name: "screenshot06", path: "/exercise/Match/101,102,103", wait: 5000 },
  { name: "screenshot07", path: "/exercise/MultipleChoiceL2toL1/101,102,103", wait: 5000 },
  { name: "screenshot09", path: "/daily-audio", wait: 5000 },
];

const FIXTURE_IMAGES_DIR = path.join(__dirname, "fixtures", "images");

function setupRequestInterception(page) {
  page.on("request", (request) => {
    const url = request.url();

    // Block SSE stream → forces fallback to GET /user_article
    if (url.includes("user_article_stream")) {
      request.abort().catch(() => {});
      return;
    }

    // Serve fixture images
    if (url.includes(FIXTURE_IMAGE_HOST)) {
      const parts = url.split(FIXTURE_IMAGE_HOST + "/");
      const filename = parts[1] ? parts[1].split("?")[0] : null;
      const filepath = filename
        ? path.join(FIXTURE_IMAGES_DIR, filename)
        : null;
      if (filepath && fs.existsSync(filepath)) {
        request
          .respond({
            status: 200,
            contentType: "image/jpeg",
            body: fs.readFileSync(filepath),
          })
          .catch(() => {});
      } else {
        request.abort().catch(() => {});
      }
      return;
    }

    // Mock API responses (cross-origin: needs CORS headers)
    if (url.includes("api.zeeguu.org")) {
      // Handle CORS preflight
      if (request.method() === "OPTIONS") {
        request
          .respond({
            status: 204,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET, POST, OPTIONS, DELETE",
              "Access-Control-Allow-Headers": "Content-Type",
            },
          })
          .catch(() => {});
        return;
      }

      const response = getResponse(url, request.method());
      if (response !== null) {
        const isString = typeof response === "string";
        request
          .respond({
            status: 200,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": isString
                ? "text/plain; charset=utf-8"
                : "application/json; charset=utf-8",
            },
            body: isString ? response : JSON.stringify(response),
          })
          .catch(() => {});
        return;
      }
      // Unhandled API route — return empty OK with CORS to avoid blocking
      console.warn(`  [unhandled API] ${request.method()} ${url.split("?")[0]}`);
      request
        .respond({
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
          body: "null",
        })
        .catch(() => {});
      return;
    }

    request.continue().catch(() => {});
  });
}

async function renderScreenshots() {
  const outputDir = path.join(__dirname, "output");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  for (const device of devices) {
    for (const screen of screens) {
      const label = `${screen.name}-${device.name}`;
      console.log(`${label}...`);

      const page = await browser.newPage();

      await page.setViewport({
        width: device.width,
        height: device.height,
        deviceScaleFactor: device.scale,
      });

      // Force dark mode (matches the app's default on iOS)
      await page.emulateMediaFeatures([
        { name: "prefers-color-scheme", value: "dark" },
      ]);

      await page.setRequestInterception(true);
      setupRequestInterception(page);

      // Set session cookie so the app thinks we're logged in
      const domain = new URL(BASE_URL).hostname;
      await page.setCookie({
        name: "sessionID",
        value: "mock-session-screenshot",
        domain,
        path: "/",
      });

      try {
        await page.goto(`${BASE_URL}${screen.path}`, {
          waitUntil: "networkidle2",
          timeout: 30000,
        });

        // Wait for React to finish rendering
        await new Promise((r) => setTimeout(r, screen.wait));

        // Exercise screenshots: hide the exercise type debug label
        if (screen.path.includes("/exercise/")) {
          await page.evaluate(() => {
            // The IndividualExercise component shows the type name as a small label
            // Find and hide it (it's a plain text node like "MultipleChoiceL2toL1")
            const allElements = document.querySelectorAll("*");
            for (const el of allElements) {
              if (el.children.length === 0 &&
                  el.textContent.match(/^(Match|MultipleChoice|Translate|SpellWhat|FindWord|ClickWord)/)) {
                el.style.display = "none";
              }
            }
          });
        }

        // Click bookmarked words to make translation bubbles visible (reader only)
        if (screen.path.includes("/read/article")) {
          const wordTargets = ["bevanda svedese", "latte caldo", "pelle"];
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
