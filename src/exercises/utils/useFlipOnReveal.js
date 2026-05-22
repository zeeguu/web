import { useLayoutEffect, useRef } from "react";

const DEFAULT_DURATION_MS = 320;

/**
 * FLIP animation for the moment an exercise transitions to its reveal
 * layout (other options disappear, headline collapses, chosen element
 * shifts to its solution position). The same DOM node has to be mounted
 * both before and after the flip — for exercises where source/target are
 * different nodes, render both (one hidden) so the ref points at the
 * same element throughout.
 *
 * Effect deps are `[isExerciseOver]` so the layout effect only runs at
 * the two moments that matter (mount and the reveal flip), avoiding a
 * forced `getBoundingClientRect` reflow on every parent re-render (e.g.
 * every keystroke into a cloze field).
 */
export function useFlipOnReveal(ref, isExerciseOver, { durationMs = DEFAULT_DURATION_MS } = {}) {
  const lastRect = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!isExerciseOver) {
      lastRect.current = el.getBoundingClientRect();
      return;
    }

    if (!lastRect.current) return;

    const newRect = el.getBoundingClientRect();
    const dx = lastRect.current.left - newRect.left;
    const dy = lastRect.current.top - newRect.top;
    lastRect.current = null;
    if (dx === 0 && dy === 0) return;

    el.style.transition = "none";
    el.style.transform = `translate(${dx}px, ${dy}px)`;
    // Reading offsetWidth is the canonical reflow-trigger that survives
    // minification — without it the browser collapses the start-state
    // and the end-state into one paint and skips the transition.
    // eslint-disable-next-line no-unused-expressions
    el.offsetWidth;
    el.style.transition = `transform ${durationMs}ms cubic-bezier(0.22, 1, 0.36, 1)`;
    el.style.transform = "translate(0, 0)";

    const onEnd = () => {
      el.style.transition = "";
      el.style.transform = "";
      el.removeEventListener("transitionend", onEnd);
    };
    el.addEventListener("transitionend", onEnd);

    return () => {
      el.removeEventListener("transitionend", onEnd);
      el.style.transition = "";
      el.style.transform = "";
    };
  }, [isExerciseOver, durationMs, ref]);
}
