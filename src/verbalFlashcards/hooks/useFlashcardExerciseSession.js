import { useCallback, useRef } from "react";

export default function useFlashcardExerciseSession({ api, history }) {
  const exerciseSessionIdRef = useRef(null);
  const pageSessionStartedAtRef = useRef(null);
  const sessionEndedRef = useRef(false);
  const sessionCreateRequestIdRef = useRef(0);

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

  const updateExerciseSessionProgress = useCallback(() => {
    const exerciseSessionId = exerciseSessionIdRef.current;
    if (exerciseSessionId && pageSessionStartedAtRef.current) {
      api.exerciseSessionUpdate(exerciseSessionId, getElapsedSessionSeconds());
    }
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

  return {
    endExerciseSessionIfNeeded,
    exerciseSessionIdRef,
    finishSessionAndGoToSummary,
    startExerciseSession,
    updateExerciseSessionProgress,
  };
}
