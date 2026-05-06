import { useCallback, useRef } from "react";
import strings from "../../i18n/definitions";
import { TTS_PLAYBACK_PREROLL_MS } from "../verbalFlashcardsLanguage";

export default function useVerbalFlashcardTTS({ api, isPageActiveRef, updateStatusWithDebounce }) {
  const ttsAudioRef = useRef(null);
  const ttsRequestIdRef = useRef(0);
  const resolvePlaybackRef = useRef(null);
  const isPlayingTtsRef = useRef(false);

  const stopTts = useCallback(() => {
    ttsRequestIdRef.current += 1;

    if (ttsAudioRef.current) {
      try {
        ttsAudioRef.current.oncanplay = null;
        ttsAudioRef.current.onended = null;
        ttsAudioRef.current.onerror = null;
        ttsAudioRef.current.pause();
        ttsAudioRef.current.currentTime = 0;
        ttsAudioRef.current.removeAttribute("src");
        ttsAudioRef.current.load();
      } catch (e) {
        console.warn(e);
      }
    }

    ttsAudioRef.current = null;
    isPlayingTtsRef.current = false;

    if (resolvePlaybackRef.current) {
      resolvePlaybackRef.current();
      resolvePlaybackRef.current = null;
    }
  }, []);

  const speakText = useCallback(
    (textToSpeak, languageId, playbackStatusMessage = strings.verbalFlashcardsPlayingTtsAudio) => {
      if (!textToSpeak) {
        updateStatusWithDebounce(strings.verbalFlashcardsNoTextAvailableForTts, "error");
        return Promise.resolve();
      }

      ttsRequestIdRef.current += 1;
      const playbackId = ttsRequestIdRef.current;

      if (resolvePlaybackRef.current) {
        resolvePlaybackRef.current();
        resolvePlaybackRef.current = null;
      }

      if (ttsAudioRef.current) {
        try {
          ttsAudioRef.current.oncanplay = null;
          ttsAudioRef.current.onended = null;
          ttsAudioRef.current.onerror = null;
          ttsAudioRef.current.pause();
          ttsAudioRef.current.currentTime = 0;
          ttsAudioRef.current.removeAttribute("src");
          ttsAudioRef.current.load();
        } catch (e) {
          console.warn(e);
        }
        ttsAudioRef.current = null;
      }

      isPlayingTtsRef.current = false;
      updateStatusWithDebounce(strings.verbalFlashcardsRequestingTtsAudio, "processing", 0);

      return api
        .fetchLinkToSpeechMp3(textToSpeak, languageId)
        .then((audioUrl) => {
          if (!audioUrl) {
            updateStatusWithDebounce(strings.verbalFlashcardsTtsReturnedNoAudioPath, "error", 0);
            return;
          }

          if (playbackId !== ttsRequestIdRef.current || !isPageActiveRef.current) {
            return;
          }

          return new Promise((resolve) => {
            const audio = new Audio(audioUrl);
            let didResolve = false;
            ttsAudioRef.current = audio;
            isPlayingTtsRef.current = true;

            const resolvePlayback = () => {
              if (didResolve) {
                return;
              }
              didResolve = true;
              if (resolvePlaybackRef.current === resolvePlayback) {
                resolvePlaybackRef.current = null;
              }
              resolve();
            };

            resolvePlaybackRef.current = resolvePlayback;

            audio.onended = () => {
              if (ttsAudioRef.current === audio) {
                ttsAudioRef.current = null;
              }
              isPlayingTtsRef.current = false;
              updateStatusWithDebounce(strings.verbalFlashcardsSpokenPromptFinished, "idle", 0);
              resolvePlayback();
            };

            audio.onerror = (event) => {
              console.error("TTS audio error:", event);
              if (ttsAudioRef.current === audio) {
                ttsAudioRef.current = null;
              }
              isPlayingTtsRef.current = false;
              updateStatusWithDebounce(strings.verbalFlashcardsTtsAudioPlaybackFailed, "error", 0);
              resolvePlayback();
            };

            const playWhenReady = () => {
              if (playbackId !== ttsRequestIdRef.current || !isPageActiveRef.current) {
                resolvePlayback();
                return;
              }
              window.setTimeout(() => {
                if (playbackId !== ttsRequestIdRef.current || !isPageActiveRef.current) {
                  resolvePlayback();
                  return;
                }
                updateStatusWithDebounce(playbackStatusMessage, "recording", 0);
                audio.play().catch((err) => {
                  console.error("TTS playback start failed:", err);
                  if (ttsAudioRef.current === audio) {
                    ttsAudioRef.current = null;
                  }
                  isPlayingTtsRef.current = false;
                  updateStatusWithDebounce(strings.verbalFlashcardsTtsAudioPlaybackFailed, "error", 0);
                  resolvePlayback();
                });
              }, TTS_PLAYBACK_PREROLL_MS);
            };

            audio.preload = "auto";
            if (audio.readyState >= 3) {
              playWhenReady();
            } else {
              audio.oncanplay = playWhenReady;
              audio.load();
            }
          });
        })
        .catch((err) => {
          console.error("TTS request failed:", err);
          isPlayingTtsRef.current = false;
          updateStatusWithDebounce(strings.verbalFlashcardsTtsRequestFailed, "error", 0);
        });
    },
    [api, isPageActiveRef, updateStatusWithDebounce],
  );

  return {
    isPlayingTtsRef,
    speakText,
    stopTts,
  };
}
