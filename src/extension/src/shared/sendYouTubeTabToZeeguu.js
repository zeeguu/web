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
          video_unique_key: videoId,
          language: lang,
          captions: segments,
        };
      }
    }

    // No capture yet. Prompt the user to enable CC -- once YouTube's player
    // fetches the caption track, the patch will store it and the next
    // share-click will succeed.
    return {
      error:
        "Please turn on subtitles in the YouTube player (CC button) for this video, then click Zeeguu again. (YouTube's anti-scraping means we have to catch the captions as the player loads them.)",
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

async function scrapeYouTubeTab(tab, preferredLanguage) {
  let results;
  try {
    results = await BROWSER_API.scripting.executeScript({
      target: { tabId: tab.id },
      func: extractYouTubeCaptionsInPage,
      args: [preferredLanguage || null],
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
      "Scraper threw in MAIN world: " +
        (injection.error.message || JSON.stringify(injection.error)),
    );
  }
  const data = injection.result;
  if (!data) {
    throw new Error("Scraper returned no data.");
  }
  if (data.error) {
    throw new Error(data.error);
  }
  return data;
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
