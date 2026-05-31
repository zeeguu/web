import React, { useState, useEffect, useRef, useContext } from "react";
import YouTube from "react-youtube";
import { useLocation } from "react-router-dom";
import { TranslatableText } from "../reader/TranslatableText";
import InteractiveText from "../reader/InteractiveText";
import { APIContext } from "../contexts/APIContext";
import { SpeechContext } from "../contexts/SpeechContext";
import { UserContext } from "../contexts/UserContext";
import { setTitle } from "../assorted/setTitle";
import BackArrow from "../pages/Settings/settings_pages_shared/BackArrow";
import TranslateCaptionsControl from "./TranslateCaptionsControl";
import {
  MainContainer,
  VideoContainer,
  CaptionContainer,
  InfoContainer,
  InfoItem,
  FullscreenButton,
} from "./VideoPlayer.sc";
import LoadingAnimation from "../components/LoadingAnimation";
import useWatchingSession from "../hooks/useWatchingSession";
import useShadowRef from "../hooks/useShadowRef";
import { WEB_READER } from "../reader/ArticleReader";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const TIPS = [
  "Press the spacebar to play/pause the video.",
  "Try the Fullscreen mode for a cinematic experience! 🍿",
  "Click on words in the captions to see translations.",
  "You can adjust the video speed in the YouTube player settings.",
];

const tipIndex = Math.floor(Math.random() * TIPS.length);

export default function VideoPlayer() {
  const api = useContext(APIContext);
  let videoID = "";
  const query = useQuery();
  videoID = query.get("id");

  const speech = useContext(SpeechContext);
  const { userDetails } = useContext(UserContext);
  const containerRef = useRef(null);
  const lastCaptionIdRef = useRef(null);

  const [player, setPlayer] = useState(null);
  const [videoInfo, setVideoInfo] = useState();
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [translatedWords, setTranslatedWords] = useState(new Map());
  const [currentInteractiveCaption, setCurrentInteractiveCaption] = useState(null);
  const [interactiveTitle, setInteractiveTitle] = useState(null);

  // Watching session tracking — start/update/end + idle/focus handling
  // are all owned by the hook. The hook will create the session as soon
  // as videoID is set, periodically update it while the user is active,
  // and end it on unmount or videoID change.
  useWatchingSession(videoID);

  const playerRef = useShadowRef(player);
  const videoIDRef = useShadowRef(videoID);

  // Call onComponentMount when the component mounts
  useEffect(() => {
    console.log("INITIATING VIDEO PLAYER FOR VIDEO ID: ", videoID);
    onComponentMount();
    return () => {
      onComponentUnmount();
    };
    // eslint-disable-next-line
  }, []);

  function onComponentMount() {
    api.getVideoInfo(videoID, (video) => {
      console.log("VIDEO INFO: ", video);

      setInteractiveTitle(
        new InteractiveText({
          tokenizedParagraphs: video.tokenized_title.tokens,
          sourceId: video.source_id,
          api,
          previousBookmarks: video.tokenized_title.past_bookmarks,
          language: video.language_code,
          source: WEB_READER,
          zeeguuSpeech: speech,
          contextIdentifier: video.tokenized_title.context_identifier,
        }),
      );

      setVideoInfo(video); // Note videoInfo cannot be accessed from here
      setTitle(video.title);
    });

    api.setVideoOpened(videoID);

    // TODO: Figure out why do we have this twice both here and in the main useEffect - Both here and in the ArticleReader
    // Based on testing, this does not seem to be needed
    // None of the two seems to be able to capture the window close
    window.addEventListener("beforeunload", onComponentUnmount);
  }

  function onComponentUnmount() {
    console.log("Component will unmount...");

    console.log("Updating playback position...");
    updatePlaybackPosition();

    window.removeEventListener("beforeunload", onComponentUnmount);
  }

  function updatePlaybackPosition() {
    if (playerRef.current !== null) {
      api.updatePlaybackPosition(videoIDRef.current, playerRef.current.getCurrentTime());
    }
  }

  // Pause the video when a new word is translated
  useEffect(() => {
    if (player !== null) {
      player.pauseVideo();
    }
  }, [translatedWords, player]);

  // v1.5: swap caption tracks (original ↔ translated). The id space of
  // context_identifier.video_caption_id is preserved across the translation, so we have to
  // reset the "last shown caption" ref — otherwise the currently displayed (stale-text)
  // caption matches the same id and the interval skips re-rendering until the next caption
  // boundary.
  function handleCaptionTrackChange(captionSetIdOrNull) {
    lastCaptionIdRef.current = null;
    setCurrentInteractiveCaption(null);
    const onLoaded = (video) => setVideoInfo(video);
    if (captionSetIdOrNull == null) {
      api.getVideoInfo(videoID, onLoaded);
    } else {
      api.getVideoInfoWithCaptionSet(videoID, captionSetIdOrNull, onLoaded);
    }
  }

  const onReady = (event) => {
    setPlayer(event.target);
    console.log("videoInfo.playback_position", videoInfo.playback_position);
    if (videoInfo.playback_position) {
      // event.target.seekTo(videoInfo.playback_position);
    }
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
          new InteractiveText({
            tokenizedParagraphs: captionMatch.tokenized_text,
            sourceId: videoInfo.source_id,
            api,
            previousBookmarks: captionMatch.past_bookmarks,
            language: videoInfo.language_code,
            source: "video",
            zeeguuSpeech: speech,
            contextIdentifier: captionMatch.context_identifier,
          }),
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

  let playbackPosition = videoInfo.playback_position ? Math.round(Number(videoInfo.playback_position)) : 0;

  return (
    <MainContainer ref={containerRef} className={isFullscreen ? "fullscreen" : ""}>
      {!isFullscreen && (
        <>
          <BackArrow />
          <InfoContainer>
            <h2>
              <TranslatableText interactiveText={interactiveTitle} translating={true} />
            </h2>
          </InfoContainer>
        </>
      )}
      {!isFullscreen &&
        videoInfo.language_code &&
        userDetails?.learned_language &&
        videoInfo.language_code !== userDetails.learned_language && (
          <TranslateCaptionsControl
            videoId={videoID}
            sourceLanguageCode={videoInfo.language_code}
            targetLanguageCode={userDetails.learned_language}
            targetCefr={userDetails.learned_cefr_level || "B1"}
            onTrackChange={handleCaptionTrackChange}
          />
        )}
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
              start: playbackPosition,
            },
          }}
          onReady={onReady}
          onStateChange={onStateChange}
        />
        <FullscreenButton onClick={toggleFullscreen}>
          {isFullscreen ? (
            <>
              <FullscreenExitIcon />
              Exit Fullscreen
            </>
          ) : (
            <>
              <FullscreenIcon />
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
            <b>TIP:</b> {TIPS[tipIndex]}
          </InfoItem>
        </InfoContainer>
      )}
    </MainContainer>
  );
}
