import React, {
  useState,
  useEffect,
  useRef,
  useContext,
} from "react";
import YouTube from "react-youtube";
import { useParams, useHistory } from "react-router-dom";
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

import videos from "./Videos.json";
import { set } from "date-fns";

export default function VideoPlayer() {
  const api = useContext(APIContext);
  const speech = useContext(SpeechContext);
  const containerRef = useRef(null);
  const lastCaptionIdRef = useRef(null);

  const history = useHistory();
  const [player, setPlayer] = useState(null);
  const [videoInfo, setVideoInfo] = useState([]);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [translatedWords, setTranslatedWords] = useState(new Map());
  const [currentInteractiveCaption, setCurrentInteractiveCaption] = useState(null);

  // Set page title to video title
  useEffect(() => {
    const videoInfo = videos[0];
    if(videoInfo) {
      setTitle(videoInfo.title);
      setVideoInfo(videoInfo);
    }
  }, []);

  // Pause the video when a new word is translated
  useEffect(() => {
    if (player && translatedWords.size > 0) {
      player.pauseVideo();
    }
  }, [translatedWords, player]);

  const opts = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 0,
      cc_load_policy: 0,
      cc_lang_pref: "da",
      fs: 0,
      controls: 1,
    },
  };

  const onReady = (event) => {
    setPlayer(event.target);
  };

  const onStateChange = (event) => {
    if (event.data === 1) {
      setHasStartedPlaying(true);
    }
  }

  // Update Caption Based on Video Time
  useEffect(() => {
    if (!hasStartedPlaying || !player) return; // Don't start interval if video hasn't started

    const interval = setInterval(() => {
        if (player.getPlayerState() !== 1) return; // Skip if not playing (1 is playing state)

        const currentTime = player.getCurrentTime();
        const captionMatch = videoInfo.captions.find(
          (caption) => currentTime >= caption.time_start && currentTime <= caption.time_end
        );

        if (captionMatch &&
          captionMatch.context_identifier.video_caption_id !== lastCaptionIdRef.current
        ) {
          lastCaptionIdRef.current = captionMatch.context_identifier.video_caption_id;
          setCurrentInteractiveCaption(
            new InteractiveText(
              captionMatch.tokenized_text,
              videoInfo.source_id,
              api,
              [],
              api.TRANSLATE_TEXT,
              videoInfo.language_code,
              "video",
              speech,
              captionMatch.context_identifier,
            )
          );
        }
      }, 250);

      return () => clearInterval(interval);
  }, [player, hasStartedPlaying, videoInfo, api, speech]);

  // Spacebar Play/Pause Event
  useEffect(() => {
    const handleSpacePressed = (event) => {
      if (
        event.code === "Space" &&
        player &&
        document.activeElement.tagName !== "IFRAME"
      ) {
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

  if (!videoInfo.video_unique_key) {
    return <div>No video ID provided</div>;
  }

  return (
    <MainContainer
      ref={containerRef}
      className={isFullscreen ? "fullscreen" : ""}
    >
      <VideoContainer>
        <YouTube videoId={videoInfo.video_unique_key} opts={opts} onReady={onReady} onStateChange={onStateChange} />
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
          <p style={{ fontStyle: "italic", color: "gray" }}>
            Start the video to see captions.
          </p>
        ) : currentInteractiveCaption ? (
          <TranslatableText
            interactiveText={currentInteractiveCaption}
            translating={true}
            translatedWords={translatedWords}
            setTranslatedWords={setTranslatedWords}
          />
        ) : null}
      </CaptionContainer>

      {/* <InfoContainer>
        <InfoItem clickable onClick={() => history.push("/")}>
          <img src="static/icons/go-back.png" alt="Go back icon" />
          <span>Return to Home</span>
        </InfoItem>
      </InfoContainer> */}
    </MainContainer>
  );
}
