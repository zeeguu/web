import { useEffect, useRef } from "react";

const ANIM_MS = 200;

// Horizontal-swipe hook scoped to a single element. Attach the returned
// ref to the container that should receive swipes.
//
// While the user drags, the container follows the finger (with rubber-
// band damping when the swipe direction has nowhere to go). On release,
// a qualifying swipe animates the content off-screen, then calls
// `onSwipe(direction)` with -1 (right → previous) or +1 (left → next).
// A non-qualifying gesture snaps back.
//
// Vertical-dominant gestures are ignored so normal scrolling still works.
//
// `canSwipe(direction)` should return true if a swipe in that direction
// is actionable. Defaults to allowing both.
//
// Sensitivity knobs (raise them on long vertical-scroll surfaces like the
// article feed so casual scrolling doesn't register as a tab switch):
//   threshold     — min horizontal travel (px) to count as a swipe
//   deadzone      — min travel (px) before we commit to an axis
//   lockRatio     — lock to horizontal only if |dx| >= |dy| * lockRatio
//   qualifyRatio  — on release, swipe only if |dx| >= |dy| * qualifyRatio
//
// Note: the hook mutates `transform` and `transition` on the ref's
// element directly. Don't set those from the caller.
export default function useTabSwipe(
  onSwipe,
  canSwipe = () => true,
  { threshold = 60, deadzone = 8, lockRatio = 1, qualifyRatio = 1.5 } = {},
) {
  const ref = useRef(null);
  // Stash callbacks in refs so listeners don't tear down on every parent
  // re-render (onSwipe/canSwipe identity changes with location.pathname).
  const onSwipeRef = useRef(onSwipe);
  const canSwipeRef = useRef(canSwipe);
  onSwipeRef.current = onSwipe;
  canSwipeRef.current = canSwipe;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let startX = 0;
    let startY = 0;
    let dragging = false;
    let axisLocked = false;
    let endTimer = null;

    function setTransform(px) {
      el.style.transform = px === 0 ? "" : `translate3d(${px}px, 0, 0)`;
    }

    function reset() {
      el.style.transition = "";
      setTransform(0);
      dragging = false;
      axisLocked = false;
    }

    function onTouchStart(e) {
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      dragging = true;
      axisLocked = false;
      el.style.transition = "none";
    }

    function onTouchMove(e) {
      if (!dragging) return;
      const t = e.touches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      if (!axisLocked) {
        if (Math.abs(dx) < deadzone && Math.abs(dy) < deadzone) return;
        if (Math.abs(dx) < Math.abs(dy) * lockRatio) {
          dragging = false;
          setTransform(0);
          return;
        }
        axisLocked = true;
      }
      // Axis is locked to horizontal: stop the page from scrolling
      // vertically underneath the swipe, so the card slides cleanly
      // sideways instead of drifting diagonally with the finger.
      if (e.cancelable) e.preventDefault();
      const direction = dx < 0 ? 1 : -1;
      // Rubber-band when there's nowhere to swipe in this direction.
      const allowed = canSwipeRef.current(direction);
      setTransform(allowed ? dx : dx * 0.25);
    }

    function onTouchEnd(e) {
      if (!dragging) return;
      dragging = false;
      if (!axisLocked) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      const direction = dx < 0 ? 1 : -1;
      const qualifies =
        Math.abs(dx) >= threshold &&
        Math.abs(dx) >= Math.abs(dy) * qualifyRatio &&
        canSwipeRef.current(direction);

      el.style.transition = `transform ${ANIM_MS}ms ease-out`;
      if (qualifies) {
        const off = direction === 1 ? -window.innerWidth : window.innerWidth;
        setTransform(off);
        endTimer = setTimeout(() => {
          endTimer = null;
          el.style.transition = "none";
          setTransform(0);
          onSwipeRef.current(direction);
        }, ANIM_MS);
      } else {
        setTransform(0);
      }
    }

    function onTouchCancel() {
      // System interrupts (incoming call, OS gesture) — just bail cleanly.
      if (!dragging) return;
      reset();
    }

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    // Non-passive so onTouchMove can preventDefault once it locks to the
    // horizontal axis (passive listeners are forbidden from doing so).
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("touchcancel", onTouchCancel, { passive: true });

    return () => {
      if (endTimer) clearTimeout(endTimer);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchCancel);
    };
  }, [threshold, deadzone, lockRatio, qualifyRatio]);

  return ref;
}
