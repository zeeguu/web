// Request interception shared by render-live.js (screenshots) and
// record-preview.js (App Store preview video): serves the mocked API, the
// fixture images and a silent lesson mp3, so the real app renders frozen,
// private-free content.

const path = require("path");
const fs = require("fs");
const { getResponse, FIXTURE_IMAGE_HOST } = require("./fixtures/mock-data");

const FIXTURE_IMAGES_DIR = path.join(__dirname, "fixtures", "images");
const SILENT_LESSON = path.join(__dirname, "fixtures", "audio", "silence-351s.mp3");

function respondJson(request, body) {
  const isString = typeof body === "string";
  request
    .respond({
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": isString ? "text/plain; charset=utf-8" : "application/json; charset=utf-8",
      },
      body: isString ? body : JSON.stringify(body),
    })
    .catch(() => {});
}

// overrides: per-route API responses that win over the shared fixture. A key
// ending in "*" matches routes that start with it; a function value is
// called with the request and returns the body.
// pages: { "/some/path": "<html>" } served as-is (record-preview.js's frame).
function setupRequestInterception(page, overrides = {}, pages = {}) {
  page.on("request", (request) => {
    const url = request.url();

    const pagePath = Object.keys(pages).find((p) => new URL(url).pathname === p);
    if (pagePath) {
      request
        .respond({ status: 200, contentType: "text/html; charset=utf-8", body: pages[pagePath] })
        .catch(() => {});
      return;
    }

    // Block SSE stream → forces fallback to GET /user_article
    if (url.includes("user_article_stream")) {
      request.abort().catch(() => {});
      return;
    }

    // Serve fixture images
    if (url.includes(FIXTURE_IMAGE_HOST)) {
      const parts = url.split(FIXTURE_IMAGE_HOST + "/");
      const filename = parts[1] ? parts[1].split("?")[0] : null;
      const filepath = filename ? path.join(FIXTURE_IMAGES_DIR, filename) : null;
      if (filepath && fs.existsSync(filepath)) {
        request
          .respond({ status: 200, contentType: "image/jpeg", body: fs.readFileSync(filepath) })
          .catch(() => {});
      } else {
        request.abort().catch(() => {});
      }
      return;
    }

    // Lesson audio: a silent mp3 of the lesson's length, so the player
    // shows a real duration and progress instead of 0:00.
    if (url.includes("api.zeeguu.org") && url.includes("/audio/daily_lessons/")) {
      request
        .respond({
          status: 200,
          headers: { "Access-Control-Allow-Origin": "*" },
          contentType: "audio/mpeg",
          body: fs.readFileSync(SILENT_LESSON),
        })
        .catch(() => {});
      return;
    }

    // Mock API responses (cross-origin: needs CORS headers)
    if (url.includes("api.zeeguu.org")) {
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

      const routeMatch = url.match(/api\.zeeguu\.org\/+([^?]*)/);
      const route = routeMatch ? routeMatch[1].replace(/^\/+/, "") : null;
      const key = route && Object.keys(overrides).find(
        (k) => k === route || (k.endsWith("*") && route.startsWith(k.slice(0, -1))),
      );
      if (key) {
        const value = overrides[key];
        respondJson(request, typeof value === "function" ? value(request) : value);
        return;
      }

      const response = getResponse(url, request.method());
      if (response !== null) {
        respondJson(request, response);
        return;
      }
      // Unhandled API route — return empty OK with CORS to avoid blocking
      console.warn(`  [unhandled API] ${request.method()} ${url.split("?")[0]}`);
      request
        .respond({
          status: 200,
          headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
          body: "null",
        })
        .catch(() => {});
      return;
    }

    request.continue().catch(() => {});
  });
}

// The web top bar (settings gear) is not part of the app's look.
const HIDE_WEB_CHROME = '[class*="Bannerssc__TopBarContainer"] { display: none !important; }';

module.exports = { setupRequestInterception, HIDE_WEB_CHROME };
