import React, { useState, useRef, useEffect } from "react";
import { zeeguuOrange } from "./colors";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";

export default function CustomAudioPlayer({ 
  src, 
  onPlay, 
  onEnded, 
  onError, 
  onProgressUpdate,
  initialProgress = 0,
  style 
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef(null);
  const progressTimerRef = useRef(null);
  const lastSavedProgressRef = useRef(0);

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
        audio.removeEventListener('loadedmetadata', seekToInitialProgress);
        audio.removeEventListener('canplay', seekToInitialProgress);
      }
    };
    
    // If audio is already loaded, seek immediately
    if (audio.readyState >= 2 && audio.duration > 0) {
      seekToInitialProgress();
    } else {
      // Otherwise, wait for it to be ready
      audio.addEventListener('loadedmetadata', seekToInitialProgress);
      audio.addEventListener('canplay', seekToInitialProgress);
      
      return () => {
        audio.removeEventListener('loadedmetadata', seekToInitialProgress);
        audio.removeEventListener('canplay', seekToInitialProgress);
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
    console.log(`Saving progress: ${currentProgress} seconds (last saved: ${lastSavedProgressRef.current}, forced: ${forceSave})`); // Debug log
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
      audio.play();
      setIsPlaying(true);
      onPlay && onPlay();
      startProgressTimer();
    }
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

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div style={{ 
      ...style, 
      backgroundColor: "#f8f9fa", 
      borderRadius: "12px", 
      padding: "20px",
      margin: "0 auto",
      maxWidth: "100%",
      boxSizing: "border-box"
    }}>
      <audio ref={audioRef} src={src} preload="metadata" />
      
      {/* Play/Pause Button */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
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
              e.target.style.transform = "scale(0.95)";
            }
          }}
          onMouseUp={(e) => {
            if (!isLoading) {
              e.target.style.transform = "scale(1)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              e.target.style.transform = "scale(1)";
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
        
        {/* Time Display */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <div style={{ fontSize: "16px", fontWeight: "600", color: "#333" }}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
          {isLoading && (
            <div style={{ fontSize: "12px", color: "#666" }}>Loading...</div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div
        onClick={handleProgressClick}
        style={{
          width: "100%",
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
    </div>
  );
}