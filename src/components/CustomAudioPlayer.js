import React, { useEffect, useRef, useState } from "react";
import { zeeguuOrange } from "./colors";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";
import SkipPreviousRoundedIcon from "@mui/icons-material/SkipPreviousRounded";
import Replay10RoundedIcon from "@mui/icons-material/Replay10Rounded";
import Forward10RoundedIcon from "@mui/icons-material/Forward10Rounded";
import SpeedPicker from "./SpeedPicker";
import { loadSpeed, saveSpeed } from "./audioSpeeds";
import { NativeAudioElement, nativeAudioAvailable } from "./nativeAudio";
import onAppResume from "../utils/misc/onAppResume";

const SEEK_SECONDS = 10;

// Minimal icon-only nav button: no circle, no fill — just the icon coloured
// by the global orange. Used by the rewind / skip-back / skip-forward
// controls so they read as secondary actions to the centered play button.
function IconNavButton({ onClick, disabled, ariaLabel, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      style={{
        background: "transparent",
        border: "none",
        padding: 0,
        color: disabled ? "#ccc" : "var(--player-icon-color)",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "transform 0.2s ease",
      }}
      onMouseDown={(e) => {
        if (!disabled) e.currentTarget.style.transform = "scale(0.9)";
      }}
      onMouseUp={(e) => {
        if (!disabled) e.currentTarget.style.transform = "scale(1)";
      }}
      onMouseLeave={(e) => {
        if (!disabled) e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {children}
    </button>
  );
}

export default function CustomAudioPlayer({
  src,
  onPlay,
  onPause,
  onEnded,
  onError,
  onProgressUpdate,
  initialProgress = 0,
  style,
  language,
  title = "Audio Lesson",
  artist = "Zeeguu",
  autoPlay = false,
  children,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  // AppLayout keys the page on the learned language, so a language that
  // arrives or changes remounts the player: the initial load is enough.
  const [playbackRate, setPlaybackRate] = useState(() => loadSpeed(language));
  const audioRef = useRef(null);
  // On iOS the native player stands in for <audio> (see nativeAudio.js); it
  // also owns the lock screen, so the web MediaSession stays out of the way.
  const [nativeAudio] = useState(() => (nativeAudioAvailable() ? new NativeAudioElement() : null));
  if (nativeAudio) audioRef.current = nativeAudio;
  const useWebMediaSession = !nativeAudio && "mediaSession" in navigator;
  const progressTimerRef = useRef(null);
  const lastSavedProgressRef = useRef(0);

  // Parents pass inline callbacks, so these change on every render. Handlers
  // registered once (element events, the progress timer) read them through
  // this ref; listing them as effect deps tore the listeners and the progress
  // timer down on every parent re-render.
  const callbacksRef = useRef({});
  callbacksRef.current = { onPlay, onPause, onEnded, onError, onProgressUpdate };

  // For handlers registered once (lock screen, visibility) that need the
  // current rate, not the one from when they were registered.
  const playbackRateRef = useRef(playbackRate);
  playbackRateRef.current = playbackRate;
  // The one place that writes the rate to the element. defaultPlaybackRate too:
  // loading a new src resets playbackRate to it.
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.defaultPlaybackRate = playbackRate;
      audio.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  useEffect(() => {
    if (nativeAudio) nativeAudio.src = src || "";
  }, [nativeAudio, src]);

  useEffect(() => {
    if (!nativeAudio) return;
    nativeAudio.setMetadata({
      title,
      artist,
      album: language ? `${language.toUpperCase()} Lessons` : "Language Lessons",
    });
  }, [nativeAudio, title, artist, language]);

  // Leaving the page stops the lesson, as removing an <audio> element does.
  useEffect(() => () => nativeAudio && nativeAudio.destroy(), [nativeAudio]);

  // Some WebViews reset the rate on load or play regardless; put the chosen
  // speed back rather than adopting whatever the element reports.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const reapply = () => {
      const rate = playbackRateRef.current;
      if (audio.defaultPlaybackRate !== rate) audio.defaultPlaybackRate = rate;
      if (audio.playbackRate !== rate) audio.playbackRate = rate;
    };
    audio.addEventListener("loadedmetadata", reapply);
    audio.addEventListener("play", reapply);
    return () => {
      audio.removeEventListener("loadedmetadata", reapply);
      audio.removeEventListener("play", reapply);
    };
  }, []);

  // Set up Media Session API for lock screen controls.
  // Only the currently-playing player owns navigator.mediaSession (it's a
  // singleton), so we gate on isPlaying — otherwise 10 cards in a list each
  // set metadata on mount and re-fetch the artwork. Position state lives in
  // its own effect below so currentTime updates don't rebuild the metadata.
  useEffect(() => {
    if (!useWebMediaSession) return;
    if (!isPlaying) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: title,
      artist: artist,
      album: language ? `${language.toUpperCase()} Lessons` : "Language Lessons",
      artwork: [
        { src: "/logo192.png", sizes: "192x192", type: "image/png" },
        { src: "/logo512.png", sizes: "512x512", type: "image/png" },
        { src: "/static/images/zeeguu128.png", sizes: "128x128", type: "image/png" },
      ],
    });

    // Headset / lock-screen play and pause. The player's state follows the
    // element's own play/pause events, so a play() that iOS refuses doesn't
    // leave the player believing it's playing (the next press would then be
    // taken as "already playing" and do nothing).
    navigator.mediaSession.setActionHandler("play", () => {
      const audio = audioRef.current;
      if (!audio || !audio.paused) return;
      audio.play().catch((err) => console.error("Playback from media controls failed:", err));
    });

    navigator.mediaSession.setActionHandler("pause", () => {
      const audio = audioRef.current;
      if (audio && !audio.paused) audio.pause(); // handlePause follows from the 'pause' event
    });

    // Try different action handlers that iOS might recognize
    try {
      navigator.mediaSession.setActionHandler("previoustrack", () => {
        seekBackward();
      });

      navigator.mediaSession.setActionHandler("nexttrack", () => {
        seekForward();
      });
    } catch (error) {
      console.log("Track controls not supported");
    }

    navigator.mediaSession.setActionHandler("seekbackward", (details) => {
      const audio = audioRef.current;
      if (!audio) return;

      // iOS typically uses 10 or 15 second intervals
      const offset = details?.seekOffset || 10;
      const newTime = Math.max(0, audio.currentTime - offset);
      audio.currentTime = newTime;
      setCurrentTime(newTime);

      // Update position state immediately
      if ("setPositionState" in navigator.mediaSession && duration > 0) {
        navigator.mediaSession.setPositionState({
          duration: duration,
          playbackRate: playbackRateRef.current,
          position: newTime,
        });
      }
    });

    navigator.mediaSession.setActionHandler("seekforward", (details) => {
      const audio = audioRef.current;
      if (!audio) return;

      // iOS typically uses 10 or 15 second intervals
      const offset = details?.seekOffset || 10;
      const newTime = Math.min(duration, audio.currentTime + offset);
      audio.currentTime = newTime;
      setCurrentTime(newTime);

      // Update position state immediately
      if ("setPositionState" in navigator.mediaSession && duration > 0) {
        navigator.mediaSession.setPositionState({
          duration: duration,
          playbackRate: playbackRateRef.current,
          position: newTime,
        });
      }
    });

    navigator.mediaSession.setActionHandler("seekto", (details) => {
      const audio = audioRef.current;
      if (audio && details.seekTime !== undefined) {
        audio.currentTime = details.seekTime;
        setCurrentTime(details.seekTime);
      }
    });

    navigator.mediaSession.playbackState = "playing";

    // Cleanup intentionally does NOT null action handlers. iOS only renders
    // lock-screen seek/play buttons while their handlers are registered, and
    // routes taps through them. Nulling on every pause meant the buttons went
    // inert as soon as the user paused once. The next player to start playing
    // will overwrite handlers on its own play transition; on unmount the
    // stale handlers reference a null audioRef and no-op safely.
    return () => {
      if (useWebMediaSession && navigator.mediaSession) {
        navigator.mediaSession.playbackState = "paused";
      }
    };
  }, [title, artist, language, isPlaying]);

  // Position state for the lock-screen progress bar. Separate from the
  // metadata effect so currentTime updates don't trigger an artwork refetch.
  useEffect(() => {
    if (!useWebMediaSession) return;
    if (!isPlaying) return;
    if (!("setPositionState" in navigator.mediaSession)) return;
    if (duration <= 0) return;
    navigator.mediaSession.setPositionState({
      duration: duration,
      playbackRate: playbackRate,
      position: currentTime,
    });
  }, [isPlaying, duration, currentTime, playbackRate]);

  // Handle visibility changes to keep playback going. No AudioContext here: an
  // idle one holds no audio session, and closing it on pause (as this once
  // did) broke headset play after a headset pause on iOS.
  useEffect(() => {
    // Handle visibility changes to maintain audio playback
    const handleVisibilityChange = () => {
      const audio = audioRef.current;
      if (!audio) return;

      if (document.hidden) {
        // Page is hidden (locked screen or switched apps)
        console.log("Page hidden, audio playing:", !audio.paused);
      } else {
        // Page is visible again
        console.log("Page visible, audio playing:", !audio.paused);

        // Update Media Session position
        if (useWebMediaSession && "setPositionState" in navigator.mediaSession && duration > 0) {
          navigator.mediaSession.setPositionState({
            duration: duration,
            playbackRate: playbackRateRef.current,
            position: audio.currentTime,
          });
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
    // playbackRate is read through its ref, so a speed change doesn't re-run this.
  }, [isPlaying, duration]);

  // Apply initialProgress exactly ONCE per mount. Without the ref guard the
  // effect re-fires every time the parent re-saves the playhead (every ~10s
  // during playback `pause_position_seconds` propagates back here via props,
  // changing initialProgress). Each re-run re-assigns audio.currentTime,
  // which the audio engine treats as a real seek and briefly pauses output —
  // audible as a stutter every 10 seconds.
  // Resume-from-pause, the iOS-safe way: DON'T seek before playback. Seeking a
  // paused/cold <audio> on iOS updates the currentTime PROPERTY (so it reads
  // back correctly, fooling any verify check) but the decoder still starts from
  // 0 — you hear the intro. The only reliable moment to seek is AFTER playback
  // has actually started (the `playing` event), when iOS honors it for real.
  //
  // So here we only (a) capture the desired resume target in a ref and (b) show
  // it on the progress bar. The actual audio.currentTime seek happens in the
  // `playing` handler below, once, on first play.
  const pendingResumeRef = useRef(0);
  const initialSeekAppliedRef = useRef(false);
  useEffect(() => {
    if (initialSeekAppliedRef.current) return;
    if (!initialProgress || initialProgress <= 0) return;
    setCurrentTime(initialProgress); // the bar shows the resume point
    if (nativeAudio) {
      // The native player seeks before it starts, so no muted jump is needed.
      nativeAudio.currentTime = initialProgress;
      initialSeekAppliedRef.current = true;
      return;
    }
    pendingResumeRef.current = initialProgress;
  }, [initialProgress]);

  useEffect(() => {
    if (!autoPlay) return;
    const audio = audioRef.current;
    if (!audio) return;

    let started = false;
    const tryStart = () => {
      if (started) return;
      started = true;
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          startProgressTimer();
          if (useWebMediaSession) {
            navigator.mediaSession.playbackState = "playing";
          }
        })
        .catch(() => {
          // Autoplay blocked — user can still hit play.
          started = false;
        });
    };

    if (audio.readyState >= 3) {
      tryStart();
    } else {
      audio.addEventListener("canplay", tryStart, { once: true });
      return () => audio.removeEventListener("canplay", tryStart);
    }
  }, [autoPlay]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);

      // Update media session position for lock screen scrubber
      if (useWebMediaSession && "setPositionState" in navigator.mediaSession) {
        // The element's duration: this handler is registered once, so the
        // duration state here would be the first render's.
        if (audio.duration > 0 && !audio.paused) {
          try {
            navigator.mediaSession.setPositionState({
              duration: audio.duration,
              playbackRate: playbackRateRef.current,
              position: audio.currentTime,
            });
          } catch (error) {
            // Ignore errors from setting position state
          }
        }
      }
    };
    const updateDuration = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      clearProgressTimer();
      saveProgress(true); // Force save final progress
      callbacksRef.current.onEnded && callbacksRef.current.onEnded();
    };
    const handleError = () => {
      setIsLoading(false);
      callbacksRef.current.onError && callbacksRef.current.onError();
    };
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    // Sync UI state with actual audio state. onPlay lives here rather than
    // after play() so that every start counts — including the headset, the
    // lock screen and the native player resuming after a phone call.
    const handlePlay = () => {
      setIsPlaying(true);
      startProgressTimer();
      callbacksRef.current.onPlay && callbacksRef.current.onPlay();
      if (useWebMediaSession) navigator.mediaSession.playbackState = "playing";
    };
    // THE actual resume seek. `playing` fires once real playback has begun, the
    // only point iOS honors a seek on cold/paused media. We briefly mute so the
    // sliver of intro before the jump isn't heard, seek, then unmute.
    const handlePlaying = () => {
      const target = pendingResumeRef.current;
      if (!target || initialSeekAppliedRef.current) return;
      initialSeekAppliedRef.current = true;
      pendingResumeRef.current = 0;
      if (audio.duration > 0 && Math.abs(audio.currentTime - target) > 1.5) {
        const wasMuted = audio.muted;
        audio.muted = true;
        audio.currentTime = Math.min(target, audio.duration);
        const unmute = () => {
          audio.muted = wasMuted;
          audio.removeEventListener("seeked", unmute);
        };
        audio.addEventListener("seeked", unmute);
      }
    };
    const handlePause = () => {
      setIsPlaying(false);
      if (useWebMediaSession) navigator.mediaSession.playbackState = "paused";
      clearProgressTimer();
      saveProgress(true);
      callbacksRef.current.onPause && callbacksRef.current.onPause();
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("pause", handlePause);

    // Sync the UI with the element when the app comes back. iOS suspends the
    // page while it's in the background, so a pause that happened there may
    // never have reached handlePause — the player would reopen showing
    // "pause" over silent audio.
    const syncWithAudio = () => {
      if (document.hidden) return;
      setIsPlaying(!audio.paused);
      setCurrentTime(audio.currentTime);
      if (useWebMediaSession) {
        navigator.mediaSession.playbackState = audio.paused ? "paused" : "playing";
      }
      if (audio.paused) {
        clearProgressTimer();
      } else {
        startProgressTimer();
      }
    };

    document.addEventListener("visibilitychange", syncWithAudio);
    window.addEventListener("pageshow", syncWithAudio);

    // The native player re-syncs itself (nativeAudio.js) and then fires play/pause.
    const stopResumeListener = nativeAudio ? () => {} : onAppResume(syncWithAudio);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("pause", handlePause);
      document.removeEventListener("visibilitychange", syncWithAudio);
      window.removeEventListener("pageshow", syncWithAudio);
      stopResumeListener();
      clearProgressTimer();
    };
  }, []);

  const saveProgress = (forceSave = false) => {
    const audio = audioRef.current;
    const { onProgressUpdate } = callbacksRef.current;
    if (!audio || !onProgressUpdate) return;

    const currentProgress = Math.floor(audio.currentTime);
    // Ensure progress doesn't exceed duration (prevents MediaSession API errors)
    const validProgress = audio.duration > 0 ? Math.min(currentProgress, Math.floor(audio.duration)) : currentProgress;

    console.log(
      `Saving progress: ${validProgress} seconds (last saved: ${lastSavedProgressRef.current}, forced: ${forceSave})`,
    ); // Debug log
    // Only save if progress changed by at least 5 seconds OR if forceSave is true (e.g., on pause)
    if (forceSave || Math.abs(validProgress - lastSavedProgressRef.current) >= 5) {
      console.log(`Progress saved: ${validProgress} seconds`); // Debug log
      onProgressUpdate(validProgress);
      lastSavedProgressRef.current = validProgress;
    }
  };

  const startProgressTimer = () => {
    if (!callbacksRef.current.onProgressUpdate) return;
    // Called from both the 'play' event and play().then(); don't stack intervals.
    clearProgressTimer();

    // Save progress every 10 seconds
    progressTimerRef.current = setInterval(saveProgress, 10000);
  };

  const clearProgressTimer = () => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      // Note: handlePause will be called by the 'pause' event listener
      // which handles setIsPlaying, clearProgressTimer, saveProgress, and onPause
    } else {
      // Resume seek is handled by the `playing` event (handlePlaying) — the only
      // moment iOS honors a seek on cold/paused media. Do NOT seek here.
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          startProgressTimer();
          if (useWebMediaSession) {
            navigator.mediaSession.playbackState = "playing";
          }
        })
        .catch((err) => {
          console.error("Playback failed:", err);
          setIsPlaying(false);
        });
    }
  };

  const seekToStart = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setCurrentTime(0);
  };

  const seekBackward = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = Math.max(0, audio.currentTime - SEEK_SECONDS);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const seekForward = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = Math.min(duration, audio.currentTime + SEEK_SECONDS);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleProgressClick = (e) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;

    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time, adjustForSpeed = false) => {
    if (isNaN(time)) return "0:00";
    // Adjust time based on playback rate if requested
    const adjustedTime = adjustForSpeed ? time / playbackRate : time;
    const minutes = Math.floor(adjustedTime / 60);
    const seconds = Math.floor(adjustedTime % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSpeedChange = (newRate) => {
    setPlaybackRate(newRate);
    saveSpeed(language, newRate);
  };

  return (
    <div
      style={{
        backgroundColor: "var(--card-bg)",
        borderRadius: "12px",
        padding: "20px",
        margin: "0 auto",
        maxWidth: "100%",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {!nativeAudio && <audio ref={audioRef} src={src} preload="auto" playsInline controlsList="nodownload" crossOrigin="anonymous" />}

      {/* Controls: flex space-between so the outer buttons hug the edges
          and the play button sits in the middle, using the full width. */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <IconNavButton onClick={seekToStart} disabled={isLoading} ariaLabel="Rewind to start">
          <SkipPreviousRoundedIcon sx={{ fontSize: 32 }} />
        </IconNavButton>

        <IconNavButton onClick={seekBackward} disabled={isLoading} ariaLabel="Back 10 seconds">
          <Replay10RoundedIcon sx={{ fontSize: 36 }} />
        </IconNavButton>

        {/* Play/Pause: only control that keeps the circle. Always clickable —
            audio.play() queues internally if audio isn't yet ready, so there's
            no value in disabling the button during the loading window (and the
            former hourglass-swap left users staring at an unresponsive UI). */}
        <button
          onClick={togglePlay}
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            border: "none",
            backgroundColor: zeeguuOrange,
            color: "white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            transition: "all 0.2s ease",
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = "scale(0.95)";
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          {isPlaying ? <PauseRoundedIcon sx={{ fontSize: 32 }} /> : <PlayArrowRoundedIcon sx={{ fontSize: 32 }} />}
        </button>

        <IconNavButton onClick={seekForward} disabled={isLoading} ariaLabel="Forward 10 seconds">
          <Forward10RoundedIcon sx={{ fontSize: 36 }} />
        </IconNavButton>

        <SpeedPicker value={playbackRate} onChange={handleSpeedChange} disabled={isLoading} />
      </div>

      {/* Progress Bar full width, elapsed floats above the playhead, total parks below right */}
      <div style={{ marginTop: "16px" }}>
        {/* Elapsed: rides with the playhead above the bar */}
        <div
          style={{
            position: "relative",
            height: "18px",
            marginBottom: "4px",
            fontSize: "13px",
            fontWeight: "600",
            color: "var(--text-muted)",
          }}
        >
          {(() => {
            // Snap to flush-right once we're within a fraction of the end so
            // the elapsed label aligns exactly with the total below.
            const labelPct = progressPercentage > 98 ? 100 : progressPercentage;
            return (
              <span
                style={{
                  position: "absolute",
                  left: `${labelPct}%`,
                  transform: `translateX(-${labelPct}%)`,
                  whiteSpace: "nowrap",
                }}
              >
                {formatTime(currentTime, true)}
              </span>
            );
          })()}
        </div>
        {/* Progress Bar */}
        <div
          onClick={handleProgressClick}
          style={{
            width: "100%",
            height: "8px",
            backgroundColor: "var(--border-light)",
            borderRadius: "4px",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progressPercentage}%`,
              height: "100%",
              backgroundColor: zeeguuOrange,
              borderRadius: "4px",
              transition: "width 0.1s ease",
            }}
          />
        </div>

        {/* Time Display */}
        {/* Total: parked below, right-aligned */}
        <div
          style={{
            marginTop: "6px",
            textAlign: "right",
            fontSize: "13px",
            fontWeight: "600",
            color: "var(--text-muted)",
          }}
        >
          {formatTime(duration, true)}
        </div>
      </div>

      {children}
    </div>
  );
}
