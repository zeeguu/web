import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import strings from "../i18n/definitions";
import FlashcardsHeader from "./components/FlashcardsHeader";
import FlashcardStage from "./components/FlashcardStage";
import useAudioRecorder from "../hooks/useAudioRecorder";
import useFinalPracticeAttempt from "./hooks/useFinalPracticeAttempt";
import useFlashcardExerciseSession from "./hooks/useFlashcardExerciseSession";
import useVerbalFlashcardTTS from "./hooks/useVerbalFlashcardTTS";
import { isRevealAnswerIntent } from "./verbalFlashcardsIntent";
import * as s from "./verbalFlashcards_Styled/VerbalFlashcards.sc.js";
import {
  BETWEEN_CARDS_DELAY_MS,
  DEFAULT_LANGUAGE_ID,
  feedbackCopyForLanguage,
  promptInstructionText,
} from "./verbalFlashcardsLanguage.js";

export default function VerbalFlashcardsPage() {
  const api = useContext(APIContext);
  const { userDetails } = useContext(UserContext);
  const history = useHistory();
  const translationLanguageId = userDetails?.native_language || DEFAULT_LANGUAGE_ID;
  const learnedLanguageId = userDetails?.learned_language || translationLanguageId;
  const feedbackCopy = feedbackCopyForLanguage(translationLanguageId);

  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [initialFlashcardsCount, setInitialFlashcardsCount] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [accuracyResult, setAccuracyResult] = useState(null);
  const [isCooldown, setIsCooldown] = useState(false);
  const [statusMessage, setStatusMessage] = useState(strings.loadingMsg);
  const [statusType, setStatusType] = useState("idle");
  const [noiseSensitivity, setNoiseSensitivity] = useState("0.08");
  const [noiseSensitivityNoticeVisible, setNoiseSensitivityNoticeVisible] = useState(false);
  const [correctBookmarks, setCorrectBookmarks] = useState([]);
  const [incorrectBookmarks, setIncorrectBookmarks] = useState([]);
  const [totalPracticedBookmarksInSession, setTotalPracticedBookmarksInSession] = useState(0);

  const statusUpdateTimeoutRef = useRef(null);
  const interCardDelayTimeoutRef = useRef(null);
  const interCardDelayIntervalRef = useRef(null);
  const noiseSensitivityNoticeTimeoutRef = useRef(null);
  const currentCardIndexRef = useRef(0);
  const flashcardsRef = useRef([]);
  const isCooldownRef = useRef(false);
  const attemptCountsRef = useRef({});
  const retrySameCardRecordingRef = useRef(() => {});
  const flowRunIdRef = useRef(0);
  const isResolvingCardRef = useRef(false);
  const lastAutoStartedFlowKeyRef = useRef(null);
  const isPageActiveRef = useRef(true);
  const cleanupRecordingResourcesRef = useRef(() => {});
  const prepareMicrophoneRef = useRef(() => Promise.resolve(null));

  const {
    endExerciseSessionIfNeeded,
    finishSessionAndGoToSummary,
    getExerciseSessionId,
    startExerciseSession,
    updateExerciseSessionProgress,
  } = useFlashcardExerciseSession({ api, history });

  useEffect(() => {
    currentCardIndexRef.current = currentCardIndex;
  }, [currentCardIndex]);

  useEffect(() => {
    flashcardsRef.current = flashcards;
  }, [flashcards]);

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

  const updateNoiseSensitivity = useCallback((value) => {
    setNoiseSensitivity(value);
    setNoiseSensitivityNoticeVisible(true);

    if (noiseSensitivityNoticeTimeoutRef.current) {
      clearTimeout(noiseSensitivityNoticeTimeoutRef.current);
    }

    noiseSensitivityNoticeTimeoutRef.current = window.setTimeout(() => {
      noiseSensitivityNoticeTimeoutRef.current = null;
      setNoiseSensitivityNoticeVisible(false);
    }, 1600);
  }, []);

  const clearInterCardDelay = useCallback(() => {
    if (interCardDelayTimeoutRef.current) {
      clearTimeout(interCardDelayTimeoutRef.current);
      interCardDelayTimeoutRef.current = null;
    }

    if (interCardDelayIntervalRef.current) {
      clearInterval(interCardDelayIntervalRef.current);
      interCardDelayIntervalRef.current = null;
    }
  }, []);

  const interCardCountdownMessage = useCallback((seconds) => {
    return strings.verbalFlashcardsNextCardCountdown.replace("{seconds}", seconds);
  }, []);

  const startInterCardCountdown = useCallback(
    (onComplete) => {
      clearInterCardDelay();

      let secondsRemaining = Math.ceil(BETWEEN_CARDS_DELAY_MS / 1000);
      updateStatusWithDebounce(interCardCountdownMessage(secondsRemaining), "cooldown", 0);

      interCardDelayIntervalRef.current = window.setInterval(() => {
        secondsRemaining -= 1;
        if (secondsRemaining > 0) {
          updateStatusWithDebounce(interCardCountdownMessage(secondsRemaining), "cooldown", 0);
        }
      }, 1000);

      interCardDelayTimeoutRef.current = window.setTimeout(() => {
        clearInterCardDelay();
        onComplete();
      }, BETWEEN_CARDS_DELAY_MS);
    },
    [clearInterCardDelay, interCardCountdownMessage, updateStatusWithDebounce],
  );

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
  }, []);

  const cardToSummaryBookmark = useCallback((card) => {
    return {
      ...card,
      from: card.answer,
      to: card.prompt,
      fit_for_study: true,
    };
  }, []);

  const displayResults = useCallback(
    (analysis) => {
      setAccuracyResult(analysis);
      setShowResult(true);

      setTimeout(() => {
        const resultSection = document.getElementById("resultSection");
        if (resultSection) {
          resultSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }, 100);
    },
    [],
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
        setInitialFlashcardsCount(cards.length);
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

  const { isPlayingTtsRef, playPreloadedAudio, preloadText, speakText, stopTts } = useVerbalFlashcardTTS({
    api,
    isPageActiveRef,
    updateStatusWithDebounce,
  });

  const playCardTts = useCallback(
    (card = null, flowRunId = flowRunIdRef.current) => {
      const cardToSpeak = card || getCurrentCard();
      const promptText = cardToSpeak?.prompt || "";
      if (!promptText || !isPageActiveRef.current) {
        return Promise.resolve();
      }
      const fullPromptText = promptInstructionText(translationLanguageId, promptText);
      return speakText(fullPromptText, translationLanguageId, strings.verbalFlashcardsPlayingPrompt).then(() => {
        if (flowRunId !== flowRunIdRef.current) {
          return;
        }
      });
    },
    [getCurrentCard, speakText, translationLanguageId],
  );

  const speakFeedback = useCallback(
    (textToSpeak) => {
      return speakText(textToSpeak, translationLanguageId, strings.verbalFlashcardsPlayingFeedback);
    },
    [speakText, translationLanguageId],
  );

  const {
    clearFinalPractice,
    handleFinalPracticeAnalysis,
    handleFinalPracticeError,
    promptFinalPracticeAfterAnswer,
  } = useFinalPracticeAttempt({
    canContinueFlow,
    cleanupRecordingResourcesRef,
    displayResults,
    feedbackCopy,
    getCurrentCard,
    isResolvingCardRef,
    prepareMicrophoneRef,
    removeResolvedCard,
    speakFeedback,
    startInterCardCountdown,
  });

  const resolveCardAttempt = useCallback(
    async (card, userAnswer, isCorrect, feedbackAnalysis, recordingStartedAt, options = {}) => {
      if (!card || !canContinueFlow()) return;
      const { practiceAfterAnswer = false } = options;
      const responseTime = recordingStartedAt ? Date.now() - recordingStartedAt : 0;

      updateExerciseSessionProgress();

      const saveFlashcardAnswer = async () => {
        try {
          const exerciseSessionId = await getExerciseSessionId();
          const response = await api.submitFlashcardAnswer(
            card.id,
            userAnswer,
            isCorrect,
            "speech",
            responseTime,
            exerciseSessionId,
          );

          if (!response || response.error || response.success === false) {
            console.error("Could not save verbal flashcard result:", response);
            if (canContinueFlow() && getCurrentCard()?.id === card.id) {
              updateStatusWithDebounce(
                `${strings.verbalFlashcardsCouldNotSaveResult}${response?.error ? `: ${response.error}` : ""}`,
                "error",
                0,
              );
            }
          }
        } catch (error) {
          console.error("Could not save verbal flashcard result:", error);
        }
      };

      void saveFlashcardAnswer();

      const wasAccepted = Boolean(isCorrect);
      const summaryBookmark = cardToSummaryBookmark(card);
      const nextCorrectBookmarks = wasAccepted ? [...correctBookmarks, summaryBookmark] : correctBookmarks;
      const nextIncorrectBookmarks = wasAccepted ? incorrectBookmarks : [...incorrectBookmarks, summaryBookmark];
      const practicedCount = totalPracticedBookmarksInSession + 1;
      setCorrectBookmarks(nextCorrectBookmarks);
      setIncorrectBookmarks(nextIncorrectBookmarks);
      setTotalPracticedBookmarksInSession(practicedCount);
      delete attemptCountsRef.current[card.id];

      isResolvingCardRef.current = true;
      const feedbackMessage = feedbackAnalysis?.feedback;
      const spokenFeedback = feedbackMessage || (wasAccepted ? feedbackCopy.successIntro : feedbackCopy.finalIncorrectIntro);
      const answerFeedbackIntro =
        feedbackAnalysis?.answerFeedbackIntro || (wasAccepted ? feedbackCopy.successIntro : feedbackCopy.finalIncorrectIntro);
      const answerToSpeak = feedbackAnalysis?.matchedExpectedText || card.answer;
      const speakResolvedFeedback = feedbackAnalysis?.speakAnswerAfterFeedback
        ? () => {
            const answerAudioPromise = preloadText(answerToSpeak, learnedLanguageId);
            return speakFeedback(answerFeedbackIntro).then(() => {
              if (!answerToSpeak || !isPageActiveRef.current) {
                return;
              }
              return answerAudioPromise.then((audio) => {
                if (audio) {
                  return playPreloadedAudio(audio, strings.verbalFlashcardsPlayingAnswer);
                }
                return speakText(answerToSpeak, learnedLanguageId, strings.verbalFlashcardsPlayingAnswer);
              });
            });
          }
        : () => speakFeedback(spokenFeedback);

      speakResolvedFeedback().finally(() => {
        if (!canContinueFlow()) {
          isResolvingCardRef.current = false;
          return;
        }

        if (practiceAfterAnswer) {
          isResolvingCardRef.current = false;
          promptFinalPracticeAfterAnswer(
            {
              card,
              nextCorrectBookmarks,
              nextIncorrectBookmarks,
              practicedCount,
            },
            (cardId) => retrySameCardRecordingRef.current(cardId),
          );
          return;
        }

        startInterCardCountdown(() => {
          isResolvingCardRef.current = false;
          if (!canContinueFlow()) return;
          removeResolvedCard(card, nextCorrectBookmarks, nextIncorrectBookmarks, practicedCount);
        });
      });
    },
    [
      api,
      cardToSummaryBookmark,
      canContinueFlow,
      correctBookmarks,
      feedbackCopy,
      getExerciseSessionId,
      getCurrentCard,
      incorrectBookmarks,
      learnedLanguageId,
      playPreloadedAudio,
      preloadText,
      promptFinalPracticeAfterAnswer,
      removeResolvedCard,
      speakFeedback,
      speakText,
      startInterCardCountdown,
      totalPracticedBookmarksInSession,
      updateExerciseSessionProgress,
      updateStatusWithDebounce,
    ],
  );

  const handleAttemptOutcome = useCallback(
    (card, userAnswer, analysis, recordingStartedAt) => {
      if (!card || !canContinueFlow()) return;

      const isCorrect = Boolean(analysis?.isAccepted);
      const feedbackMessage = analysis?.feedback || (isCorrect ? feedbackCopy.successIntro : feedbackCopy.retryPrompt);
      const nextAttemptCount = (attemptCountsRef.current[card.id] || 0) + 1;
      attemptCountsRef.current[card.id] = nextAttemptCount;

      if (isCorrect) {
        resolveCardAttempt(card, userAnswer, true, analysis, recordingStartedAt);
        return;
      }

      if (nextAttemptCount === 1) {
        speakFeedback(feedbackMessage).finally(() => {
          if (!canContinueFlow()) {
            return;
          }
          if (getCurrentCard()?.id === card.id) {
            retrySameCardRecordingRef.current(card.id);
          }
        });
        return;
      }

      resolveCardAttempt(card, userAnswer, false, analysis, recordingStartedAt, {
        practiceAfterAnswer: true,
      });
    },
    [canContinueFlow, feedbackCopy, getCurrentCard, resolveCardAttempt, speakFeedback, updateStatusWithDebounce],
  );

  const feedbackForAttempt = useCallback(
    (card, analysis) => {
      if (!card || !analysis) {
        return analysis;
      }

      if (analysis.isAccepted) {
        const answerToShow = analysis.matchedExpectedText || card.answer;
        return {
          ...analysis,
          feedback: `${feedbackCopy.successIntro} ${answerToShow}`,
          speakAnswerAfterFeedback: true,
        };
      }

      const nextAttemptCount = (attemptCountsRef.current[card.id] || 0) + 1;
      if (nextAttemptCount < 2) {
        return analysis;
      }

      const answerToShow = analysis.matchedExpectedText || card.answer;
      return {
        ...analysis,
        feedback: `${feedbackCopy.finalIncorrectIntro} ${answerToShow}`,
        speakAnswerAfterFeedback: true,
      };
    },
    [feedbackCopy],
  );

  const handleRecordingComplete = useCallback(
    ({ audioBlob, flowRunId, recordingStartedAt }) => {
      const currentCard = getCurrentCard();

      if (!currentCard) {
        updateStatusWithDebounce(strings.verbalFlashcardsNoFlashcardLoaded, "error");
        cleanupRecordingResourcesRef.current();
        return;
      }

      api.transcribeAudio(
        audioBlob,
        (result) => {
          if (!canContinueFlow(flowRunId)) {
            cleanupRecordingResourcesRef.current();
            return;
          }

          if (result?.error) {
            console.error("Transcription error:", result.error);
            if (handleFinalPracticeError(currentCard)) {
              return;
            }
            updateStatusWithDebounce(`${strings.verbalFlashcardsErrorPrefix}: ${result.error}`, "error");
            cleanupRecordingResourcesRef.current();
            return;
          }

          const transcription = result?.transcription || "";
          const expectedText = currentCard.answer;

          console.log("[ASR] heard:", JSON.stringify(transcription), "expected:", JSON.stringify(expectedText));

          api.checkPronunciation(
            transcription,
            expectedText,
            currentCard.id,
            (analysis) => {
              if (!canContinueFlow(flowRunId)) {
                cleanupRecordingResourcesRef.current();
                return;
              }

              if (analysis?.error) {
                console.error("Pronunciation check error:", analysis.error);
                if (handleFinalPracticeError(currentCard)) {
                  return;
                }
                updateStatusWithDebounce(strings.verbalFlashcardsCouldNotEvaluatePronunciation, "error", 0);
                cleanupRecordingResourcesRef.current();
                return;
              }

              if (!analysis?.isAccepted && isRevealAnswerIntent(transcription)) {
                const revealFeedback = {
                  ...analysis,
                  isAccepted: false,
                  feedback: `${feedbackCopy.revealAnswerIntro} ${expectedText}`,
                  matchedExpectedText: analysis?.matchedExpectedText || expectedText,
                  answerFeedbackIntro: feedbackCopy.revealAnswerIntro,
                  speakAnswerAfterFeedback: true,
                };

                displayResults(revealFeedback);
                cleanupRecordingResourcesRef.current();
                resolveCardAttempt(currentCard, transcription, false, revealFeedback, recordingStartedAt, {
                  practiceAfterAnswer: true,
                });
                return;
              }

              if (handleFinalPracticeAnalysis(currentCard, analysis)) {
                return;
              }

              const analysisWithAttemptFeedback = feedbackForAttempt(currentCard, analysis);
              displayResults(analysisWithAttemptFeedback);
              cleanupRecordingResourcesRef.current();
              handleAttemptOutcome(currentCard, transcription, analysisWithAttemptFeedback, recordingStartedAt);
            },
            () => {
              if (handleFinalPracticeError(currentCard)) {
                return;
              }
              updateStatusWithDebounce(strings.verbalFlashcardsCouldNotEvaluatePronunciation, "error", 0);
              cleanupRecordingResourcesRef.current();
            },
          );
        },
        () => {
          if (handleFinalPracticeError(currentCard)) {
            return;
          }
          updateStatusWithDebounce(strings.verbalFlashcardsCouldNotEvaluatePronunciation, "error", 0);
          cleanupRecordingResourcesRef.current();
        },
      );
    },
    [
      api,
      canContinueFlow,
      displayResults,
      feedbackForAttempt,
      feedbackCopy,
      getCurrentCard,
      handleFinalPracticeAnalysis,
      handleFinalPracticeError,
      handleAttemptOutcome,
      resolveCardAttempt,
      updateStatusWithDebounce,
    ],
  );

  const {
    cleanupRecordingResources,
    isRecording,
    isRecordingRef,
    isStartingRecordingRef,
    micStreamRef,
    openMicAndStartRecording,
    prepareMicrophone,
  } = useAudioRecorder({
    canContinueFlow,
    flowRunIdRef,
    isInputBlockedRef: isCooldownRef,
    noiseSensitivity,
    onRecordingComplete: handleRecordingComplete,
    statusMessages: {
      preparingMicrophone: strings.verbalFlashcardsPreparingMicrophone,
      microphonePermissionNeeded: strings.verbalFlashcardsMicrophonePermissionNeeded,
      processing: strings.verbalFlashcardsProcessing,
      recordingSpeakNow: strings.verbalFlashcardsRecordingSpeakNow,
      waitingForSpeech: strings.verbalFlashcardsWaitingForSpeech,
      startingMicrophone: strings.verbalFlashcardsStartingMicrophone,
      micAnalysisError: strings.verbalFlashcardsMicAnalysisError,
      recordingCancelled: strings.verbalFlashcardsRecordingCancelled,
      noAudioDetected: strings.verbalFlashcardsNoAudioDetected,
    },
    updateStatusWithDebounce,
  });

  cleanupRecordingResourcesRef.current = cleanupRecordingResources;
  prepareMicrophoneRef.current = prepareMicrophone;

  const cancelCountdown = useCallback(() => {
    clearInterCardDelay();

    isResolvingCardRef.current = false;

    setIsCooldown(false);
    isCooldownRef.current = false;
  }, [clearInterCardDelay]);

  const stopCurrentFlow = useCallback(() => {
    flowRunIdRef.current += 1;
    clearFinalPractice();
    cancelCountdown();
    stopTts();

    if (isRecordingRef.current || isStartingRecordingRef.current || micStreamRef.current) {
      cleanupRecordingResources();
    }
  }, [cancelCountdown, cleanupRecordingResources, clearFinalPractice, isRecordingRef, isStartingRecordingRef, micStreamRef, stopTts]);

  const retrySameCardRecording = useCallback(
    async (cardId) => {
      if (!canContinueFlow()) return;
      if (isResolvingCardRef.current) return;
      if (getCurrentCard()?.id !== cardId) return;

      flowRunIdRef.current += 1;
      setIsCooldown(false);
      isCooldownRef.current = false;
      updateStatusWithDebounce(strings.verbalFlashcardsPreparingMicrophone, "processing", 0);
      await openMicAndStartRecording();
    },
    [canContinueFlow, getCurrentCard, openMicAndStartRecording, updateStatusWithDebounce],
  );

  useEffect(() => {
    retrySameCardRecordingRef.current = retrySameCardRecording;
  }, [retrySameCardRecording]);

  const beginCardFlow = useCallback(() => {
    if (flashcardsRef.current.length === 0) return;
    if (isResolvingCardRef.current) return;

    stopCurrentFlow();
    resetCardUi();

    const card = flashcardsRef.current[currentCardIndexRef.current];
    setIsCooldown(true);
    isCooldownRef.current = true;
    updateStatusWithDebounce(strings.verbalFlashcardsListenCarefully, "cooldown", 0);

    if (!card) {
      setIsCooldown(false);
      isCooldownRef.current = false;
      return;
    }

    const flowRunId = flowRunIdRef.current;
    const microphoneReady = prepareMicrophone().catch(() => null);

    microphoneReady.then(async () => {
      if (flowRunId !== flowRunIdRef.current) {
        return;
      }

      setIsCooldown(false);
      isCooldownRef.current = false;
      setShowResult(false);
      setAccuracyResult(null);
      await openMicAndStartRecording();
    });

    void playCardTts(card, flowRunId);
  }, [openMicAndStartRecording, playCardTts, prepareMicrophone, resetCardUi, stopCurrentFlow, updateStatusWithDebounce]);

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
  }, [beginCardFlow, currentCardIndex, flashcards, isPlayingTtsRef, isRecordingRef, isStartingRecordingRef, loading]);

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

      if (noiseSensitivityNoticeTimeoutRef.current) {
        clearTimeout(noiseSensitivityNoticeTimeoutRef.current);
      }

      stopTts();
      cleanupRecordingResources();
      unlisten();
    };
  }, [cancelCountdown, cleanupRecordingResources, history, stopCurrentFlow, stopTts]);

  const currentCard = flashcards[currentCardIndex];
  const progressTotal = initialFlashcardsCount;
  const progressCurrent =
    progressTotal > 0 ? Math.min(progressTotal - flashcards.length + currentCardIndex + 1, progressTotal) : 0;

  return (
    <s.FlashcardsContainer>
      <FlashcardsHeader
        progressCurrent={progressCurrent}
        progressTotal={progressTotal}
        noiseSensitivity={noiseSensitivity}
        noiseSensitivityNoticeVisible={noiseSensitivityNoticeVisible}
        setNoiseSensitivity={updateNoiseSensitivity}
      />

      <s.Flashcard>
        <s.CardContent>
          <FlashcardStage
            accuracyResult={accuracyResult}
            canGoNext={currentCardIndex < flashcards.length - 1}
            canGoPrevious={currentCardIndex > 0}
            currentCard={currentCard}
            flashcardsCount={flashcards.length}
            isRecording={isRecording}
            loading={loading}
            nextCard={nextCard}
            prevCard={prevCard}
            repeatCard={repeatCard}
            showResult={showResult}
            shuffleCards={shuffleCards}
            statusMessage={statusMessage}
            statusType={statusType}
          />
        </s.CardContent>
      </s.Flashcard>
    </s.FlashcardsContainer>
  );
}
