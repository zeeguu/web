import { useCallback, useRef } from "react";

export default function useFinalPracticeAttempt({
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
}) {
  const finalPracticeResolutionRef = useRef(null);

  const clearFinalPractice = useCallback(() => {
    finalPracticeResolutionRef.current = null;
  }, []);

  const isFinalPracticeAttemptForCard = useCallback((card) => {
    return finalPracticeResolutionRef.current?.card?.id === card?.id;
  }, []);

  const promptFinalPracticeAfterAnswer = useCallback(
    (resolution, retrySameCardRecording) => {
      if (!resolution?.card) {
        return;
      }

      finalPracticeResolutionRef.current = resolution;

      const microphoneReady = prepareMicrophoneRef.current
        ? prepareMicrophoneRef.current().catch(() => null)
        : Promise.resolve(null);

      speakFeedback(feedbackCopy.finalPracticePrompt).finally(async () => {
        await microphoneReady;

        if (!canContinueFlow()) {
          return;
        }
        if (getCurrentCard()?.id === resolution.card.id) {
          retrySameCardRecording(resolution.card.id);
        }
      });
    },
    [canContinueFlow, feedbackCopy, getCurrentCard, prepareMicrophoneRef, speakFeedback],
  );

  const feedbackForFinalPractice = useCallback(
    (card, analysis) => {
      if (!card || !analysis) {
        return analysis;
      }

      if (analysis.isAccepted) {
        return {
          ...analysis,
          feedback: feedbackCopy.finalPracticeSuccess,
        };
      }

      return {
        ...analysis,
        feedback: feedbackCopy.finalPracticeMoveOn,
      };
    },
    [feedbackCopy],
  );

  const finishFinalPracticeAttempt = useCallback(
    (resolution, feedbackAnalysis) => {
      if (!resolution?.card || !canContinueFlow()) {
        return;
      }

      finalPracticeResolutionRef.current = null;
      isResolvingCardRef.current = true;

      const feedbackMessage = feedbackAnalysis?.feedback || feedbackCopy.finalPracticeMoveOn;
      const speakFinalPracticeFeedback = () => speakFeedback(feedbackMessage);

      speakFinalPracticeFeedback().finally(() => {
        if (!canContinueFlow()) {
          isResolvingCardRef.current = false;
          return;
        }
        startInterCardCountdown(() => {
          isResolvingCardRef.current = false;
          if (!canContinueFlow()) return;
          removeResolvedCard(
            resolution.card,
            resolution.nextCorrectBookmarks,
            resolution.nextIncorrectBookmarks,
            resolution.practicedCount,
          );
        });
      });
    },
    [
      canContinueFlow,
      feedbackCopy,
      isResolvingCardRef,
      removeResolvedCard,
      speakFeedback,
      startInterCardCountdown,
    ],
  );

  const handleFinalPracticeError = useCallback(
    (card) => {
      if (!isFinalPracticeAttemptForCard(card)) {
        return false;
      }

      const fallbackFeedback = { feedback: feedbackCopy.finalPracticeMoveOn };
      displayResults(fallbackFeedback);
      cleanupRecordingResourcesRef.current();
      finishFinalPracticeAttempt(finalPracticeResolutionRef.current, fallbackFeedback);
      return true;
    },
    [
      cleanupRecordingResourcesRef,
      displayResults,
      feedbackCopy,
      finishFinalPracticeAttempt,
      isFinalPracticeAttemptForCard,
    ],
  );

  const handleFinalPracticeAnalysis = useCallback(
    (card, analysis) => {
      if (!isFinalPracticeAttemptForCard(card)) {
        return false;
      }

      const finalPracticeFeedback = feedbackForFinalPractice(card, analysis);
      displayResults(finalPracticeFeedback);
      cleanupRecordingResourcesRef.current();
      finishFinalPracticeAttempt(
        finalPracticeResolutionRef.current,
        finalPracticeFeedback,
      );
      return true;
    },
    [
      cleanupRecordingResourcesRef,
      displayResults,
      feedbackForFinalPractice,
      finishFinalPracticeAttempt,
      isFinalPracticeAttemptForCard,
    ],
  );

  return {
    clearFinalPractice,
    handleFinalPracticeAnalysis,
    handleFinalPracticeError,
    promptFinalPracticeAfterAnswer,
  };
}
