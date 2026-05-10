import React, { useEffect, useRef, useState } from "react";
import { zeeguuOrange } from "./colors";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";
import SkipPreviousRoundedIcon from "@mui/icons-material/SkipPreviousRounded";
import Replay10RoundedIcon from "@mui/icons-material/Replay10Rounded";
import Forward10RoundedIcon from "@mui/icons-material/Forward10Rounded";

const SEEK_SECONDS = 10;

const SPEED_OPTIONS = [0.8, 0.85, 0.9, 0.95, 1];

const formatSpeed = (s) => `${s}x`;

// Custom dropdown so the menu pops *next to* the label rather than at
// whatever position iOS WKWebView decides for a hidden <select>.
function SpeedPicker({ value, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("touchstart", onDocClick);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("touchstart", onDocClick);
    };
  }, [open, setOpen]);

  return (
    <div ref={wrapperRef} style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
      <button
        type="button"
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        style={{
          background: "transparent",
          border: `1.5px solid ${disabled ? "#ccc" : "var(--player-icon-color)"}`,
          borderRadius: "50%",
          width: "38px",
          height: "38px",
          padding: 0,
          color: disabled ? "#ccc" : "var(--player-icon-color)",
          fontSize: "12px",
          fontWeight: 600,
          cursor: disabled ? "not-allowed" : "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          whiteSpace: "nowrap",
        }}
      >
        {formatSpeed(value)}
      </button>
      {open && (
        <ul
          style={{
            position: "absolute",
            bottom: "calc(100% + 4px)",
            right: 0,
            margin: 0,
            padding: "4px 0",
            listStyle: "none",
            background: "var(--card-bg)",
            border: `1px solid ${zeeguuOrange}`,
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 10,
            minWidth: "90px",
          }}
        >
          {SPEED_OPTIONS.map((opt) => (
            <li key={opt}>
              <button
                type="button"
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                style={{
                  background: opt === value ? `${zeeguuOrange}22` : "transparent",
                  border: "none",
                  padding: "10px 20px",
                  color: "var(--text-primary)",
                  fontSize: "18px",
                  fontWeight: opt === value ? 600 : 500,
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "left",
                }}
              >
                {formatSpeed(opt)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

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
}) {
  const getStoredSpeed = () => {
    if (!language) return 1.0;
    const key = `audioSpeed_${language}`;
    const stored = localStorage.getItem(key);
    return stored ? parseFloat(stored) : 1.0;
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(getStoredSpeed());
  const audioRef = useRef(null);
  const progressTimerRef = useRef(null);
  const lastSavedProgressRef = useRef(0);
  const audioContextRef = useRef(null);

  // Apply stored playback rate when audio is ready
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && playbackRate !== 1.0) {
      audio.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Set up Media Session API for lock screen controls.
  // Only the currently-playing player owns navigator.mediaSession (it's a
  // singleton), so we gate on isPlaying — otherwise 10 cards in a list each
  // set metadata on mount and re-fetch the artwork. Position state lives in
  // its own effect below so currentTime updates don't rebuild the metadata.
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    if (!isPlaying) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: title,
      artist: artist,
      album: language ? `${language.toUpperCase()} Lessons` : 'Language Lessons',
      artwork: [
        { src: '/logo192.png', sizes: '192x192', type: 'image/png' },
        { src: '/logo512.png', sizes: '512x512', type: 'image/png' },
        { src: '/static/images/zeeguu128.png', sizes: '128x128', type: 'image/png' }
      ]
    });

    navigator.mediaSession.setActionHandler('play', () => {
      const audio = audioRef.current;
      if (audio && audio.paused) {
        audio.play();
        setIsPlaying(true);
        onPlay && onPlay();
      }
      // Try to focus the window when interacting from lock screen
      if (window.focus) window.focus();
    });

    navigator.mediaSession.setActionHandler('pause', () => {
      const audio = audioRef.current;
      if (audio && !audio.paused) {
        audio.pause();
        // Note: handlePause will be called by the 'pause' event listener
      }
      // Try to focus the window when interacting from lock screen
      if (window.focus) window.focus();
    });

    // Try different action handlers that iOS might recognize
    try {
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        seekBackward();
      });
      
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        seekForward();
      });
    } catch (error) {
      console.log('Track controls not supported');
    }
    
    navigator.mediaSession.setActionHandler('seekbackward', (details) => {
      const audio = audioRef.current;
      if (!audio) return;
      
      // iOS typically uses 10 or 15 second intervals
      const offset = details?.seekOffset || 10;
      const newTime = Math.max(0, audio.currentTime - offset);
      audio.currentTime = newTime;
      setCurrentTime(newTime);
      
      // Update position state immediately
      if ('setPositionState' in navigator.mediaSession && duration > 0) {
        navigator.mediaSession.setPositionState({
          duration: duration,
          playbackRate: playbackRate,
          position: newTime
        });
      }
    });

    navigator.mediaSession.setActionHandler('seekforward', (details) => {
      const audio = audioRef.current;
      if (!audio) return;
      
      // iOS typically uses 10 or 15 second intervals
      const offset = details?.seekOffset || 10;
      const newTime = Math.min(duration, audio.currentTime + offset);
      audio.currentTime = newTime;
      setCurrentTime(newTime);
      
      // Update position state immediately
      if ('setPositionState' in navigator.mediaSession && duration > 0) {
        navigator.mediaSession.setPositionState({
          duration: duration,
          playbackRate: playbackRate,
          position: newTime
        });
      }
    });

    navigator.mediaSession.setActionHandler('seekto', (details) => {
      const audio = audioRef.current;
      if (audio && details.seekTime !== undefined) {
        audio.currentTime = details.seekTime;
        setCurrentTime(details.seekTime);
      }
    });

    navigator.mediaSession.playbackState = 'playing';

    // Cleanup intentionally does NOT null action handlers. iOS only renders
    // lock-screen seek/play buttons while their handlers are registered, and
    // routes taps through them. Nulling on every pause meant the buttons went
    // inert as soon as the user paused once. The next player to start playing
    // will overwrite handlers on its own play transition; on unmount the
    // stale handlers reference a null audioRef and no-op safely.
    return () => {
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'paused';
      }
    };
  }, [title, artist, language, isPlaying]);

  // Position state for the lock-screen progress bar. Separate from the
  // metadata effect so currentTime updates don't trigger an artwork refetch.
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    if (!isPlaying) return;
    if (!('setPositionState' in navigator.mediaSession)) return;
    if (duration <= 0) return;
    navigator.mediaSession.setPositionState({
      duration: duration,
      playbackRate: playbackRate,
      position: currentTime,
    });
  }, [isPlaying, duration, currentTime, playbackRate]);

  // Initialize Audio Context and handle visibility changes
  useEffect(() => {
    // Create Audio Context to maintain audio session
    if (!audioContextRef.current && 'AudioContext' in window) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      
      // Resume audio context if it's suspended (iOS requirement)
      if (audioContextRef.current.state === 'suspended') {
        const resumeAudio = () => {
          if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume().catch(err => {
              console.log('Could not resume audio context:', err);
            });
          }
          document.removeEventListener('touchstart', resumeAudio);
          document.removeEventListener('click', resumeAudio);
        };
        document.addEventListener('touchstart', resumeAudio);
        document.addEventListener('click', resumeAudio);
      }
    } else if (audioContextRef.current && audioContextRef.current.state === 'closed') {
      // Recreate if closed
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Handle visibility changes to maintain audio playback
    const handleVisibilityChange = () => {
      const audio = audioRef.current;
      if (!audio) return;

      if (document.hidden) {
        // Page is hidden (locked screen or switched apps)
        console.log('Page hidden, audio playing:', !audio.paused);
      } else {
        // Page is visible again
        console.log('Page visible, audio playing:', !audio.paused);
        
        // If audio was playing and got paused, try to resume
        if (isPlaying && audio.paused) {
          audio.play().catch(err => {
            console.log('Could not resume audio after visibility change:', err);
          });
        }
        
        // Update Media Session position
        if ('mediaSession' in navigator && 'setPositionState' in navigator.mediaSession && duration > 0) {
          navigator.mediaSession.setPositionState({
            duration: duration,
            playbackRate: playbackRate,
            position: audio.currentTime
          });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Handle app activation from lock screen
    const handleAppActivation = () => {
      console.log('App activated, possibly from lock screen tap');
      
      // Re-establish media session ownership
      if ('mediaSession' in navigator) {
        // Force update metadata to reclaim session
        const currentMetadata = navigator.mediaSession.metadata;
        navigator.mediaSession.metadata = null;
        setTimeout(() => {
          navigator.mediaSession.metadata = currentMetadata;
          navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
        }, 0);
      }
    };

    // Listen for various activation events
    window.addEventListener('focus', handleAppActivation);
    window.addEventListener('pageshow', handleAppActivation);
    
    // For PWAs, also listen to these events
    if (window.matchMedia('(display-mode: standalone)').matches) {
      document.addEventListener('resume', handleAppActivation);
    }

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleAppActivation);
      window.removeEventListener('pageshow', handleAppActivation);
      document.removeEventListener('resume', handleAppActivation);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(err => {
          console.log('Could not close audio context:', err);
        });
      }
    };
  }, [isPlaying, duration, playbackRate]);

  // Handle initial seek when audio is ready
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !initialProgress || initialProgress <= 0) return;

    let hasSeenked = false;

    const seekToInitialProgress = () => {
      if (hasSeenked) return; // Prevent multiple seeks

      console.log(`Audio ready, seeking to initial progress: ${initialProgress}, duration: ${audio.duration}`);
      if (audio.duration > 0 && initialProgress > 0) {
        audio.currentTime = initialProgress;
        setCurrentTime(initialProgress);
        hasSeenked = true;
        console.log(`Successfully seeked to ${initialProgress} seconds`);

        // Remove listeners after successful seek
        audio.removeEventListener("loadedmetadata", seekToInitialProgress);
        audio.removeEventListener("canplay", seekToInitialProgress);
      }
    };

    // If audio is already loaded, seek immediately
    if (audio.readyState >= 2 && audio.duration > 0) {
      seekToInitialProgress();
    } else {
      // Otherwise, wait for it to be ready
      audio.addEventListener("loadedmetadata", seekToInitialProgress);
      audio.addEventListener("canplay", seekToInitialProgress);

      return () => {
        audio.removeEventListener("loadedmetadata", seekToInitialProgress);
        audio.removeEventListener("canplay", seekToInitialProgress);
      };
    }
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
          onPlay && onPlay();
          startProgressTimer();
          if ("mediaSession" in navigator) {
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
      if ('mediaSession' in navigator && 'setPositionState' in navigator.mediaSession) {
        if (duration > 0 && !audio.paused) {
          try {
            navigator.mediaSession.setPositionState({
              duration: duration,
              playbackRate: playbackRate,
              position: audio.currentTime
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
      onEnded && onEnded();
    };
    const handleError = () => {
      setIsLoading(false);
      onError && onError();
    };
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    // Sync UI state with actual audio state
    const handlePlay = () => {
      setIsPlaying(true);
      startProgressTimer();
    };
    const handlePause = () => {
      setIsPlaying(false);
      clearProgressTimer();
      saveProgress(true);
      onPause && onPause();
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    // Sync state when app becomes visible again
    const handleVisibilityChange = () => {
      if (!document.hidden && audio) {
        // Update UI state to match actual audio state when app becomes visible
        setIsPlaying(!audio.paused);
        if (audio.paused) {
          clearProgressTimer();
        } else {
          startProgressTimer();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearProgressTimer();
    };
  }, [onEnded, onError, onPause, initialProgress]);


  const saveProgress = (forceSave = false) => {
    const audio = audioRef.current;
    if (!audio || !onProgressUpdate) return;

    const currentProgress = Math.floor(audio.currentTime);
    // Ensure progress doesn't exceed duration (prevents MediaSession API errors)
    const validProgress = audio.duration > 0
      ? Math.min(currentProgress, Math.floor(audio.duration))
      : currentProgress;

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
    if (!onProgressUpdate) return;

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
      // For iOS: ensure the audio context is resumed before playing.
      if (audioContextRef.current && audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume().catch(() => {
          // Best-effort — fall through to audio.play() regardless.
        });
      }

      audio.play().then(() => {
        setIsPlaying(true);
        onPlay && onPlay();
        startProgressTimer();
        if ("mediaSession" in navigator) {
          navigator.mediaSession.playbackState = "playing";
        }
      }).catch((err) => {
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
    const audio = audioRef.current;
    if (!audio) return;

    setPlaybackRate(newRate);
    audio.playbackRate = newRate;

    // Save to localStorage if language is provided
    if (language) {
      const key = `audioSpeed_${language}`;
      localStorage.setItem(key, newRate.toString());
    }
  };

  return (
    <div
      style={{
        ...style,
        backgroundColor: "var(--card-bg)",
        borderRadius: "12px",
        padding: "20px",
        margin: "0 auto",
        maxWidth: "100%",
        boxSizing: "border-box",
      }}
    >
      <audio 
        ref={audioRef} 
        src={src} 
        preload="auto"
        playsInline
        controlsList="nodownload"
        crossOrigin="anonymous"
        onLoadedMetadata={(e) => {
          // Ensure seekable range is set
          const audio = e.target;
          if (audio.duration && isFinite(audio.duration)) {
            // Force iOS to recognize this as seekable content
            audio.currentTime = 0;
          }
        }}
      />

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
          {isPlaying ? (
            <PauseRoundedIcon sx={{ fontSize: 32 }} />
          ) : (
            <PlayArrowRoundedIcon sx={{ fontSize: 32 }} />
          )}
        </button>

        <IconNavButton onClick={seekForward} disabled={isLoading} ariaLabel="Forward 10 seconds">
          <Forward10RoundedIcon sx={{ fontSize: 36 }} />
        </IconNavButton>

        <SpeedPicker
          value={playbackRate}
          onChange={handleSpeedChange}
          disabled={isLoading}
        />
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
    </div>
  );
}
