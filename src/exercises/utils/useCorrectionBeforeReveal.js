import { useState, useEffect, useRef } from "react";
import { CORRECTION_DURATION_MS } from "../components/ClozeCorrection";

/**
 * For typed cloze exercises: on a wrong answer, keep the typed word on
 * screen and play its correction before the exercise flips to the reveal,
 * instead of the typed word just vanishing.
 *
 * Returns the typed word being corrected (null when none) and a function
 * that starts the correction and calls `reveal` once it has played.
 * `resetDeps` should include isExerciseOver, so that a reveal from
 * elsewhere (Show solution) cancels a correction still playing instead of
 * revealing twice.
 */
export function useCorrectionBeforeReveal(resetDeps) {
  const [correction, setCorrection] = useState(null);
  const timer = useRef(null);

  useEffect(() => {
    setCorrection(null);
    clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, resetDeps);

  useEffect(() => () => clearTimeout(timer.current), []);

  function correctThenReveal(typed, reveal) {
    if (!typed.trim()) {
      reveal();
      return;
    }
    setCorrection(typed.trim());
    timer.current = setTimeout(reveal, CORRECTION_DURATION_MS);
  }

  return [correction, correctThenReveal];
}
