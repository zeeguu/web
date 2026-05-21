import { useLayoutEffect, useRef } from "react";

const DEFAULT_DURATION_MS = 320;

/**
 * FLIP animation for the moment an exercise transitions to its reveal
 * layout (other options disappear, headline collapses, chosen element
 * shifts to its solution position). Cache the chosen element's
 * pre-reveal `getBoundingClientRect()` on every pre-reveal render,
 * then — once `isExerciseOver` flips to true — read the new rect and
 * apply `translate(dx, dy)` instantly before transitioning back to
 * identity. Same DOM node has to be mounted both before and after; for
 * exercises where the source/target are different nodes, render both
 * (one hidden) so the ref points at the same element throughout.
 */
export function useFlipOnReveal(ref, isExerciseOver, { durationMs = DEFAULT_DURATION_MS } = {}) {
  const lastRect = useRef(null);
  const hasAnimated = useRef(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!isExerciseOver) {
      lastRect.current = el.getBoundingClientRect();
      hasAnimated.current = false;
      return;
    }

    if (hasAnimated.current || !lastRect.current) return;

    const newRect = el.getBoundingClientRect();
    const dx = lastRect.current.left - newRect.left;
    const dy = lastRect.current.top - newRect.top;
    if (dx === 0 && dy === 0) {
      hasAnimated.current = true;
      return;
    }

    el.style.transition = "none";
    el.style.transform = `translate(${dx}px, ${dy}px)`;
    // Force reflow so the browser registers the start position before
    // the transition kicks in. Reading offsetWidth is the canonical
    // reflow-trigger that survives minification.
    // eslint-disable-next-line no-unused-expressions
    el.offsetWidth;
    el.style.transition = `transform ${durationMs}ms cubic-bezier(0.22, 1, 0.36, 1)`;
    el.style.transform = "translate(0, 0)";
    hasAnimated.current = true;

    const onEnd = () => {
      el.style.transition = "";
      el.style.transform = "";
      el.removeEventListener("transitionend", onEnd);
    };
    el.addEventListener("transitionend", onEnd);
  });
}
