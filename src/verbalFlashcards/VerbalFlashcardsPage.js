import React, { useContext, useEffect, useState, useRef, useCallback } from "react";
import { useHistory } from "react-router-dom";
import ReplayIcon from "@mui/icons-material/Replay";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import strings from "../i18n/definitions";
import * as s from "./verbalFlashcards_Styled/VerbalFlashcards.sc.js";
import {
  BETWEEN_CARDS_DELAY_MS,
  DEFAULT_LANGUAGE_ID,
  MIN_VOICE_BEFORE_STOP_ELIGIBLE_MS,
  SILENCE_THRESHOLD_MS,
  feedbackCopyForLanguage,
  promptInstructionIntroText,
  supportedRecordingMimeType,
} from "./verbalFlashcardsLanguage.js";

export default function VerbalFlashcardsPage() {
  const api = useContext(APIContext);
  const { userDetails } = useContext(UserContext);
  const history = useHistory();
  const translationLanguageId = userDetails?.native_language || DEFAULT_LANGUAGE_ID;
  const learnedLanguageId = userDetails?.learned_language || translationLanguageId;
  const feedbackCopy = feedbackCopyForLanguage(translationLanguageId);

  // State
  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [totalScore, setTotalScore] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userSpeech, setUserSpeech] = useState("");
  const [accuracyResult, setAccuracyResult] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);
  const [statusMessage, setStatusMessage] = useState(strings.loadingMsg);
  const [statusType, setStatusType] = useState("idle");
  const [noiseSensitivity, setNoiseSensitivity] = useState("0.08");
  const [correctBookmarks, setCorrectBookmarks] = useState([]);
  const [incorrectBookmarks, setIncorrectBookmarks] = useState([]);
  const [totalPracticedBookmarksInSession, setTotalPracticedBookmarksInSession] = useState(0);

  // Refs
  const mediaRecorderRef = useRef(null);
  const micStreamRef = useRef(null);
  const audioChunksRef = useRef([]);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationFrameRef = useRef(null);

  const statusUpdateTimeoutRef = useRef(null);
  const interCardDelayTimeoutRef = useRef(null);

  const currentCardIndexRef = useRef(0);
  const flashcardsRef = useRef([]);
  const isRecordingRef = useRef(false);
  const isCooldownRef = useRef(false);
  const isStartingRecordingRef = useRef(false);
  const shouldProcessRecordingOnStopRef = useRef(false);

  const lastVoiceDetectedAtRef = useRef(0);
  const voiceStartedAtRef = useRef(0);
  const recordingStartedAtRef = useRef(0);

  const ttsAudioRef = useRef(null);
  const ttsRequestIdRef = useRef(0);
  const isPlayingTtsRef = useRef(false);
  const exerciseSessionIdRef = useRef(null);
  const pageSessionStartedAtRef = useRef(null);
  const sessionEndedRef = useRef(false);
  const attemptCountsRef = useRef({});
  const beginCardFlowRef = useRef(() => {});
  const flowRunIdRef = useRef(0);
  const isResolvingCardRef = useRef(false);
  const sessionCreateRequestIdRef = useRef(0);
  const lastAutoStartedFlowKeyRef = useRef(null);
  const isPageActiveRef = useRef(true);

  useEffect(() => {
    currentCardIndexRef.current = currentCardIndex;
  }, [currentCardIndex]);

  useEffect(() => {
    flashcardsRef.current = flashcards;
  }, [flashcards]);

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  useEffect(() => {
    isCooldownRef.current = isCooldown;
  }, [isCooldown]);

  const updateStatusWithDebounce = useCallback((message, type, delay = 120) => {
    if (statusUpdateTimeoutRef.current) {
      clearTimeout(statusUpdateTimeoutRef.current);
    }

    setStatusMessage(message);
    setStatusType(type);

    statusUpdateTimeoutRef.current = setTimeout(() => {
      statusUpdateTimeoutRef.current = null;
    }, delay);
  }, []);

  const canContinueFlow = useCallback((flowRunId = null) => {
    if (!isPageActiveRef.current) return false;
    if (flowRunId !== null && flowRunId !== flowRunIdRef.current) return false;
    return true;
  }, []);

  const getCurrentCard = useCallback(() => {
    return flashcardsRef.current[currentCardIndexRef.current];
  }, []);

  const resetCardUi = useCallback(() => {
    setShowResult(false);
    setAccuracyResult(null);
    setUserSpeech("");
  }, []);

  const updateScoreAndStreak = useCallback((analysis) => {
    if (!analysis) return;

    if (analysis.isAccepted) {
      setTotalScore((prev) => prev + (analysis.accuracy || 0));
      setCurrentStreak((prev) => prev + 1);
      return;
    }

    setCurrentStreak(0);
  }, []);

  const displayResults = useCallback(
    (speech, analysis) => {
      setUserSpeech(speech);
      setAccuracyResult(analysis);
      setShowResult(true);
      updateScoreAndStreak(analysis);

      setTimeout(() => {
        const resultSection = document.getElementById("resultSection");
        if (resultSection) {
          resultSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }, 100);
    },
    [updateScoreAndStreak],
  );

  const getElapsedSessionSeconds = useCallback(() => {
    if (!pageSessionStartedAtRef.current) return 1;
    return Math.max(1, Math.round((Date.now() - pageSessionStartedAtRef.current) / 1000));
  }, []);

  const startExerciseSession = useCallback(() => {
    pageSessionStartedAtRef.current = Date.now();
    sessionEndedRef.current = false;
    exerciseSessionIdRef.current = null;
    sessionCreateRequestIdRef.current += 1;
    const requestId = sessionCreateRequestIdRef.current;

    api.exerciseSessionCreate((sessionId) => {
      if (sessionCreateRequestIdRef.current === requestId) {
        exerciseSessionIdRef.current = sessionId;
      }
    });
  }, [api]);

  const endExerciseSessionIfNeeded = useCallback(() => {
    if (sessionEndedRef.current) return;

    const exerciseSessionId = exerciseSessionIdRef.current;
    if (exerciseSessionId) {
      api.exerciseSessionEnd(exerciseSessionId, getElapsedSessionSeconds());
    }
    sessionEndedRef.current = true;
  }, [api, getElapsedSessionSeconds]);

  const finishSessionAndGoToSummary = useCallback(
    (nextCorrectBookmarks, nextIncorrectBookmarks, practicedCount) => {
      endExerciseSessionIfNeeded();
      history.push("/verbalFlashcards/summary", {
        isOutOfWordsToday: true,
        totalPracticedBookmarksInSession: practicedCount,
        correctBookmarks: nextCorrectBookmarks,
        incorrectBookmarks: nextIncorrectBookmarks,
        exerciseSessionTimer: getElapsedSessionSeconds(),
        source: "verbal_flashcards",
      });
    },
    [endExerciseSessionIfNeeded, getElapsedSessionSeconds, history],
  );

  const removeResolvedCard = useCallback(
    (card, nextCorrectBookmarks, nextIncorrectBookmarks, practicedCount) => {
      setFlashcards((prev) => {
        const remaining = prev.filter((item) => item.id !== card.id);
        flashcardsRef.current = remaining;

        if (remaining.length === 0) {
          setCurrentCardIndex(0);
          currentCardIndexRef.current = 0;
          finishSessionAndGoToSummary(nextCorrectBookmarks, nextIncorrectBookmarks, practicedCount);
          return remaining;
        }

        const currentIndex = currentCardIndexRef.current;
        const nextIndex = Math.min(currentIndex, remaining.length - 1);
        currentCardIndexRef.current = nextIndex;
        setCurrentCardIndex(nextIndex);
        return remaining;
      });
    },
    [finishSessionAndGoToSummary],
  );

  const loadFlashcards = useCallback(
    (afterLoad = null) => {
      setLoading(true);
      setShowResult(false);

      api.getFlashcards(null, (data) => {
        const cards = data.flashcards || [];
        setFlashcards(cards);
        flashcardsRef.current = cards;
        attemptCountsRef.current = {};

        if (cards.length > 0) {
          setCurrentCardIndex(0);
          currentCardIndexRef.current = 0;
        }

        setLoading(false);

        if (afterLoad) {
          afterLoad(cards);
        }
      });
    },
    [api],
  );

  const cleanupAudioResources = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      shouldProcessRecordingOnStopRef.current = false;
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        console.warn(e);
      }
    }

    ttsRequestIdRef.current += 1;
    if (ttsAudioRef.current) {
      try {
        ttsAudioRef.current.pause();
        ttsAudioRef.current.currentTime = 0;
        ttsAudioRef.current.src = "";
      } catch (e) {
        console.warn(e);
      }
    }
    ttsAudioRef.current = null;
    isPlayingTtsRef.current = false;

    mediaRecorderRef.current = null;

    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close().catch(console.warn);
      audioContextRef.current = null;
    }

    analyserRef.current = null;
    dataArrayRef.current = null;
    audioChunksRef.current = [];
    voiceStartedAtRef.current = 0;
    lastVoiceDetectedAtRef.current = 0;
    recordingStartedAtRef.current = 0;
    shouldProcessRecordingOnStopRef.current = false;
    isStartingRecordingRef.current = false;
    isRecordingRef.current = false;
    setIsRecording(false);
  }, []);

  const speakText = useCallback(
    (textToSpeak, languageId, playbackStatusMessage = strings.verbalFlashcardsPlayingTtsAudio) => {
      if (!textToSpeak) {
        updateStatusWithDebounce(strings.verbalFlashcardsNoTextAvailableForTts, "error");
        return Promise.resolve();
      }

      ttsRequestIdRef.current += 1;
      const playbackId = ttsRequestIdRef.current;

      if (ttsAudioRef.current) {
        try {
          ttsAudioRef.current.pause();
          ttsAudioRef.current.currentTime = 0;
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
            ttsAudioRef.current = audio;
            isPlayingTtsRef.current = true;
            updateStatusWithDebounce(playbackStatusMessage, "recording", 0);

            audio.onended = () => {
              if (ttsAudioRef.current === audio) {
                ttsAudioRef.current = null;
              }
              isPlayingTtsRef.current = false;
              updateStatusWithDebounce(strings.verbalFlashcardsSpokenPromptFinished, "idle", 0);
              resolve();
            };

            audio.onerror = (event) => {
              console.error("TTS audio error:", event);
              if (ttsAudioRef.current === audio) {
                ttsAudioRef.current = null;
              }
              isPlayingTtsRef.current = false;
              updateStatusWithDebounce(strings.verbalFlashcardsTtsAudioPlaybackFailed, "error", 0);
              resolve();
            };

            audio.play().catch((err) => {
              console.error("TTS playback start failed:", err);
              if (ttsAudioRef.current === audio) {
                ttsAudioRef.current = null;
              }
              isPlayingTtsRef.current = false;
              updateStatusWithDebounce(strings.verbalFlashcardsTtsAudioPlaybackFailed, "error", 0);
              resolve();
            });
          });
        })
        .catch((err) => {
          console.error("TTS request failed:", err);
          isPlayingTtsRef.current = false;
          updateStatusWithDebounce(strings.verbalFlashcardsTtsRequestFailed, "error", 0);
        });
    },
    [api, updateStatusWithDebounce],
  );

  const playCardTts = useCallback(
    (card = null) => {
      const cardToSpeak = card || getCurrentCard();
      const answerText = cardToSpeak?.answer || "";
      const introText = promptInstructionIntroText(translationLanguageId, learnedLanguageId);

      return speakText(introText, translationLanguageId).then(() => {
        if (!answerText || !isPageActiveRef.current) {
          return;
        }
        return speakText(answerText, learnedLanguageId, strings.verbalFlashcardsPlayingAnswer);
      });
    },
    [getCurrentCard, learnedLanguageId, speakText, translationLanguageId],
  );

  const speakFeedback = useCallback(
    (textToSpeak) => {
      return speakText(textToSpeak, translationLanguageId, strings.verbalFlashcardsPlayingFeedback);
    },
    [speakText, translationLanguageId],
  );

  const resolveCardAttempt = useCallback(
    (card, userAnswer, isCorrect, feedbackAnalysis) => {
      if (!card || !canContinueFlow()) return;
      const responseTime = recordingStartedAtRef.current ? Date.now() - recordingStartedAtRef.current : 0;
      const exerciseSessionId = exerciseSessionIdRef.current;

      if (exerciseSessionId && pageSessionStartedAtRef.current) {
        const elapsedSeconds = Math.max(1, Math.round((Date.now() - pageSessionStartedAtRef.current) / 1000));
        api.exerciseSessionUpdate(exerciseSessionId, elapsedSeconds);
      }

      api.submitFlashcardAnswer(
        card.id,
        userAnswer,
        isCorrect,
        "speech",
        responseTime,
        exerciseSessionId,
        (response) => {
          if (!canContinueFlow()) return;
          if (!response || response.error || response.success === false) {
            updateStatusWithDebounce(
              `${strings.verbalFlashcardsCouldNotSaveResult}${response?.error ? `: ${response.error}` : ""}`,
              "error",
              0,
            );
            return;
          }

          const wasAccepted = Boolean(response.is_correct);
          const nextCorrectBookmarks = wasAccepted ? [...correctBookmarks, card] : correctBookmarks;
          const nextIncorrectBookmarks = wasAccepted ? incorrectBookmarks : [...incorrectBookmarks, card];
          const practicedCount = totalPracticedBookmarksInSession + 1;
          setCorrectBookmarks(nextCorrectBookmarks);
          setIncorrectBookmarks(nextIncorrectBookmarks);
          setTotalPracticedBookmarksInSession(practicedCount);
          delete attemptCountsRef.current[card.id];

          isResolvingCardRef.current = true;
          const feedbackMessage = feedbackAnalysis?.feedback;
          const spokenFeedback = feedbackMessage || (wasAccepted ? feedbackCopy.successIntro : feedbackCopy.finalIncorrectIntro);
          const speakResolvedFeedback = feedbackAnalysis?.speakAnswerAfterFeedback
            ? () =>
                speakFeedback(feedbackCopy.finalIncorrectIntro).then(() => {
                  if (!card.answer || !isPageActiveRef.current) {
                    return;
                  }
                  return speakText(card.answer, learnedLanguageId, strings.verbalFlashcardsPlayingAnswer);
                })
            : () => speakFeedback(spokenFeedback);

          speakResolvedFeedback().finally(() => {
            if (!canContinueFlow()) {
              isResolvingCardRef.current = false;
              return;
            }
            interCardDelayTimeoutRef.current = setTimeout(() => {
              interCardDelayTimeoutRef.current = null;
              isResolvingCardRef.current = false;
              if (!canContinueFlow()) return;
              removeResolvedCard(card, nextCorrectBookmarks, nextIncorrectBookmarks, practicedCount);
            }, BETWEEN_CARDS_DELAY_MS);
          });
        },
        (error) => {
          updateStatusWithDebounce(`${strings.verbalFlashcardsCouldNotSaveResult}: ${error}`, "error", 0);
        },
      );
    },
    [
      api,
      correctBookmarks,
      incorrectBookmarks,
      feedbackCopy,
      learnedLanguageId,
      removeResolvedCard,
      speakFeedback,
      speakText,
      totalPracticedBookmarksInSession,
      canContinueFlow,
      updateStatusWithDebounce,
    ],
  );

  const handleAttemptOutcome = useCallback(
    (card, userAnswer, analysis) => {
      if (!card || !canContinueFlow()) return;

      const isCorrect = Boolean(analysis?.isAccepted);
      const feedbackMessage = analysis?.feedback || (isCorrect ? feedbackCopy.successIntro : feedbackCopy.retryPrompt);
      const nextAttemptCount = (attemptCountsRef.current[card.id] || 0) + 1;
      attemptCountsRef.current[card.id] = nextAttemptCount;

      if (isCorrect) {
        resolveCardAttempt(card, userAnswer, true, { feedback: feedbackMessage });
        return;
      }

      if (nextAttemptCount === 1) {
        speakFeedback(feedbackMessage).finally(() => {
          if (!canContinueFlow()) {
            return;
          }
          setIsCooldown(true);
          isCooldownRef.current = true;
          updateStatusWithDebounce(strings.verbalFlashcardsGetReadyToTryAgain, "cooldown", 0);
          interCardDelayTimeoutRef.current = setTimeout(() => {
            interCardDelayTimeoutRef.current = null;
            if (!canContinueFlow()) {
              setIsCooldown(false);
              isCooldownRef.current = false;
              return;
            }
            setIsCooldown(false);
            isCooldownRef.current = false;
            updateStatusWithDebounce(strings.verbalFlashcardsRetryingSameCard, "processing", 0);
            if (getCurrentCard()?.id === card.id) {
              beginCardFlowRef.current();
            }
          }, BETWEEN_CARDS_DELAY_MS);
        });
        return;
      }

      resolveCardAttempt(card, userAnswer, false, analysis);
    },
    [feedbackCopy, getCurrentCard, resolveCardAttempt, speakFeedback, canContinueFlow],
  );

  const feedbackForAttempt = useCallback(
    (card, analysis) => {
      if (!card || !analysis || analysis.isAccepted) {
        return analysis;
      }

      const nextAttemptCount = (attemptCountsRef.current[card.id] || 0) + 1;
      if (nextAttemptCount < 2) {
        return analysis;
      }

      return {
        ...analysis,
        feedback: `${feedbackCopy.finalIncorrectIntro} ${card.answer}`,
        speakAnswerAfterFeedback: true,
      };
    },
    [feedbackCopy],
  );

  const stopRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;

    if (recorder && recorder.state === "recording") {
      shouldProcessRecordingOnStopRef.current = true;
      try {
        recorder.stop();
      } catch (e) {
        console.warn(e);
      }
    }

    isRecordingRef.current = false;
    setIsRecording(false);
    isStartingRecordingRef.current = false;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    updateStatusWithDebounce(strings.verbalFlashcardsProcessing, "processing", 0);
  }, [updateStatusWithDebounce]);

  const handleRecordingStop = useCallback(() => {
    const flowRunId = flowRunIdRef.current;

    if (!canContinueFlow(flowRunId)) {
      cleanupAudioResources();
      return;
    }

    if (!shouldProcessRecordingOnStopRef.current) {
      cleanupAudioResources();
      updateStatusWithDebounce(strings.verbalFlashcardsRecordingCancelled, "idle", 0);
      return;
    }

    const currentCard = getCurrentCard();

    if (!currentCard) {
      updateStatusWithDebounce(strings.verbalFlashcardsNoFlashcardLoaded, "error");
      cleanupAudioResources();
      return;
    }

    if (!audioChunksRef.current.length) {
      updateStatusWithDebounce(strings.verbalFlashcardsNoAudioDetected, "error");
      cleanupAudioResources();
      return;
    }

    const mimeType = mediaRecorderRef.current?.mimeType || "audio/webm";
    const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

    updateStatusWithDebounce(strings.verbalFlashcardsProcessing, "processing", 0);

    api.transcribeAudio(
      audioBlob,
      (result) => {
        if (!canContinueFlow(flowRunId)) {
          cleanupAudioResources();
          return;
        }

        if (result?.error) {
          console.error("Transcription error:", result.error);
          updateStatusWithDebounce(`${strings.verbalFlashcardsErrorPrefix}: ${result.error}`, "error");
          cleanupAudioResources();
          return;
        }

        const transcription = result?.transcription || "";
        const expectedText = currentCard.answer;

        api.checkPronunciation(
          transcription,
          expectedText,
          (analysis) => {
            if (!canContinueFlow(flowRunId)) {
              cleanupAudioResources();
              return;
            }

            if (analysis?.error) {
              console.error("Pronunciation check error:", analysis.error);
              updateStatusWithDebounce(strings.verbalFlashcardsCouldNotEvaluatePronunciation, "error", 0);
              cleanupAudioResources();
              return;
            } else {
              const analysisWithAttemptFeedback = feedbackForAttempt(currentCard, analysis);
              displayResults(transcription, analysisWithAttemptFeedback);
              cleanupAudioResources();
              handleAttemptOutcome(currentCard, transcription, analysisWithAttemptFeedback);
            }
          },
          () => {
            updateStatusWithDebounce(strings.verbalFlashcardsCouldNotEvaluatePronunciation, "error", 0);
            cleanupAudioResources();
          },
        );
      },
      () => {
        updateStatusWithDebounce(strings.verbalFlashcardsCouldNotEvaluatePronunciation, "error", 0);
        cleanupAudioResources();
      },
    );
  }, [
    api,
    canContinueFlow,
    cleanupAudioResources,
    displayResults,
    feedbackForAttempt,
    getCurrentCard,
    handleAttemptOutcome,
    updateStatusWithDebounce,
  ]);

  const setupSilenceDetection = useCallback(() => {
    if (!micStreamRef.current) return;

    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.85;

      const source = audioContext.createMediaStreamSource(micStreamRef.current);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;

      const detect = () => {
        if (!isRecordingRef.current || !analyserRef.current || !dataArrayRef.current) {
          return;
        }

        analyserRef.current.getByteTimeDomainData(dataArrayRef.current);

        let sumSquares = 0;
        let maxSample = 0;

        for (let i = 0; i < dataArrayRef.current.length; i++) {
          const v = (dataArrayRef.current[i] - 128) / 128;
          const abs = Math.abs(v);
          if (abs > maxSample) maxSample = abs;
          sumSquares += v * v;
        }

        const rms = Math.sqrt(sumSquares / dataArrayRef.current.length);
        const threshold = parseFloat(noiseSensitivity);
        const isVoiceFrame = maxSample > threshold || rms > threshold;
        const now = Date.now();

        if (isVoiceFrame) {
          lastVoiceDetectedAtRef.current = now;

          if (!voiceStartedAtRef.current) {
            voiceStartedAtRef.current = now;
          }

          updateStatusWithDebounce(strings.verbalFlashcardsRecordingSpeakNow, "recording", 0);
        } else {
          const voicedFor = voiceStartedAtRef.current > 0 ? now - voiceStartedAtRef.current : 0;

          const silenceDuration =
            lastVoiceDetectedAtRef.current > 0
              ? now - lastVoiceDetectedAtRef.current
              : now - recordingStartedAtRef.current;

          if (voicedFor >= MIN_VOICE_BEFORE_STOP_ELIGIBLE_MS && silenceDuration >= SILENCE_THRESHOLD_MS) {
            stopRecording();
            return;
          }

          updateStatusWithDebounce(strings.verbalFlashcardsWaitingForSpeech, "processing", 0);
        }

        animationFrameRef.current = requestAnimationFrame(detect);
      };

      if (audioContext.state === "suspended") {
        audioContext.resume().catch(console.warn);
      }

      detect();
    } catch (error) {
      console.error("Silence detection setup error:", error);
      updateStatusWithDebounce(strings.verbalFlashcardsMicAnalysisError, "error");
    }
  }, [noiseSensitivity, stopRecording, updateStatusWithDebounce]);

  const openMicAndStartRecording = useCallback(async () => {
    if (isStartingRecordingRef.current || isRecordingRef.current) return;
    if (isCooldownRef.current) return;

    try {
      isStartingRecordingRef.current = true;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      if (isCooldownRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        isStartingRecordingRef.current = false;
        return;
      }

      micStreamRef.current = stream;

      const mimeType = supportedRecordingMimeType();
      mediaRecorderRef.current = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);

      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = handleRecordingStop;
      shouldProcessRecordingOnStopRef.current = true;

      recordingStartedAtRef.current = Date.now();
      lastVoiceDetectedAtRef.current = Date.now();
      voiceStartedAtRef.current = 0;

      mediaRecorderRef.current.start();

      isRecordingRef.current = true;
      setIsRecording(true);
      isStartingRecordingRef.current = false;

      setShowResult(false);
      setAccuracyResult(null);

      updateStatusWithDebounce(strings.verbalFlashcardsRecordingSpeakNow, "recording", 0);
      setupSilenceDetection();
    } catch (error) {
      console.error("Recording start error:", error);
      isStartingRecordingRef.current = false;
      isRecordingRef.current = false;
      setIsRecording(false);
      updateStatusWithDebounce(strings.verbalFlashcardsMicrophonePermissionNeeded, "error");
      cleanupAudioResources();
    }
  }, [cleanupAudioResources, handleRecordingStop, setupSilenceDetection, updateStatusWithDebounce]);

  const cancelCountdown = useCallback(() => {
    if (interCardDelayTimeoutRef.current) {
      clearTimeout(interCardDelayTimeoutRef.current);
      interCardDelayTimeoutRef.current = null;
    }

    isResolvingCardRef.current = false;

    setIsCooldown(false);
    isCooldownRef.current = false;
  }, []);

  const stopCurrentFlow = useCallback(() => {
    flowRunIdRef.current += 1;
    cancelCountdown();

    if (isRecordingRef.current || isStartingRecordingRef.current || micStreamRef.current) {
      cleanupAudioResources();
    }
  }, [cancelCountdown, cleanupAudioResources]);

  const beginCardFlow = useCallback(() => {
    if (flashcardsRef.current.length === 0) return;
    if (isResolvingCardRef.current) return;

    stopCurrentFlow();
    resetCardUi();

    const card = flashcardsRef.current[currentCardIndexRef.current];
    setIsCooldown(true);
    isCooldownRef.current = true;
    updateStatusWithDebounce(strings.verbalFlashcardsListenCarefully, "cooldown", 0);

    const flowRunId = flowRunIdRef.current;

    if (!card) {
      setIsCooldown(false);
      isCooldownRef.current = false;
      return;
    }

    playCardTts(card).finally(async () => {
      if (flowRunId !== flowRunIdRef.current) {
        return;
      }

      setIsCooldown(false);
      isCooldownRef.current = false;
      updateStatusWithDebounce(strings.verbalFlashcardsStartingMicrophone, "processing", 0);

      await openMicAndStartRecording();
    });
  }, [openMicAndStartRecording, playCardTts, resetCardUi, stopCurrentFlow, updateStatusWithDebounce]);

  useEffect(() => {
    beginCardFlowRef.current = beginCardFlow;
  }, [beginCardFlow]);

  const nextCard = useCallback(() => {
    if (currentCardIndexRef.current < flashcardsRef.current.length - 1) {
      stopCurrentFlow();
      const nextIndex = currentCardIndexRef.current + 1;
      currentCardIndexRef.current = nextIndex;
      setCurrentCardIndex(nextIndex);
    }
  }, [stopCurrentFlow]);

  const prevCard = useCallback(() => {
    if (currentCardIndexRef.current > 0) {
      stopCurrentFlow();
      const prevIndex = currentCardIndexRef.current - 1;
      currentCardIndexRef.current = prevIndex;
      setCurrentCardIndex(prevIndex);
    }
  }, [stopCurrentFlow]);

  const shuffleCards = useCallback(() => {
    stopCurrentFlow();
    const shuffled = [...flashcardsRef.current].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    flashcardsRef.current = shuffled;
    setCurrentCardIndex(0);
    currentCardIndexRef.current = 0;
  }, [stopCurrentFlow]);

  const repeatCard = useCallback(() => {
    beginCardFlow();
  }, [beginCardFlow]);

  useEffect(() => {
    isPageActiveRef.current = true;
    loadFlashcards();
  }, [loadFlashcards]);

  useEffect(() => {
    startExerciseSession();

    return () => {
      endExerciseSessionIfNeeded();
    };
  }, [endExerciseSessionIfNeeded, startExerciseSession]);

  useEffect(() => {
    if (loading) return;
    if (flashcards.length === 0) return;

    const currentCard = flashcards[currentCardIndex];
    if (!currentCard) return;

    const autoStartKey = `${currentCard.id}:${currentCardIndex}:${flashcards.length}`;
    const isCurrentFlowAlreadyStarting =
      lastAutoStartedFlowKeyRef.current === autoStartKey &&
      (isCooldownRef.current || isPlayingTtsRef.current || isStartingRecordingRef.current || isRecordingRef.current);

    if (isCurrentFlowAlreadyStarting) {
      return;
    }

    lastAutoStartedFlowKeyRef.current = autoStartKey;
    beginCardFlow();
  }, [currentCardIndex, flashcards, loading, beginCardFlow]);

  useEffect(() => {
    const unlisten = history.listen(() => {
      isPageActiveRef.current = false;
      stopCurrentFlow();
    });

    return () => {
      isPageActiveRef.current = false;
      flowRunIdRef.current += 1;
      cancelCountdown();

      if (statusUpdateTimeoutRef.current) {
        clearTimeout(statusUpdateTimeoutRef.current);
      }

      cleanupAudioResources();
      unlisten();
    };
  }, [cancelCountdown, cleanupAudioResources, history, stopCurrentFlow]);

  const currentCard = flashcards[currentCardIndex];

  const renderWordBreakdown = (wordMatches) => {
    if (!wordMatches || wordMatches.length === 0) return null;

    return (
      <s.WordBreakdown>
        <h5>{strings.verbalFlashcardsWordBreakdown}</h5>
        <s.WordList>
          {wordMatches.map((match, idx) => (
            <s.WordItem key={idx} $isCorrect={match.isCorrect}>
              <s.WordText>{match.word}</s.WordText>
              <s.WordPosition>{match.position + 1}</s.WordPosition>
              <s.WordStatus>{match.isCorrect ? "✓" : "✗"}</s.WordStatus>
              {match.suggestedWord && !match.isCorrect && <s.WordSuggestion>→ {match.suggestedWord}</s.WordSuggestion>}
            </s.WordItem>
          ))}
        </s.WordList>
      </s.WordBreakdown>
    );
  };

  return (
    <s.FlashcardsContainer>
      <s.HeaderSection>
        <s.TitleSection>
          <s.TitleContainer>
            <h2>{strings.verbalFlashcardsTitle}</h2>
          </s.TitleContainer>
          <s.FiltersContainer>
            <s.FilterSelect value={noiseSensitivity} onChange={(e) => setNoiseSensitivity(e.target.value)}>
              <option value="0.03">{strings.verbalFlashcardsLowNoise}</option>
              <option value="0.08">{strings.verbalFlashcardsMediumNoise}</option>
              <option value="0.11">{strings.verbalFlashcardsHighNoise}</option>
            </s.FilterSelect>
          </s.FiltersContainer>
        </s.TitleSection>

        <s.StatsContainer>
          <s.StatItem>
            <s.StatLabel>{strings.verbalFlashcardsProgress}</s.StatLabel>
            <s.StatValue>{`${flashcards.length > 0 ? currentCardIndex + 1 : 0}/${flashcards.length}`}</s.StatValue>
          </s.StatItem>
          <s.StatItem>
            <s.StatLabel>{strings.verbalFlashcardsScore}</s.StatLabel>
            <s.StatValue>{Math.round(totalScore)}</s.StatValue>
          </s.StatItem>
          <s.StatItem>
            <s.StatLabel>{strings.verbalFlashcardsStreak}</s.StatLabel>
            <s.StatValue $isStreak={currentStreak > 0}>{currentStreak}</s.StatValue>
          </s.StatItem>
        </s.StatsContainer>
      </s.HeaderSection>

      <s.Flashcard>
        <s.CardContent>
          {loading ? (
            <s.LoadingState>
              <s.Spinner />
              <p>{strings.verbalFlashcardsLoading}</p>
            </s.LoadingState>
          ) : flashcards.length === 0 ? (
            <s.NoCardsMessage>
              <p>{strings.verbalFlashcardsNoCards}</p>
            </s.NoCardsMessage>
          ) : (
            currentCard && (
              <>
                <s.PromptSection>
                  <s.PromptLabel>{strings.verbalFlashcardsSayThis}</s.PromptLabel>
                  <s.PromptText>{currentCard.prompt}</s.PromptText>
                </s.PromptSection>

                <s.RecordingSection>
                  <s.StatusMessage $statusType={statusType}>{statusMessage}</s.StatusMessage>

                  {isRecording && (
                    <s.RecordingVisualization>
                      <s.SoundWave>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                      </s.SoundWave>
                    </s.RecordingVisualization>
                  )}
                </s.RecordingSection>

                {showResult && accuracyResult && (
                  <s.ResultSection id="resultSection">
                    <h4>{strings.verbalFlashcardsYourAttempt}</h4>
                    <s.UserSpeech>{userSpeech || strings.verbalFlashcardsNoSpeechDetected}</s.UserSpeech>

                    <s.FeedbackContainer>
                      <s.AccuracyMeter>
                        <s.AccuracyLabel>{strings.verbalFlashcardsAccuracy}</s.AccuracyLabel>
                        <s.ProgressBar>
                          <s.ProgressFill
                            $accuracy={accuracyResult.accuracy}
                            style={{ width: `${accuracyResult.accuracy}%` }}
                          />
                        </s.ProgressBar>
                        <s.AccuracyPercentage>{accuracyResult.accuracy}%</s.AccuracyPercentage>
                      </s.AccuracyMeter>

                      <s.FeedbackMessage $feedbackType={accuracyResult.isAccepted ? "success" : "warning"}>
                        {accuracyResult.feedback}
                      </s.FeedbackMessage>
                    </s.FeedbackContainer>

                    {renderWordBreakdown(accuracyResult.wordMatches)}
                  </s.ResultSection>
                )}

                <s.ActionButtons>
                  <s.NavigationButtons>
                    <s.NavButton onClick={prevCard} disabled={currentCardIndex === 0}>
                      {strings.verbalFlashcardsPrevious}
                    </s.NavButton>
                    <s.NavButton onClick={nextCard} disabled={currentCardIndex === flashcards.length - 1}>
                      {strings.verbalFlashcardsNext}
                    </s.NavButton>
                  </s.NavigationButtons>

                  <s.UtilityButtons>
                    <s.UtilityButton
                      onClick={shuffleCards}
                      title={strings.verbalFlashcardsShuffleCards}
                      aria-label={strings.verbalFlashcardsShuffleCards}
                    >
                      <ShuffleIcon fontSize="small" />
                    </s.UtilityButton>
                    <s.UtilityButton
                      onClick={repeatCard}
                      title={strings.verbalFlashcardsRepeatThisCard}
                      aria-label={strings.verbalFlashcardsRepeatThisCard}
                    >
                      <ReplayIcon fontSize="small" />
                    </s.UtilityButton>
                  </s.UtilityButtons>
                </s.ActionButtons>
              </>
            )
          )}
        </s.CardContent>
      </s.Flashcard>
    </s.FlashcardsContainer>
  );
}
