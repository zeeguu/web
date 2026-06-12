import { BROWSER_API } from "../utils/browserApi";

// Runs entirely in YouTube's MAIN world. Must stay synchronous because
// chrome.scripting in MV3 does not reliably await async returns across the
// MAIN-world boundary -- the result comes back as null.
//
// YouTube's /api/timedtext now requires a one-shot PO Token we can't
// reproduce. So we *don't* fetch the captions ourselves any more; we read
// them from `window.__zeeguuCapturedCaptions`, populated by the content
// script youtubeContentScript.js + the MAIN-world patch youtubePatch.js
// the moment YouTube's player fetches captions itself (i.e. once the user
// turns CC on).
function extractYouTubeCaptionsInPage(preferredLanguage) {
  try {
    let playerResponse = null;
    try {
      const player = document.querySelector("#movie_player");
      if (player && typeof player.getPlayerResponse === "function") {
        playerResponse = player.getPlayerResponse();
      }
    } catch (e) {
      /* fall through to global */
    }
    if (!playerResponse) {
      playerResponse = window.ytInitialPlayerResponse;
    }
    if (!playerResponse) {
      return {
        error: "Could not read YouTube player data. Wait for the player to load and try again.",
      };
    }

    const videoId = playerResponse?.videoDetails?.videoId;
    if (!videoId) {
      return { error: "Could not determine YouTube video ID." };
    }

    const tracks =
      playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks ||
      [];
    if (tracks.length === 0) {
      return { error: "This video has no captions." };
    }

    const wantedLang = (preferredLanguage || "").toLowerCase();
    const tracksInLang = wantedLang
      ? tracks.filter((t) => (t.languageCode || "").toLowerCase() === wantedLang)
      : tracks;
    if (wantedLang && tracksInLang.length === 0) {
      const avail = [...new Set(tracks.map((t) => t.languageCode))].join(", ");
      return {
        error: `This video has no captions in your learning language (${preferredLanguage}). Available: ${avail}`,
      };
    }

    // Look up captured captions for this video + language. The youtubePatch
    // content script populates `window.__zeeguuCapturedCaptions[videoId:lang]`
    // when YouTube's own player fetches captions (i.e. after user enables CC).
    const captured = window.__zeeguuCapturedCaptions || {};
    const langsToTry = wantedLang
      ? [wantedLang]
      : tracksInLang.map((t) => (t.languageCode || "").toLowerCase());

    for (const lang of langsToTry) {
      const segments = captured[videoId + ":" + lang];
      if (segments && segments.length > 0) {
        return {
          captured: true,
          video_unique_key: videoId,
          language: lang,
          captions: segments,
        };
      }
    }

    // A caption track exists in the learning language but YouTube hasn't
    // fetched it yet. Signal the caller to trigger a load (and restore the
    // user's caption state afterwards) -- see scrapeYouTubeTab.
    return {
      captured: false,
      video_unique_key: videoId,
      language: langsToTry[0],
    };
  } catch (e) {
    return {
      error:
        "MAIN-world scraper threw: " +
        (e && (e.message || String(e))) +
        (e && e.stack ? " | stack: " + String(e.stack).slice(0, 200) : ""),
    };
  }
}

// Runs in the MAIN world. Forces YouTube's player to load the learning-
// language caption track so its /api/timedtext fetch fires (and youtubePatch.js
// captures it). Snapshots the user's current caption state onto `window` first
// so zeeguuRestoreCaptionState() can put it back -- we don't want to leave
// captions on if the user didn't have them on. Stays synchronous (see the
// note atop this file); the caller polls zeeguuReadCaptured for the result.
function zeeguuTriggerCaptionLoad(langCode) {
  try {
    const wantLang = (langCode || "").toLowerCase();
    const player = document.querySelector("#movie_player");
    const hasApi =
      player &&
      typeof player.getOption === "function" &&
      typeof player.setOption === "function";

    // Snapshot current track so we can restore it ({} == captions off).
    let prevTrack = null;
    if (hasApi) {
      try {
        prevTrack = player.getOption("captions", "track");
      } catch (e) {
        /* ignore */
      }
    }
    window.__zeeguuPrevTrack =
      prevTrack && Object.keys(prevTrack).length ? prevTrack : {};

    // Preferred: select the exact learning-language track via the player API,
    // so we capture the right language even if the user's default caption
    // language differs.
    if (hasApi) {
      try {
        let list = player.getOption("captions", "tracklist") || [];
        if (!list.length) {
          try {
            player.loadModule("captions");
          } catch (e) {
            /* ignore */
          }
          list = player.getOption("captions", "tracklist") || [];
        }
        const track = list.find(
          (t) => (t.languageCode || "").toLowerCase() === wantLang,
        );
        if (track) {
          player.setOption("captions", "track", track);
          window.__zeeguuTriggerMethod = "api";
          return { ok: true, method: "api" };
        }
      } catch (e) {
        /* fall through to button */
      }
    }

    // Fallback: click the CC button (toggles the last-used track on).
    const btn = document.querySelector(".ytp-subtitles-button");
    if (btn) {
      const wasOn = btn.getAttribute("aria-pressed") === "true";
      window.__zeeguuClickedOn = !wasOn;
      window.__zeeguuTriggerMethod = "button";
      if (!wasOn) btn.click();
      return { ok: true, method: "button" };
    }
    return { ok: false, reason: "no-player-controls" };
  } catch (e) {
    return { ok: false, reason: String((e && e.message) || e) };
  }
}

// MAIN world. Returns captured segments for this video+language, or null.
function zeeguuReadCaptured(videoId, langCode) {
  const captured = window.__zeeguuCapturedCaptions || {};
  const segs = captured[videoId + ":" + (langCode || "").toLowerCase()];
  return segs && segs.length ? segs : null;
}

// MAIN world. Undoes whatever zeeguuTriggerCaptionLoad did, so the user's
// captions end up exactly as they were before the share.
function zeeguuRestoreCaptionState() {
  try {
    if (window.__zeeguuTriggerMethod === "button") {
      if (window.__zeeguuClickedOn) {
        const btn = document.querySelector(".ytp-subtitles-button");
        if (btn && btn.getAttribute("aria-pressed") === "true") btn.click();
        window.__zeeguuClickedOn = false;
      }
    } else if (window.__zeeguuTriggerMethod === "api") {
      const player = document.querySelector("#movie_player");
      if (player && typeof player.setOption === "function") {
        player.setOption("captions", "track", window.__zeeguuPrevTrack || {});
      }
    }
  } catch (e) {
    /* ignore */
  } finally {
    window.__zeeguuTriggerMethod = null;
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runInPage(tabId, func, args) {
  let results;
  try {
    results = await BROWSER_API.scripting.executeScript({
      target: { tabId },
      func,
      args: args || [],
      world: "MAIN",
    });
  } catch (e) {
    throw new Error("chrome.scripting.executeScript threw: " + (e?.message || e));
  }
  if (!results || results.length === 0) {
    throw new Error("chrome.scripting returned no injection results.");
  }
  const injection = results[0];
  if (injection.error) {
    throw new Error(
      "MAIN world threw: " +
        (injection.error.message || JSON.stringify(injection.error)),
    );
  }
  return injection.result;
}

async function scrapeYouTubeTab(tab, preferredLanguage) {
  const initial = await runInPage(tab.id, extractYouTubeCaptionsInPage, [
    preferredLanguage || null,
  ]);
  if (!initial) throw new Error("Scraper returned no data.");
  if (initial.error) throw new Error(initial.error);
  if (initial.captured) {
    return {
      video_unique_key: initial.video_unique_key,
      language: initial.language,
      captions: initial.captions,
    };
  }

  // Captions exist in the learning language but YouTube hasn't fetched them.
  // Force the player to load that track, wait for youtubePatch.js to capture
  // it, then restore the user's caption state regardless of the outcome.
  const { video_unique_key: videoId, language: lang } = initial;
  let captions = null;
  try {
    const trigger = await runInPage(tab.id, zeeguuTriggerCaptionLoad, [lang]);
    if (trigger && trigger.ok) {
      for (let i = 0; i < 24; i++) {
        await delay(250);
        captions = await runInPage(tab.id, zeeguuReadCaptured, [videoId, lang]);
        if (captions) break;
      }
    }
  } finally {
    try {
      await runInPage(tab.id, zeeguuRestoreCaptionState, []);
    } catch (e) {
      /* best-effort restore */
    }
  }

  if (!captions) {
    throw new Error(
      "Couldn't read this video's subtitles. Turn on the CC button in the YouTube player, then click Zeeguu again.",
    );
  }
  return { video_unique_key: videoId, language: lang, captions };
}

export async function sendYouTubeTabToZeeguu(api, tab, preferredLanguage) {
  const scraped = await scrapeYouTubeTab(tab, preferredLanguage);
  const result = await new Promise((resolve, reject) =>
    api.createVideoUpload(
      {
        url: tab.url,
        video_unique_key: scraped.video_unique_key,
        language: scraped.language,
        captions: scraped.captions,
      },
      resolve,
      reject,
    ),
  );
  return result; // { video_id, video_unique_key }
}

export function isYouTubeTab(tab) {
  if (!tab?.url) return false;
  // Match watch / shorts / embed / live and the youtu.be short-link host.
  // `watch` requires the `?` so `youtube.com/watching/...` doesn't match.
  return /^https?:\/\/(?:[a-z0-9-]+\.)?(youtube\.com\/(watch\?|shorts\/|embed\/|live\/)|youtu\.be\/)/i.test(
    tab.url,
  );
}
