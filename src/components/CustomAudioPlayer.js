import React, { useEffect, useRef, useState } from "react";
import { zeeguuOrange } from "./colors";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";

const SEEK_SECONDS = 5;

export default function CustomAudioPlayer({
  src,
  onPlay,
  onEnded,
  onError,
  onProgressUpdate,
  initialProgress = 0,
  style,
  language,
  title = "Audio Lesson",
  artist = "Zeeguu",
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

  // Set up Media Session API for lock screen controls
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    // Force clear any existing metadata first
    navigator.mediaSession.metadata = null;
    
    // Set fresh metadata for lock screen
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
    
    // Force set playback state
    navigator.mediaSession.playbackState = 'none';

    // Set up action handlers
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
        setIsPlaying(false);
        saveProgress(true);
      }
      // Try to focus the window when interacting from lock screen
      if (window.focus) window.focus();
    });

    navigator.mediaSession.setActionHandler('seekbackward', (details) => {
      const audio = audioRef.current;
      if (!audio) return;
      
      // Use the seekOffset if provided by iOS, otherwise use our default
      const offset = details.seekOffset || SEEK_SECONDS;
      const newTime = Math.max(0, audio.currentTime - offset);
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    });

    navigator.mediaSession.setActionHandler('seekforward', (details) => {
      const audio = audioRef.current;
      if (!audio) return;
      
      // Use the seekOffset if provided by iOS, otherwise use our default
      const offset = details.seekOffset || SEEK_SECONDS;
      const newTime = Math.min(duration, audio.currentTime + offset);
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    });

    navigator.mediaSession.setActionHandler('seekto', (details) => {
      const audio = audioRef.current;
      if (audio && details.seekTime !== undefined) {
        audio.currentTime = details.seekTime;
        setCurrentTime(details.seekTime);
      }
    });

    // Update playback state
    const updatePlaybackState = () => {
      if (!('mediaSession' in navigator)) return;
      
      const audio = audioRef.current;
      if (!audio) return;

      navigator.mediaSession.playbackState = audio.paused ? 'paused' : 'playing';
      
      // Set position state for progress bar on lock screen
      if ('setPositionState' in navigator.mediaSession) {
        if (duration > 0) {
          navigator.mediaSession.setPositionState({
            duration: duration,
            playbackRate: playbackRate,
            position: currentTime
          });
        }
      }
    };

    updatePlaybackState();

    return () => {
      // Clean up handlers when component unmounts
      if ('mediaSession' in navigator) {
        navigator.mediaSession.setActionHandler('play', null);
        navigator.mediaSession.setActionHandler('pause', null);
        navigator.mediaSession.setActionHandler('seekbackward', null);
        navigator.mediaSession.setActionHandler('seekforward', null);
        navigator.mediaSession.setActionHandler('seekto', null);
      }
    };
  }, [title, artist, language, duration, currentTime, playbackRate, isPlaying]);

  // Initialize Audio Context and handle visibility changes
  useEffect(() => {
    // Create Audio Context to maintain audio session
    if (!audioContextRef.current && 'AudioContext' in window) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      
      // Resume audio context if it's suspended (iOS requirement)
      if (audioContextRef.current.state === 'suspended') {
        const resumeAudio = () => {
          audioContextRef.current.resume();
          document.removeEventListener('touchstart', resumeAudio);
          document.removeEventListener('click', resumeAudio);
        };
        document.addEventListener('touchstart', resumeAudio);
        document.addEventListener('click', resumeAudio);
      }
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

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
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
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
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
  }, [onEnded, onError, initialProgress]);

  const saveProgress = (forceSave = false) => {
    const audio = audioRef.current;
    if (!audio || !onProgressUpdate) return;

    const currentProgress = Math.floor(audio.currentTime);
    console.log(
      `Saving progress: ${currentProgress} seconds (last saved: ${lastSavedProgressRef.current}, forced: ${forceSave})`,
    ); // Debug log
    // Only save if progress changed by at least 5 seconds OR if forceSave is true (e.g., on pause)
    if (forceSave || Math.abs(currentProgress - lastSavedProgressRef.current) >= 5) {
      console.log(`Progress saved: ${currentProgress} seconds`); // Debug log
      onProgressUpdate(currentProgress);
      lastSavedProgressRef.current = currentProgress;
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
      setIsPlaying(false);
      clearProgressTimer();
      saveProgress(true); // Force save progress when pausing
    } else {
      // For iOS: Ensure audio context is resumed before playing
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      
      audio.play().then(() => {
        setIsPlaying(true);
        onPlay && onPlay();
        startProgressTimer();
        
        // Force update media session when starting playback
        if ('mediaSession' in navigator) {
          navigator.mediaSession.playbackState = 'playing';
        }
      }).catch(err => {
        console.error('Playback failed:', err);
        setIsPlaying(false);
      });
    }
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
        backgroundColor: "#f8f9fa",
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
        preload="metadata"
        playsInline
      />

      {/* Controls Section */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "16px", justifyContent: "space-between" }}>
        {/* Playback Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Back 15s Button */}
          <button
            onClick={seekBackward}
            disabled={isLoading}
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              border: `2px solid ${isLoading ? "#ccc" : zeeguuOrange}`,
              backgroundColor: "white",
              color: isLoading ? "#ccc" : zeeguuOrange,
              cursor: isLoading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              transition: "all 0.2s ease",
            }}
            onMouseDown={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = "scale(0.95)";
              }
            }}
            onMouseUp={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = "scale(1)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = "scale(1)";
              }
            }}
          >
            <span style={{ fontSize: "14px", fontWeight: "600" }}>-{SEEK_SECONDS}</span>
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            disabled={isLoading}
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              border: "none",
              backgroundColor: isLoading ? "#ccc" : zeeguuOrange,
              color: "white",
              cursor: isLoading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              transition: "all 0.2s ease",
            }}
            onMouseDown={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = "scale(0.95)";
              }
            }}
            onMouseUp={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = "scale(1)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = "scale(1)";
              }
            }}
          >
            {isLoading ? (
              <HourglassEmptyRoundedIcon sx={{ fontSize: 28 }} />
            ) : isPlaying ? (
              <PauseRoundedIcon sx={{ fontSize: 32 }} />
            ) : (
              <PlayArrowRoundedIcon sx={{ fontSize: 32 }} />
            )}
          </button>

          {/* Forward 15s Button */}
          <button
            onClick={seekForward}
            disabled={isLoading}
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              border: `2px solid ${isLoading ? "#ccc" : zeeguuOrange}`,
              backgroundColor: "white",
              color: isLoading ? "#ccc" : zeeguuOrange,
              cursor: isLoading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              transition: "all 0.2s ease",
            }}
            onMouseDown={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = "scale(0.95)";
              }
            }}
            onMouseUp={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = "scale(1)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = "scale(1)";
              }
            }}
          >
            <span style={{ fontSize: "14px", fontWeight: "600" }}>+{SEEK_SECONDS}</span>
          </button>
        </div>

        {/* Speed Control Dropdown */}
        <div style={{ position: "relative" }}>
          <select
            value={playbackRate}
            onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
            disabled={isLoading}
            style={{
              padding: "6px 12px",
              borderRadius: "20px",
              border: `1px solid ${zeeguuOrange}`,
              backgroundColor: "white",
              color: zeeguuOrange,
              cursor: isLoading ? "not-allowed" : "pointer",
              fontSize: "14px",
              fontWeight: "500",
              outline: "none",
              appearance: "none",
              paddingRight: "28px",
              minWidth: "80px",
            }}
          >
            <option value="0.8">0.8x</option>
            <option value="0.85">0.85x</option>
            <option value="0.9">0.9x</option>
            <option value="0.95">0.95x</option>
            <option value="1">1x</option>
          </select>
          {/* Custom dropdown arrow */}
          <div
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              color: zeeguuOrange,
              fontSize: "12px",
            }}
          >
            ▼
          </div>
        </div>
      </div>

      {/* Progress Bar and Time Display */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "16px" }}>
        {/* Progress Bar */}
        <div
          onClick={handleProgressClick}
          style={{
            flex: 1,
            height: "8px",
            backgroundColor: "#e0e0e0",
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

          {/* Progress Handle */}
          <div
            style={{
              position: "absolute",
              top: "-6px",
              left: `${progressPercentage}%`,
              width: "20px",
              height: "20px",
              backgroundColor: zeeguuOrange,
              borderRadius: "50%",
              transform: "translateX(-50%)",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              cursor: "pointer",
              opacity: duration > 0 ? 1 : 0,
            }}
          />
        </div>

        {/* Time Display */}
        <div style={{ minWidth: "100px", textAlign: "right" }}>
          <div style={{ fontSize: "14px", fontWeight: "600", color: "#888" }}>
            {formatTime(currentTime)} / {formatTime(duration, true)}
          </div>
        </div>
      </div>
    </div>
  );
}
