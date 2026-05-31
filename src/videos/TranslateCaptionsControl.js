import { useContext, useEffect, useRef, useState } from "react";
import { APIContext } from "../contexts/APIContext";

// Status values the server can return on a CaptionTranslationSet.
const STATUS_PENDING = "pending";
const STATUS_TRANSLATING = "translating";
const STATUS_READY = "ready";
const STATUS_ERROR = "error";

const POLL_INTERVAL_MS = 2000;
const PERSIST_KEY = (videoId) => `zeeguu_video_caption_pref_${videoId}`;

/**
 * The single UI control for v1.5's translated-subtitles feature.
 *
 * Lifecycle, given a video in a language different from the learner's:
 *  1. Renders an "offer" banner with a Translate button until the user opts in.
 *  2. On opt-in: requests the translation, then polls the status endpoint.
 *  3. Once `ready`: renders an Original / Translated pill switcher and emits
 *     `onTrackChange(captionSetId | null)` so the parent re-fetches the
 *     video info with the right caption track.
 *
 * Track preference is persisted per-video in localStorage; on mount, if the
 * user previously chose `translated`, we kick off a (server-side idempotent)
 * request so the set is restored without a second click.
 */
export default function TranslateCaptionsControl({
  videoId,
  sourceLanguageCode,
  targetLanguageCode,
  targetCefr,
  onTrackChange,
}) {
  const api = useContext(APIContext);

  const [captionSetId, setCaptionSetId] = useState(null);
  const [status, setStatus] = useState(null); // null | pending | translating | ready | error
  const [error, setError] = useState(null);
  const [activeTrack, setActiveTrack] = useState("original"); // "original" | "translated"
  const pollTimerRef = useRef(null);

  // Restore the user's last choice for this video. We only auto-request when the saved
  // preference was "translated"; the original-track default needs no extra work.
  useEffect(() => {
    if (!videoId) return;
    const saved =
      typeof window !== "undefined" ? window.localStorage.getItem(PERSIST_KEY(videoId)) : null;
    if (saved === "translated") {
      requestTranslation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  useEffect(() => {
    return () => {
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    };
  }, []);

  function persistChoice(choice) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(PERSIST_KEY(videoId), choice);
    } catch (_) {
      /* localStorage can be unavailable in private modes; non-fatal. */
    }
  }

  function pollUntilReady(setId) {
    if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    pollTimerRef.current = setTimeout(() => {
      api.pollCaptionTranslationStatus(videoId, setId, (info) => {
        setStatus(info.status);
        if (info.status === STATUS_READY) {
          setCaptionSetId(setId);
          setActiveTrack("translated");
          persistChoice("translated");
          onTrackChange(setId);
        } else if (info.status === STATUS_ERROR) {
          setError(info.error_message || "Translation failed.");
        } else {
          pollUntilReady(setId);
        }
      });
    }, POLL_INTERVAL_MS);
  }

  function requestTranslation() {
    setError(null);
    setStatus(STATUS_PENDING);
    api.requestCaptionTranslation(
      videoId,
      targetLanguageCode,
      targetCefr,
      (info) => {
        setStatus(info.status);
        if (info.status === STATUS_READY) {
          setCaptionSetId(info.id);
          setActiveTrack("translated");
          persistChoice("translated");
          onTrackChange(info.id);
        } else if (info.status === STATUS_ERROR) {
          setError(info.error_message || "Translation failed.");
        } else {
          pollUntilReady(info.id);
        }
      },
      (e) => {
        setStatus(STATUS_ERROR);
        setError(typeof e === "string" ? e : e?.message || "Could not start translation.");
      },
    );
  }

  function switchTo(track) {
    if (track === activeTrack) return;
    setActiveTrack(track);
    persistChoice(track);
    onTrackChange(track === "translated" ? captionSetId : null);
  }

  // ── Render branches ─────────────────────────────────────────────────────
  if (status === STATUS_PENDING || status === STATUS_TRANSLATING) {
    return (
      <div style={bannerStyle}>
        <span>
          Translating subtitles to {targetLanguageCode.toUpperCase()} ({targetCefr})… this can take
          ~30 seconds.
        </span>
      </div>
    );
  }

  if (status === STATUS_ERROR) {
    return (
      <div style={bannerStyle}>
        <span>Translation failed{error ? `: ${error}` : "."}</span>
        <button style={buttonStyle} onClick={requestTranslation}>
          Try again
        </button>
      </div>
    );
  }

  // Translation is ready (or restored from a previous session) → show the pill switcher.
  if (captionSetId != null) {
    return (
      <div style={bannerStyle}>
        <span style={{ fontSize: "0.9em", color: "#555" }}>Subtitles:</span>
        <button
          style={pillStyle(activeTrack === "original")}
          onClick={() => switchTo("original")}
        >
          Original ({sourceLanguageCode})
        </button>
        <button
          style={pillStyle(activeTrack === "translated")}
          onClick={() => switchTo("translated")}
        >
          Translated ({targetLanguageCode}, {targetCefr})
        </button>
      </div>
    );
  }

  // Default: offer to translate.
  return (
    <div style={bannerStyle}>
      <span>
        Captions are in <strong>{sourceLanguageCode}</strong>. Translate to{" "}
        <strong>
          {targetLanguageCode} ({targetCefr})
        </strong>
        ?
      </span>
      <button style={buttonStyle} onClick={requestTranslation}>
        Translate subtitles
      </button>
    </div>
  );
}

// ── Inline styles ─────────────────────────────────────────────────────────
// Kept inline (vs. a styled-components file) to keep this v1.5 patch small and reviewable.
// If/when this banner stays, lift these into VideoPlayer.sc alongside the existing styles.
const bannerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.75em",
  padding: "0.6em 1em",
  margin: "0.5em 0",
  background: "#f6f3ec",
  border: "1px solid #e6dec9",
  borderRadius: "6px",
  fontSize: "0.95em",
  flexWrap: "wrap",
};
const buttonStyle = {
  padding: "0.4em 0.9em",
  border: "1px solid #c9a96e",
  background: "#fff",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: 600,
};
const pillStyle = (active) => ({
  padding: "0.3em 0.8em",
  border: "1px solid #c9a96e",
  background: active ? "#c9a96e" : "#fff",
  color: active ? "#fff" : "#333",
  borderRadius: "999px",
  cursor: "pointer",
  fontSize: "0.85em",
});
