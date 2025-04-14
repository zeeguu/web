import React, { useState, useEffect, useRef, useContext } from "react";
import YouTube from "react-youtube";
import { useHistory, useLocation } from "react-router-dom";
import { TranslatableText } from "../reader/TranslatableText";
import InteractiveText from "../reader/InteractiveText";
import { APIContext } from "../contexts/APIContext";
import { SpeechContext } from "../contexts/SpeechContext";
import { setTitle } from "../assorted/setTitle";
import {
  MainContainer,
  VideoContainer,
  CaptionContainer,
  InfoContainer,
  InfoItem,
  FullscreenButton,
} from "./VideoPlayer.sc";
import LoadingAnimation from "../components/LoadingAnimation";
import useActivityTimer from "../hooks/useActivityTimer";
import useShadowRef from "../hooks/useShadowRef";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function VideoPlayer() {
  const api = useContext(APIContext);
  let videoID = "";
  const query = useQuery();
  videoID = query.get("id");

  const speech = useContext(SpeechContext);
  const containerRef = useRef(null);
  const lastCaptionIdRef = useRef(null);

  const history = useHistory();
  const [player, setPlayer] = useState(null);
  const [videoInfo, setVideoInfo] = useState();
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [translatedWords, setTranslatedWords] = useState(new Map());
  const [currentInteractiveCaption, setCurrentInteractiveCaption] = useState(null);
  const [interactiveTitle, setInteractiveTitle] = useState(null);
  const [watchingSessionId, setWatchingSessionId] = useState(null);
  const [activityTimer] = useActivityTimer(updateWatchingSession);

  const activityTimerRef = useShadowRef(activityTimer);
  const watchingSessionIdRef = useShadowRef(watchingSessionId);

  // Call onCreate when the component mounts
  useEffect(() => {
    console.log("INITIATING VIDEO PLAYER FOR VIDEO ID: ", videoID);
    onCreate();
    return () => {
      componentWillUnmount();
    };
    // eslint-disable-next-line
  }, []);

  function onCreate() {
    api.getVideoInfo(videoID, (video) => {
      console.log("VIDEO INFO: ", video);
      setInteractiveTitle(
        new InteractiveText(
          video.tokenized_title.tokenized_title,
          video.source_id,
          api,
          video.tokenized_title.past_bookmarks,
          api.TRANSLATE_TEXT,
          video.language_code,
          "video_title",
          speech,
          video.tokenized_title.context_identifier,
        ),
      );

      setVideoInfo(video); // Note videoInfo cannot be accessed from here
      setTitle(video.title);
    });

    api.createWatchingSession(videoID, (sessionID) => {
      setWatchingSessionId(sessionID);
    });

    window.addEventListener("beforeunload", componentWillUnmount);
  }

  function componentWillUnmount() {
    console.log("Component will unmount...");

    console.log("Updating watching session...");
    updateWatchingSession();

    window.removeEventListener("beforeunload", componentWillUnmount);
  }

  function updateWatchingSession() {
    // It can happen that the timer already ticks before we have a watching session from the server.
    if (watchingSessionIdRef.current) {
      api.updateWatchingSession(watchingSessionIdRef.current, activityTimerRef.current);
    }
  }

  // Pause the video when a new word is translated
  useEffect(() => {
    if (player !== null) {
      player.pauseVideo();
    }
  }, [translatedWords, player]);

  const onReady = (event) => {
    setPlayer(event.target);
  };

  const onStateChange = (event) => {
    if (event.data === 1) {
      setHasStartedPlaying(true);
    }
  };

  // Update Caption Based on Video Time
  useEffect(() => {
    if (!hasStartedPlaying || !player) return; // Don't start interval if video hasn't started

    const interval = setInterval(() => {
      if (player.getPlayerState() !== 1) return; // Skip if not playing (1 is playing state)

      const currentTime = player.getCurrentTime();
      const captionMatch = videoInfo.captions.find(
        (caption) => currentTime >= caption.time_start && currentTime <= caption.time_end,
      );

      if (captionMatch && captionMatch.context_identifier.video_caption_id !== lastCaptionIdRef.current) {
        lastCaptionIdRef.current = captionMatch.context_identifier.video_caption_id;
        setCurrentInteractiveCaption(
          new InteractiveText(
            captionMatch.tokenized_text,
            videoInfo.source_id,
            api,
            captionMatch.past_bookmarks,
            api.TRANSLATE_TEXT,
            videoInfo.language_code,
            "video",
            speech,
            captionMatch.context_identifier,
          ),
        );
      } else if (!captionMatch && lastCaptionIdRef.current !== null) {
        // No caption found, clear the current interactive caption
        lastCaptionIdRef.current = null;
        setCurrentInteractiveCaption(null);
      }
    }, 250);

    return () => clearInterval(interval);
  }, [player, hasStartedPlaying, videoInfo, api, speech]);

  // Spacebar Play/Pause Event
  useEffect(() => {
    const handleSpacePressed = (event) => {
      if (event.code === "Space" && player && document.activeElement.tagName !== "IFRAME") {
        event.preventDefault();
        const playerState = player.getPlayerState();
        playerState === 1 ? player.pauseVideo() : player.playVideo();
      }
    };

    window.addEventListener("keydown", handleSpacePressed);
    return () => window.removeEventListener("keydown", handleSpacePressed);
  }, [player]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  if (!videoInfo) {
    return <LoadingAnimation />;
  }

  return (
    <MainContainer ref={containerRef} className={isFullscreen ? "fullscreen" : ""}>
      <InfoContainer>
        <h1>
          <TranslatableText interactiveText={interactiveTitle} translating={true} />
        </h1>
      </InfoContainer>
      <VideoContainer>
        <YouTube
          videoId={videoInfo.video_unique_key}
          opts={{
            height: "100%",
            width: "100%",
            playerVars: {
              autoplay: 0,
              cc_load_policy: 0,
              cc_lang_pref: videoInfo.language_code,
              fs: 0,
              controls: 1,
            },
          }}
          onReady={onReady}
          onStateChange={onStateChange}
        />
        <FullscreenButton onClick={toggleFullscreen}>
          {isFullscreen ? (
            <>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zM16 5v5h5V8h-3V5h-2z" />
              </svg>
              Exit Fullscreen
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
              </svg>
              Fullscreen
            </>
          )}
        </FullscreenButton>
      </VideoContainer>

      <CaptionContainer>
        {!hasStartedPlaying ? (
          <p style={{ fontStyle: "italic", color: "gray" }}>Start the video to see captions.</p>
        ) : currentInteractiveCaption ? (
          <TranslatableText
            interactiveText={currentInteractiveCaption}
            translating={true}
            translatedWords={translatedWords}
            setTranslatedWords={setTranslatedWords}
          />
        ) : null}
      </CaptionContainer>

      {!isFullscreen && (
        <InfoContainer>
          <InfoItem>
            <span>
              <b>TIP:</b> Try the Fullscreen mode for a cinematic experience! 🍿
            </span>
          </InfoItem>
        </InfoContainer>
      )}
    </MainContainer>
  );
}
