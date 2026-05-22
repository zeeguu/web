import { useEffect } from "react";

/**
 * Tiny hook: notifies the parent (ExerciseSession) once the exercise's
 * InteractiveText has been built. ExerciseSession uses this signal to
 * unblock NextNavigation so the Show solution / Report / Next links
 * appear exactly when the exercise has real content — no flicker
 * during the bookmark→next-bookmark transition, regardless of how slow
 * the network or CPU is.
 *
 * Each exercise component calls:
 *   useNotifyExerciseLoaded(interactiveText, onExerciseLoaded);
 *
 * `onExerciseLoaded` is an optional prop passed in by ExerciseSession.
 * When called outside ExerciseSession (e.g. IndividualExercise test
 * page), it's undefined and the hook is a no-op.
 */
export function useNotifyExerciseLoaded(interactiveText, onExerciseLoaded) {
  useEffect(() => {
    // Passing the interactiveText up lets the parent (ExerciseSession)
    // derive MWE-aware text for auto-pronounce — matches what
    // TranslatableWord.clickOnWord already does for the click path.
    if (interactiveText && onExerciseLoaded) onExerciseLoaded(interactiveText);
  }, [interactiveText, onExerciseLoaded]);
}
