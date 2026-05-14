import { useCallback, useRef } from "react";
import strings from "../../i18n/definitions";
import { TTS_PLAYBACK_PREROLL_MS } from "../verbalFlashcardsLanguage";

const TTS_PRELOAD_TIMEOUT_MS = 2500;
const TTS_PLAY_READY_TIMEOUT_MS = 2500;
const TTS_MAX_PLAYBACK_MS = 12000;

export default function useVerbalFlashcardTTS({ api, isPageActiveRef, updateStatusWithDebounce }) {
  const ttsAudioRef = useRef(null);
  const ttsRequestIdRef = useRef(0);
  const resolvePlaybackRef = useRef(null);
  const isPlayingTtsRef = useRef(false);

  const resetAudio = useCallback((audio) => {
    try {
      audio.oncanplay = null;
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
      audio.currentTime = 0;
      audio.removeAttribute("src");
      audio.load();
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const stopTts = useCallback(() => {
    ttsRequestIdRef.current += 1;

    if (ttsAudioRef.current) {
      resetAudio(ttsAudioRef.current);
    }

    ttsAudioRef.current = null;
    isPlayingTtsRef.current = false;

    if (resolvePlaybackRef.current) {
      resolvePlaybackRef.current();
      resolvePlaybackRef.current = null;
    }
  }, [resetAudio]);

  const preloadText = useCallback(
    (textToSpeak, languageId) => {
      if (!textToSpeak) {
        return Promise.resolve(null);
      }

      return api
        .fetchLinkToSpeechMp3(textToSpeak, languageId)
        .then((audioUrl) => {
          if (!audioUrl) return null;

          return new Promise((resolve) => {
            const audio = new Audio(audioUrl);
            let resolved = false;
            let preloadTimeout = null;

            const finish = (preloadedAudio) => {
              if (resolved) return;
              resolved = true;
              if (preloadTimeout) {
                clearTimeout(preloadTimeout);
              }
              resolve(preloadedAudio);
            };

            audio.preload = "auto";
            audio.oncanplay = () => finish(audio);
            audio.onerror = (event) => {
              console.error("TTS preload error:", event);
              finish(null);
            };
            audio.load();

            preloadTimeout = window.setTimeout(() => {
              finish(audio);
            }, TTS_PRELOAD_TIMEOUT_MS);

            if (audio.readyState >= 3) {
              finish(audio);
            }
          });
        })
        .catch((err) => {
          console.error("TTS preload request failed:", err);
          return null;
        });
    },
    [api],
  );

  const playAudio = useCallback(
    (audio, playbackId, playbackStatusMessage) => {
      if (!audio) {
        updateStatusWithDebounce(strings.verbalFlashcardsTtsReturnedNoAudioPath, "error", 0);
        return Promise.resolve();
      }

      if (resolvePlaybackRef.current) {
        resolvePlaybackRef.current();
        resolvePlaybackRef.current = null;
      }

      if (ttsAudioRef.current && ttsAudioRef.current !== audio) {
        resetAudio(ttsAudioRef.current);
      }

      if (playbackId !== ttsRequestIdRef.current || !isPageActiveRef.current) {
        return Promise.resolve();
      }

      return new Promise((resolve) => {
        let didResolve = false;
        let playReadyTimeout = null;
        let playbackTimeout = null;
        ttsAudioRef.current = audio;
        isPlayingTtsRef.current = true;

        const resolvePlayback = () => {
          if (didResolve) return;
          didResolve = true;
          if (playReadyTimeout) {
            clearTimeout(playReadyTimeout);
          }
          if (playbackTimeout) {
            clearTimeout(playbackTimeout);
          }
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
          if (didResolve) {
            return;
          }
          if (playbackId !== ttsRequestIdRef.current || !isPageActiveRef.current) {
            resolvePlayback();
            return;
          }
          if (playReadyTimeout) {
            clearTimeout(playReadyTimeout);
            playReadyTimeout = null;
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

        playbackTimeout = window.setTimeout(() => {
          console.warn("TTS playback timed out");
          if (ttsAudioRef.current === audio) {
            ttsAudioRef.current = null;
          }
          isPlayingTtsRef.current = false;
          resolvePlayback();
        }, TTS_MAX_PLAYBACK_MS);

        if (audio.readyState >= 3) {
          playWhenReady();
        } else {
          audio.oncanplay = playWhenReady;
          audio.load();
          playReadyTimeout = window.setTimeout(() => {
            playWhenReady();
          }, TTS_PLAY_READY_TIMEOUT_MS);
        }
      });
    },
    [isPageActiveRef, resetAudio, updateStatusWithDebounce],
  );

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
        resetAudio(ttsAudioRef.current);
        ttsAudioRef.current = null;
      }

      isPlayingTtsRef.current = false;
      updateStatusWithDebounce(strings.verbalFlashcardsRequestingTtsAudio, "processing", 0);

      return preloadText(textToSpeak, languageId)
        .then((audio) => playAudio(audio, playbackId, playbackStatusMessage))
        .catch((err) => {
          console.error("TTS request failed:", err);
          isPlayingTtsRef.current = false;
          updateStatusWithDebounce(strings.verbalFlashcardsTtsRequestFailed, "error", 0);
        });
    },
    [playAudio, preloadText, resetAudio, updateStatusWithDebounce],
  );

  const playPreloadedAudio = useCallback(
    (audio, playbackStatusMessage = strings.verbalFlashcardsPlayingTtsAudio) => {
      ttsRequestIdRef.current += 1;
      const playbackId = ttsRequestIdRef.current;
      return playAudio(audio, playbackId, playbackStatusMessage);
    },
    [playAudio],
  );

  return {
    isPlayingTtsRef,
    playPreloadedAudio,
    preloadText,
    speakText,
    stopTts,
  };
}
