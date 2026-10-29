import { useEffect } from "react";

// Room left between the focused input and the top of the keyboard.
const MARGIN_PX = 8;

// When the keyboard comes up, iOS scrolls the window, or pans the visual
// viewport, to "reveal" the focused input even when it was already in
// view, which pushes the top of the screen (headline, nav) under the
// status bar. While `isActive`, go back to the top whenever the input
// still fits above the keyboard from there.
//
// Only while the keyboard animates in (its own resizes), never on scroll
// or zoom: the learner scrolling or pinching is left alone.
export default function useUndoKeyboardScroll(isActive) {
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!isActive || !viewport) return;

    const undo = () => {
      if (viewport.scale !== 1) return;
      if (window.scrollY === 0 && viewport.offsetTop === 0) return;
      const focused = document.activeElement;
      if (!focused || focused === document.body) return;
      // The rect is in layout-viewport coordinates; scrollTo(0, 0) resets
      // both the window scroll and the visual viewport's pan.
      const bottomAtTop = focused.getBoundingClientRect().bottom + window.scrollY;
      if (bottomAtTop + MARGIN_PX <= viewport.height) {
        window.scrollTo(0, 0);
      }
    };
    // iOS scrolls after the keyboard has animated in.
    let timeout;
    const undoSoon = () => {
      clearTimeout(timeout);
      timeout = setTimeout(undo, 50);
    };

    undoSoon();
    viewport.addEventListener("resize", undoSoon);
    return () => {
      clearTimeout(timeout);
      viewport.removeEventListener("resize", undoSoon);
    };
  }, [isActive]);
}
