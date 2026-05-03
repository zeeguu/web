import { useCallback, useRef } from "react";

const EXERCISE_SESSION_START_TIMEOUT_MS = 3000;

export default function useFlashcardExerciseSession({ api, history }) {
  const exerciseSessionIdRef = useRef(null);
  const pageSessionStartedAtRef = useRef(null);
  const sessionEndedRef = useRef(false);
  const sessionCreateRequestIdRef = useRef(0);
  const exerciseSessionPromiseRef = useRef(null);
  const resolveExerciseSessionPromiseRef = useRef(null);
  const exerciseSessionStartTimeoutRef = useRef(null);

  const getElapsedSessionSeconds = useCallback(() => {
    if (!pageSessionStartedAtRef.current) return 1;
    return Math.max(1, Math.round((Date.now() - pageSessionStartedAtRef.current) / 1000));
  }, []);

  const startExerciseSession = useCallback(() => {
    if (exerciseSessionStartTimeoutRef.current) {
      clearTimeout(exerciseSessionStartTimeoutRef.current);
      exerciseSessionStartTimeoutRef.current = null;
    }

    pageSessionStartedAtRef.current = Date.now();
    sessionEndedRef.current = false;
    exerciseSessionIdRef.current = null;
    sessionCreateRequestIdRef.current += 1;
    const requestId = sessionCreateRequestIdRef.current;

    exerciseSessionPromiseRef.current = new Promise((resolve) => {
      resolveExerciseSessionPromiseRef.current = resolve;
    });

    const resolvePendingSession = (sessionId) => {
      if (sessionCreateRequestIdRef.current !== requestId) {
        return;
      }
      if (exerciseSessionStartTimeoutRef.current) {
        clearTimeout(exerciseSessionStartTimeoutRef.current);
        exerciseSessionStartTimeoutRef.current = null;
      }
      exerciseSessionIdRef.current = sessionId;
      resolveExerciseSessionPromiseRef.current?.(sessionId);
      resolveExerciseSessionPromiseRef.current = null;
      if (!sessionId) {
        exerciseSessionPromiseRef.current = null;
      }
    };

    exerciseSessionStartTimeoutRef.current = window.setTimeout(() => {
      resolvePendingSession(null);
    }, EXERCISE_SESSION_START_TIMEOUT_MS);

    api.exerciseSessionCreate(resolvePendingSession, () => {
      resolvePendingSession(null);
    });
  }, [api]);

  const getExerciseSessionId = useCallback(() => {
    if (exerciseSessionIdRef.current) {
      return Promise.resolve(exerciseSessionIdRef.current);
    }

    if (exerciseSessionPromiseRef.current) {
      return exerciseSessionPromiseRef.current;
    }

    startExerciseSession();
    return exerciseSessionPromiseRef.current;
  }, [startExerciseSession]);

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
    finishSessionAndGoToSummary,
    getExerciseSessionId,
    startExerciseSession,
    updateExerciseSessionProgress,
  };
}
