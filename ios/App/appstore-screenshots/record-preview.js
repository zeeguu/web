/**
 * App Store preview video (886×1920, about 20 s) from the real app with
 * mocked data: the feed, tapping words in an article, the daily audio
 * lesson, an exercise, then the "Start now!" card.
 *
 * The app runs in an iframe inside a small page with the same caption
 * style as the screenshots (frame.html). Both are served from the dev
 * server's origin through the request interception, so the script can tap
 * inside the app. Each scene is recorded as its own clip once its page
 * has loaded (no spinners), then ffmpeg joins them.
 *
 * Usage (vite on localhost:3000, ffmpeg on PATH):
 *   node record-preview.js                  → output/preview/preview-it.mp4
 *   FIXTURE_LANG=da node record-preview.js  → output/preview/preview-da.mp4
 */

const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const { execFileSync } = require("child_process");
const { CAPTURE, FIXTURE_LANG } = require("./fixtures/mock-data");
const { EXERCISE_BOOKMARKS, TODAYS_LESSON, ARTICLE_CONTENT, RECOMMENDED_ARTICLES } = require(`./fixtures/content-${FIXTURE_LANG}`);
const { setupRequestInterception, HIDE_WEB_CHROME } = require("./intercept");

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const FRAME_PATH = "/__preview-frame";

// 443×960 CSS px at 2× = 886×1920, Apple's portrait app preview size.
const VIEW = { width: 443, height: 960, scale: 2 };
// The app renders at a phone width and is scaled into the frame.
const APP = { width: 430, height: 932 };

const OUT_DIR = path.join(__dirname, "output", "preview");
const START_NOW = path.join(__dirname, "output", "screenshot-iphone-10.png");

const FRAME_HTML = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 100vw; height: 100vh; overflow: hidden; }
  body {
    background: linear-gradient(180deg, #FDF6E9 0%, #F9E4C8 100%);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    display: flex; flex-direction: column; align-items: center; padding-top: 7vh;
  }
  #caption { transition: opacity 0.25s; text-align: center; }
  .title { font-size: 9.4vmin; font-weight: 800; color: #2E2A26; line-height: 1.08;
           letter-spacing: -0.02em; padding: 0 6vmin; }
  .title em { font-style: normal; color: #E8901A; }
  .sub { margin-top: 2.2vh; font-size: 4.6vmin; color: #6B625A; line-height: 1.3; padding: 0 8vmin; }
  #phone { margin-top: 5vh; width: 82vw; flex-shrink: 0; border-radius: 5vmin; overflow: hidden;
           box-shadow: 0 3vmin 8vmin rgba(60, 35, 10, 0.28); background: #fff; }
  #app { border: 0; width: ${APP.width}px; height: ${APP.height}px; transform-origin: 0 0; display: block; }
  /* A tap: a soft circle where the finger lands. */
  .tap { position: fixed; width: 34px; height: 34px; margin: -17px 0 0 -17px; border-radius: 50%;
         background: rgba(232, 144, 26, 0.45); pointer-events: none; animation: tap 0.6s ease-out forwards; }
  @keyframes tap { from { transform: scale(0.4); opacity: 1; } to { transform: scale(1.3); opacity: 0; } }
</style></head>
<body>
  <div id="caption"><h1 class="title" id="title"></h1><p class="sub" id="sub"></p></div>
  <div id="phone"><iframe id="app"></iframe></div>
  <script>
    const phone = document.getElementById('phone');
    const app = document.getElementById('app');
    const k = phone.clientWidth / ${APP.width};
    app.style.transform = 'scale(' + k + ')';
    phone.style.height = (${APP.height} * k) + 'px';
  </script>
</body></html>`;

const lang = FIXTURE_LANG;
const TAPS = CAPTURE.videoTaps;
const DICTIONARY = Object.fromEntries([...TAPS.feed, ...TAPS.reader]);

// The screenshot fixtures come with some words already looked up (a still
// can't show a lookup happening). In the video that would read as "only
// these words translate", so the video starts from a clean text.
function withoutLookups(value) {
  if (Array.isArray(value)) return value.map(withoutLookups);
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      if (k === "mergedTokens" || k === "skipRender") continue;
      out[k] = k === "bookmark" ? null : withoutLookups(v);
    }
    return out;
  }
  return value;
}

// A tap looks the word up for real: the app calls translate_word and this
// answers from the scene's word list.
let nextBookmarkId = 7000;
function translateWord(request) {
  const body = request.postData() || "";
  let word;
  try {
    word = JSON.parse(body).word;
  } catch {
    word = new URLSearchParams(body).get("word");
  }
  const translation = DICTIONARY[word] || DICTIONARY[word?.trim()];
  if (!translation) console.warn(`  [no video translation for "${word}"]`);
  return { translation: translation || "…", service_name: "Mock", bookmark_id: nextBookmarkId++ };
}
const correctAnswer = EXERCISE_BOOKMARKS[0].to;

// "|" breaks the line, *x* is orange (as in frame.js).
const scenes = [
  {
    title: "Real articles,|at *your level*",
    sub: "Simplified for you",
    src: "/articles",
    // Same rhythm throughout: move, tap a word, move on, open, move, tap.
    act: async (s) => {
      await s.scroll(140, 900);
      await s.pause(200);
      for (const [w] of TAPS.feed) {
        await s.tapWord(w);
        await s.pause(800);
      }
      // Scroll to the reader's article and open it: one continuous take.
      const card = await s.find(
        (src) => [...document.querySelectorAll("img")].find((i) => i.src.endsWith(src)) || null,
        ARTICLE_CONTENT.img_url.split("/").pop(),
      );
      await s.scrollTo(card, 1300);
      await s.pause(600);
      await s.tap(card);
      // Cut while the article opens (it briefly keeps the feed's scroll
      // position); the join cross-fades into the loaded article.
      await s.cut(async () => {
        await s.caption("Tap any *word*", "See what it means, right in the sentence");
        await s.waitFor(
          (w) => [...document.querySelectorAll("z-tag")].some((x) => x.textContent.trim().startsWith(w)),
          TAPS.reader[0][0],
        );
        await s.pause(1200);
      });
      // Read on: scroll to each word, then tap it.
      for (const [w] of TAPS.reader) {
        await s.scrollTo(await s.word(w), 900);
        await s.pause(250);
        await s.tapWord(w);
        await s.pause(1000);
      }
      await s.pause(600);
    },
  },
  {
    title: "A daily *audio* lesson",
    sub: "Built from the words you looked up",
    src: "/daily-audio",
    act: async (s) => {
      await s.pause(900);
      await s.tapSelector('svg[data-testid="PlayArrowRoundedIcon"]');
      await s.pause(3200);
    },
  },
  {
    title: "Practice *your* words",
    sub: "In the sentences where you met them",
    src: "/exercise/MultipleChoiceL2toL1/101,102,103",
    act: async (s) => {
      await s.pause(1200);
      await s.tapText(correctAnswer);
      await s.pause(2200);
    },
  },
];

const pause = (ms) => new Promise((r) => setTimeout(r, ms));

async function appFrame(page) {
  const handle = await page.$("#app");
  return handle.contentFrame();
}

// Shows the tap circle at the element's center, then clicks it. The app's
// iframe is scaled, which Puppeteer's boundingBox() ignores, so the point
// is computed here: position inside the app × scale + the iframe's offset.
async function tap(page, handle, { quiet = false } = {}) {
  const r = await handle.evaluate((el) => {
    const b = el.getBoundingClientRect();
    return { x: b.left + b.width / 2, y: b.top + b.height / 2 };
  });
  const { x, y } = await page.evaluate((r) => {
    const app = document.getElementById("app");
    const b = app.getBoundingClientRect();
    const k = b.width / app.offsetWidth;
    return { x: b.left + r.x * k, y: b.top + r.y * k };
  }, r);
  if (!quiet) await page.evaluate((x, y) => {
    const dot = document.createElement("div");
    dot.className = "tap";
    dot.style.left = x + "px";
    dot.style.top = y + "px";
    document.body.appendChild(dot);
    setTimeout(() => dot.remove(), 700);
  }, x, y);
  await pause(150);
  await page.mouse.click(x, y);
}

// Sets the caption, fading it out and back in.
async function setCaption(page, title, sub) {
  await page.evaluate(
    (title, sub) =>
      new Promise((done) => {
        const caption = document.getElementById("caption");
        caption.style.opacity = 0;
        setTimeout(() => {
          document.getElementById("title").innerHTML = title
            .replace(/\*(.+?)\*/g, "<em>$1</em>")
            .replace(/\|/g, "<br>");
          document.getElementById("sub").textContent = sub;
          caption.style.opacity = 1;
          done();
        }, 250);
      }),
    title,
    sub,
  );
}

// rec: { cut(prepare) } — ends the current clip, runs prepare off camera,
// starts the next clip.
function sceneTools(page, frame, rec) {
  const tools = {
    pause,
    cut: (prepare) => rec.cut(prepare),
    tap: (handle) => tap(page, handle),
    caption: (title, sub) => setCaption(page, title, sub),
    async find(fn, arg) {
      const handle = await frame.evaluateHandle(fn, arg);
      if (!handle.asElement()) throw new Error(`nothing found for ${arg}`);
      return handle;
    },
    async waitFor(fn, arg) {
      try {
        await frame.waitForFunction(fn, { timeout: 15000 }, arg);
      } catch (err) {
        const shot = path.join(OUT_DIR, "timeout.png");
        await page.screenshot({ path: shot });
        throw new Error(`${err.message} (${frame.url()}; screen: ${shot})`);
      }
    },
    // Scrolls so the element sits a little below the middle of the screen.
    async scrollTo(handle, ms) {
      const dy = await handle.evaluate((el) => {
        const b = el.getBoundingClientRect();
        return b.top + b.height / 2 - window.innerHeight * 0.55;
      });
      await tools.scroll(dy, ms);
    },
    // Scrolls the app's main scroll area by dy px, eased like a thumb flick.
    async scroll(dy, ms) {
      await frame.evaluate(
        (dy, ms) =>
          new Promise((done) => {
            const candidates = [document.scrollingElement, ...document.querySelectorAll("*")];
            const el = candidates
              .filter((e) => e && e.scrollHeight - e.clientHeight > 50 &&
                (e === document.scrollingElement || /(auto|scroll)/.test(getComputedStyle(e).overflowY)))
              .sort((a, b) => b.clientHeight - a.clientHeight)[0];
            if (!el) return done();
            const from = el.scrollTop;
            const t0 = performance.now();
            const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
            const step = (now) => {
              const t = Math.min(1, (now - t0) / ms);
              el.scrollTop = from + dy * ease(t);
              if (t < 1) requestAnimationFrame(step);
              else done();
            };
            requestAnimationFrame(step);
          }),
        dy,
        ms,
      );
    },
    // A looked-up word is z-orig > span; one not looked up yet is a bare z-tag.
    async word(text) {
      const handle = await frame.evaluateHandle((t) => {
        const words = [
          ...document.querySelectorAll("z-orig > span"),
          ...[...document.querySelectorAll("z-tag")].filter((z) => !z.querySelector("z-tag, z-orig")),
        ];
        // In the article, the body text, not the title (words can be in both).
        const matches = words.filter((w) => w.textContent.trim().startsWith(t));
        return matches.find((w) => !w.closest("h1, h2, h3")) || matches[0] || null;
      }, text);
      if (!handle.asElement()) throw new Error(`word "${text}" not found`);
      return handle;
    },
    async tapWord(text, { quiet = false } = {}) {
      await tap(page, await tools.word(text), { quiet });
    },
    async tapSelector(selector) {
      const handle = await frame.$(selector);
      if (!handle) throw new Error(`no element for ${selector}`);
      await tap(page, handle);
    },
    async tapText(text) {
      const handle = await frame.evaluateHandle((t) => {
        const all = [...document.querySelectorAll("button, [role=button], div, span")];
        return all.find((el) => el.children.length === 0 && el.textContent.trim() === t) || null;
      }, text);
      if (!handle.asElement()) throw new Error(`text "${text}" not found`);
      await tap(page, handle);
    },
  };
  return tools;
}

async function loadScene(page, scene) {
  await page.evaluate(
    (title, sub, src) => {
      document.getElementById("title").innerHTML = title
        .replace(/\*(.+?)\*/g, "<em>$1</em>")
        .replace(/\|/g, "<br>");
      document.getElementById("sub").textContent = sub;
      document.getElementById("app").src = src;
    },
    scene.title,
    scene.sub,
    scene.src,
  );
  await pause(600);
  await page.waitForNetworkIdle({ idleTime: 800, timeout: 30000 }).catch(() => {});
  const frame = await appFrame(page);
  await frame.addStyleTag({ content: HIDE_WEB_CHROME });
  // The exercise screen shows its component name as a small debug label.
  await frame.evaluate(() => {
    for (const el of document.querySelectorAll("*")) {
      if (el.children.length === 0 && /^(MultipleChoice\w*|Match)$/.test(el.textContent.trim())) {
        el.style.display = "none";
      }
    }
  });
  await pause(2500);
  return frame;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const clipsDir = path.join(OUT_DIR, `clips-${lang}`);
  fs.rmSync(clipsDir, { recursive: true, force: true });
  fs.mkdirSync(clipsDir, { recursive: true });

  const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setViewport({ width: VIEW.width, height: VIEW.height, deviceScaleFactor: VIEW.scale });
  await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: "light" }]);
  await page.setRequestInterception(true);
  // The lesson starts from the beginning: resuming a paused one makes the
  // progress bar jump back when play is pressed.
  const overrides = {
    user_article: withoutLookups(ARTICLE_CONTENT),
    // The article the video opens comes right after the first story, so
    // the eye is already on it when it is tapped.
    "user_articles/recommended*": withoutLookups([
      RECOMMENDED_ARTICLES[0],
      ...RECOMMENDED_ARTICLES.filter((a) => a.id === ARTICLE_CONTENT.id),
      ...RECOMMENDED_ARTICLES.slice(1).filter((a) => a.id !== ARTICLE_CONTENT.id),
    ]),
    [`translate_word/${lang}/en`]: translateWord,
    get_todays_lesson: { ...TODAYS_LESSON, pause_position_seconds: 0, is_paused: false, listened_count: 0 },
  };
  setupRequestInterception(page, overrides, { [FRAME_PATH]: FRAME_HTML });
  await page.setCookie({
    name: "sessionID",
    value: "mock-session-screenshot",
    domain: new URL(BASE_URL).hostname,
    path: "/",
  });
  await page.goto(`${BASE_URL}${FRAME_PATH}`, { waitUntil: "load" });

  const clips = [];
  let recorder;
  const startClip = async () => {
    const clip = path.join(clipsDir, `clip-${clips.length + 1}.webm`);
    clips.push(clip);
    recorder = await page.screencast({ path: clip });
    await pause(300);
  };
  const rec = {
    async cut(prepare) {
      await recorder.stop();
      await prepare();
      await startClip();
    },
  };
  for (const [i, scene] of scenes.entries()) {
    console.log(`scene ${i + 1}: ${scene.src}`);
    const frame = await loadScene(page, scene);
    const tools = sceneTools(page, frame, rec);
    if (scene.before) await scene.before(tools);
    await startClip();
    await scene.act(tools);
    await recorder.stop();
  }
  await browser.close();

  // Normalize each clip to 886×1920 at 30 fps, add the end card, join.
  const parts = [];
  for (const [i, clip] of clips.entries()) {
    const out = path.join(clipsDir, `part-${i + 1}.mp4`);
    execFileSync("ffmpeg", [
      "-y", "-loglevel", "error", "-i", clip,
      "-vf", "scale=886:1920:flags=lanczos,fps=30,format=yuv420p",
      "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-an", out,
    ]);
    parts.push(out);
  }
  const endCard = path.join(clipsDir, "part-end.mp4");
  execFileSync("ffmpeg", [
    "-y", "-loglevel", "error", "-loop", "1", "-t", "2.5", "-i", START_NOW,
    "-vf", "scale=886:1920:force_original_aspect_ratio=increase,crop=886:1920,fps=30,format=yuv420p",
    "-c:v", "libx264", "-preset", "slow", "-crf", "18", endCard,
  ]);
  parts.push(endCard);

  // Join with short cross-fades: each xfade starts FADE s before the end of
  // what has been joined so far.
  const FADE = 0.3;
  const duration = (f) =>
    Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString());
  let filter = "";
  let prev = "[0:v]";
  let offset = 0;
  parts.forEach((part, i) => {
    if (i === 0) return;
    offset += duration(parts[i - 1]) - FADE;
    const label = i === parts.length - 1 ? "[v]" : `[x${i}]`;
    filter += `${prev}[${i}:v]xfade=transition=fade:duration=${FADE}:offset=${offset.toFixed(3)}${label};`;
    prev = label;
  });
  const out = path.join(OUT_DIR, `preview-${lang}.mp4`);
  // App Store previews need an audio track; a silent one is fine.
  execFileSync("ffmpeg", [
    "-y", "-loglevel", "error",
    ...parts.flatMap((p) => ["-i", p]),
    "-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=44100",
    "-filter_complex", filter.replace(/;$/, ""),
    "-map", "[v]", "-map", `${parts.length}:a`,
    "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-r", "30",
    "-c:a", "aac", "-shortest", `${out}.tmp.mp4`,
  ]);
  // Replaced by rename: a player that has the old file open keeps it intact.
  fs.renameSync(`${out}.tmp.mp4`, out);
  const secs = execFileSync("ffprobe", [
    "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", out,
  ]).toString().trim();
  console.log(`→ ${path.relative(__dirname, out)} (${Number(secs).toFixed(1)} s)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
