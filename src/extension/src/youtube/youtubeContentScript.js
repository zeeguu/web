// Runs at document_start on youtube.com tabs (ISOLATED world). Its only job
// is to inject youtubePatch.js into the page's MAIN world so the patch's
// monkey-wraps see the same `fetch` / `XMLHttpRequest` that YouTube's player
// uses. Loading from `web_accessible_resources` bypasses YouTube's CSP, which
// would otherwise reject an inline <script> tag.
//
// It also relays the patch's caption-availability probes to the background
// (the MAIN world has no chrome.* access).
(function () {
  try {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("youtubePatch.js");
    script.async = false;
    (document.head || document.documentElement).prepend(script);
    // Once injected and evaluated, we can drop the tag -- the patch lives on
    // `window` for the rest of the page's life.
    script.onload = () => script.remove();
  } catch (e) {
    console.error("Zeeguu youtube patch injection failed:", e);
  }
})();

// Relay caption-language probes from the MAIN-world patch to the background,
// which compares them against the user's learning language and sets the
// toolbar badge.
window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  const data = event.data;
  if (!data || data.source !== "zeeguu-ext" || data.type !== "ZEEGUU_YT_CAPTIONS") {
    return;
  }
  try {
    chrome.runtime.sendMessage({
      type: "ZEEGUU_YT_CAPTIONS",
      videoId: data.videoId,
      languages: data.languages,
    });
  } catch (e) {
    // The service worker may be asleep; the patch re-probes on the next nav.
  }
});
