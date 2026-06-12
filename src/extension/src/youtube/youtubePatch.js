// Runs in YouTube's MAIN world. Injected by youtubeContentScript.js as a
// <script src=...> tag (a content script in ISOLATED world can't reach the
// MAIN-world `fetch` / `XMLHttpRequest` it needs to wrap).
//
// Why this exists: YouTube's `/api/timedtext` endpoint now requires a one-shot
// PO Token (Proof of Origin Token) computed by YouTube's BotGuard JS. We can't
// reproduce it. But once the player itself makes a successful caption fetch,
// the response body IS available in the page -- we just have to intercept it.
// That's what this patch does.
(function () {
  if (window.__zeeguuPatchInstalled) return;
  window.__zeeguuPatchInstalled = true;
  const TIMEDTEXT_API_PATH = "/api/timedtext";
  // Keyed by `${videoId}:${langCode}` so SPA-navigation between videos doesn't
  // confuse different videos' captions with the same language.
  window.__zeeguuCapturedCaptions = window.__zeeguuCapturedCaptions || {};

  function parseSegments(text) {
    if (!text) return null;

    // JSON3 (YouTube's current default). trim() guards against leading
    // whitespace or BOMs that would slip past a bare startsWith check.
    if (text.trim().startsWith("{")) {
      try {
        const data = JSON.parse(text);
        const events = data && data.events;
        if (!Array.isArray(events)) return null;
        const out = [];
        for (const ev of events) {
          if (!ev || !ev.segs) continue;
          const start = ev.tStartMs || 0;
          const dur = ev.dDurationMs || 0;
          const segText = ev.segs.map((s) => s.utf8 || "").join("").trim();
          if (!segText) continue;
          out.push({
            time_start: start,
            time_end: start + dur,
            text: segText,
          });
        }
        return out;
      } catch (e) {
        return null;
      }
    }

    // srv1 / simple-XML fallback (only hit if YouTube returns XML).
    const out = [];
    const re = /<text\b([^>]*)>([\s\S]*?)<\/text>/g;
    let m;
    while ((m = re.exec(text)) !== null) {
      const startMatch = /\bstart="([^"]+)"/.exec(m[1]);
      const durMatch = /\bdur="([^"]+)"/.exec(m[1]);
      const start = parseFloat(startMatch ? startMatch[1] : "0");
      const dur = parseFloat(durMatch ? durMatch[1] : "0");
      const decoded = m[2]
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&apos;/g, "'")
        .replace(/&#(\d+);/g, (_, c) => String.fromCharCode(parseInt(c, 10)))
        .trim();
      if (!decoded) continue;
      out.push({
        time_start: Math.round(start * 1000),
        time_end: Math.round((start + dur) * 1000),
        text: decoded,
      });
    }
    return out;
  }

  function capture(url, text) {
    if (!text || text.length < 30) return;
    let videoId = "";
    let lang = "";
    try {
      const u = new URL(url, location.origin);
      videoId = u.searchParams.get("v") || "";
      lang = (u.searchParams.get("lang") || "").toLowerCase();
    } catch (e) {
      return;
    }
    if (!videoId || !lang) return;
    const segments = parseSegments(text);
    if (!segments || segments.length === 0) return;
    window.__zeeguuCapturedCaptions[videoId + ":" + lang] = segments;
  }

  // --- fetch wrap ---
  const origFetch = window.fetch;
  window.fetch = function (input, init) {
    const url = typeof input === "string" ? input : input && input.url;
    const result = origFetch.call(this, input, init);
    if (url && url.indexOf(TIMEDTEXT_API_PATH) !== -1) {
      result
        .then((resp) => {
          if (!resp || !resp.ok) return;
          resp.clone().text().then((t) => capture(url, t)).catch(() => {});
        })
        .catch(() => {});
    }
    return result;
  };

  // --- XHR wrap ---
  const origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url) {
    this.__zeeguuUrl = url;
    return origOpen.apply(this, arguments);
  };
  const origSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function () {
    const xhr = this;
    const url = xhr.__zeeguuUrl;
    if (url && typeof url === "string" && url.indexOf(TIMEDTEXT_API_PATH) !== -1) {
      xhr.addEventListener("load", function () {
        try {
          capture(url, xhr.responseText);
        } catch (e) {
          /* ignore */
        }
      });
    }
    return origSend.apply(this, arguments);
  };

  // --- Caption-availability probe ---------------------------------------
  // Reports the video's available caption languages to the ISOLATED-world
  // content script (which relays them to the background to drive the toolbar
  // "viewable in Zeeguu" badge). This is a READ-ONLY look at the player's
  // caption track list -- it never selects or enables a track, so the user
  // sees nothing.
  function readCaptionLanguages() {
    try {
      let pr = null;
      const player = document.querySelector("#movie_player");
      if (player && typeof player.getPlayerResponse === "function") {
        pr = player.getPlayerResponse();
      }
      if (!pr) pr = window.ytInitialPlayerResponse;
      const videoId = (pr && pr.videoDetails && pr.videoDetails.videoId) || "";
      const tracks =
        (pr &&
          pr.captions &&
          pr.captions.playerCaptionsTracklistRenderer &&
          pr.captions.playerCaptionsTracklistRenderer.captionTracks) ||
        [];
      const languages = [
        ...new Set(
          tracks.map((t) => (t.languageCode || "").toLowerCase()).filter(Boolean),
        ),
      ];
      return { videoId, languages };
    } catch (e) {
      return { videoId: "", languages: [] };
    }
  }

  // The player response isn't ready the instant a navigation finishes, so we
  // retry a few times until a videoId shows up (or give up quietly).
  function probeCaptions() {
    let attempts = 0;
    const tick = () => {
      attempts += 1;
      const { videoId, languages } = readCaptionLanguages();
      if (videoId) {
        window.postMessage(
          { source: "zeeguu-ext", type: "ZEEGUU_YT_CAPTIONS", videoId, languages },
          location.origin,
        );
        return;
      }
      if (attempts < 10) setTimeout(tick, 500);
    };
    tick();
  }

  // YouTube is a SPA: `yt-navigate-finish` fires on every in-app navigation.
  // Also probe once for the initial (hard) page load.
  document.addEventListener("yt-navigate-finish", probeCaptions);
  if (document.readyState === "loading") {
    window.addEventListener("load", probeCaptions);
  } else {
    probeCaptions();
  }
})();
