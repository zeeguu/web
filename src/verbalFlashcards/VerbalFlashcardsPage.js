import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import strings from "../i18n/definitions";
import FlashcardsHeader from "./components/FlashcardsHeader";
import FlashcardStage from "./components/FlashcardStage";
import useAudioRecorder from "./hooks/useAudioRecorder";
import useFlashcardExerciseSession from "./hooks/useFlashcardExerciseSession";
import useVerbalFlashcardTTS from "./hooks/useVerbalFlashcardTTS";
import * as s from "./verbalFlashcards_Styled/VerbalFlashcards.sc.js";
import {
  AFTER_TTS_BEFORE_RECORDING_MS,
  BETWEEN_CARDS_DELAY_MS,
  DEFAULT_LANGUAGE_ID,
  feedbackCopyForLanguage,
  promptInstructionIntroText,
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
  const [userSpeech, setUserSpeech] = useState("");
  const [accuracyResult, setAccuracyResult] = useState(null);
  const [isCooldown, setIsCooldown] = useState(false);
  const [statusMessage, setStatusMessage] = useState(strings.loadingMsg);
  const [statusType, setStatusType] = useState("idle");
  const [noiseSensitivity, setNoiseSensitivity] = useState("0.08");
  const [correctBookmarks, setCorrectBookmarks] = useState([]);
  const [incorrectBookmarks, setIncorrectBookmarks] = useState([]);
  const [totalPracticedBookmarksInSession, setTotalPracticedBookmarksInSession] = useState(0);

  const statusUpdateTimeoutRef = useRef(null);
  const interCardDelayTimeoutRef = useRef(null);
  const currentCardIndexRef = useRef(0);
  const flashcardsRef = useRef([]);
  const isCooldownRef = useRef(false);
  const attemptCountsRef = useRef({});
  const beginCardFlowRef = useRef(() => {});
  const flowRunIdRef = useRef(0);
  const isResolvingCardRef = useRef(false);
  const lastAutoStartedFlowKeyRef = useRef(null);
  const isPageActiveRef = useRef(true);
  const cleanupRecordingResourcesRef = useRef(() => {});

  const {
    endExerciseSessionIfNeeded,
    exerciseSessionIdRef,
    finishSessionAndGoToSummary,
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

  const displayResults = useCallback(
    (speech, analysis) => {
      setUserSpeech(speech);
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

  const { isPlayingTtsRef, speakText, stopTts } = useVerbalFlashcardTTS({
    api,
    isPageActiveRef,
    updateStatusWithDebounce,
  });

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
    (card, userAnswer, isCorrect, feedbackAnalysis, recordingStartedAt) => {
      if (!card || !canContinueFlow()) return;
      const responseTime = recordingStartedAt ? Date.now() - recordingStartedAt : 0;
      const exerciseSessionId = exerciseSessionIdRef.current;

      updateExerciseSessionProgress();

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
          const answerFeedbackIntro = wasAccepted ? feedbackCopy.successIntro : feedbackCopy.finalIncorrectIntro;
          const speakResolvedFeedback = feedbackAnalysis?.speakAnswerAfterFeedback
            ? () =>
                speakFeedback(answerFeedbackIntro).then(() => {
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
      canContinueFlow,
      correctBookmarks,
      feedbackCopy,
      incorrectBookmarks,
      learnedLanguageId,
      removeResolvedCard,
      speakFeedback,
      speakText,
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
          updateStatusWithDebounce(strings.verbalFlashcardsRetryingSameCard, "processing", 0);
          if (getCurrentCard()?.id === card.id) {
            beginCardFlowRef.current();
          }
        });
        return;
      }

      resolveCardAttempt(card, userAnswer, false, analysis, recordingStartedAt);
    },
    [canContinueFlow, feedbackCopy, getCurrentCard, resolveCardAttempt, speakFeedback, updateStatusWithDebounce],
  );

  const feedbackForAttempt = useCallback(
    (card, analysis) => {
      if (!card || !analysis) {
        return analysis;
      }

      if (analysis.isAccepted) {
        return {
          ...analysis,
          feedback: `${feedbackCopy.successIntro} ${card.answer}`,
          speakAnswerAfterFeedback: true,
        };
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
            updateStatusWithDebounce(`${strings.verbalFlashcardsErrorPrefix}: ${result.error}`, "error");
            cleanupRecordingResourcesRef.current();
            return;
          }

          const transcription = result?.transcription || "";
          const expectedText = currentCard.answer;

          api.checkPronunciation(
            transcription,
            expectedText,
            (analysis) => {
              if (!canContinueFlow(flowRunId)) {
                cleanupRecordingResourcesRef.current();
                return;
              }

              if (analysis?.error) {
                console.error("Pronunciation check error:", analysis.error);
                updateStatusWithDebounce(strings.verbalFlashcardsCouldNotEvaluatePronunciation, "error", 0);
                cleanupRecordingResourcesRef.current();
                return;
              }

              const analysisWithAttemptFeedback = feedbackForAttempt(currentCard, analysis);
              displayResults(transcription, analysisWithAttemptFeedback);
              cleanupRecordingResourcesRef.current();
              handleAttemptOutcome(currentCard, transcription, analysisWithAttemptFeedback, recordingStartedAt);
            },
            () => {
              updateStatusWithDebounce(strings.verbalFlashcardsCouldNotEvaluatePronunciation, "error", 0);
              cleanupRecordingResourcesRef.current();
            },
          );
        },
        () => {
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
      getCurrentCard,
      handleAttemptOutcome,
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
  } = useAudioRecorder({
    canContinueFlow,
    flowRunIdRef,
    isCooldownRef,
    noiseSensitivity,
    onRecordingComplete: handleRecordingComplete,
    updateStatusWithDebounce,
  });

  cleanupRecordingResourcesRef.current = cleanupRecordingResources;

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
    stopTts();

    if (isRecordingRef.current || isStartingRecordingRef.current || micStreamRef.current) {
      cleanupRecordingResources();
    }
  }, [cancelCountdown, cleanupRecordingResources, isRecordingRef, isStartingRecordingRef, micStreamRef, stopTts]);

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

      await new Promise((resolve) => window.setTimeout(resolve, AFTER_TTS_BEFORE_RECORDING_MS));
      if (flowRunId !== flowRunIdRef.current) {
        return;
      }

      setShowResult(false);
      setAccuracyResult(null);
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
        setNoiseSensitivity={setNoiseSensitivity}
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
            userSpeech={userSpeech}
          />
        </s.CardContent>
      </s.Flashcard>
    </s.FlashcardsContainer>
  );
}
