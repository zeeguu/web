import { useEffect } from "react";

/**
 * Mount-time setup every exercise component does: stop any audio left
 * over from the previous exercise, reset the per-exercise timer, and
 * register the exercise type with ExerciseSession. Empty deps because
 * this runs once per mount — ExerciseSession remounts via key on each
 * bookmark transition.
 */
export function useExerciseLifecycle({ speech, resetSubSessionTimer, setExerciseType, exerciseType }) {
  useEffect(() => {
    speech.stopAudio();
    resetSubSessionTimer();
    setExerciseType(exerciseType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
