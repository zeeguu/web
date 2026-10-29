import { useEffect } from "react";

// Room left between the focused input and the top of the keyboard.
const MARGIN_PX = 8;

// When the keyboard comes up, iOS scrolls the window to "reveal" the
// focused input even when it was already in view, which pushes the top
// of the screen (headline, nav) under the status bar. While `isActive`,
// scroll back to the top whenever the input still fits above the keyboard
// from there.
//
// Only on the keyboard's own resize and on focus, never on scroll: the
// learner scrolling by hand is left alone.
export default function useUndoKeyboardScroll(isActive) {
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!isActive || !viewport) return;

    const undo = () => {
      if (window.scrollY === 0) return;
      const focused = document.activeElement;
      if (!focused || focused === document.body) return;
      const bottomIfUnscrolled = focused.getBoundingClientRect().bottom + window.scrollY;
      if (bottomIfUnscrolled + MARGIN_PX <= viewport.height) {
        window.scrollTo(0, 0);
      }
    };
    // iOS scrolls after the focus event, once the keyboard has animated in.
    let timeout;
    const undoSoon = () => {
      clearTimeout(timeout);
      timeout = setTimeout(undo, 50);
    };

    undoSoon();
    viewport.addEventListener("resize", undoSoon);
    document.addEventListener("focusin", undoSoon);
    return () => {
      clearTimeout(timeout);
      viewport.removeEventListener("resize", undoSoon);
      document.removeEventListener("focusin", undoSoon);
    };
  }, [isActive]);
}
