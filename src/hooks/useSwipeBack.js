import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import useShadowRef from "./useShadowRef";

// Optional `targetPath` redirects the back gesture to a specific route via
// history.replace (current entry is swapped — no extra back-stack growth).
// When not set, falls back to history.goBack() — the natural "previous page".
// Useful when the natural "previous page" isn't what the user expects: e.g.
// a simplified article opened via Discover→Simplify→reader should land in
// My Articles on swipe-back, not back at the now-superseded Discover entry.
export default function useSwipeBack(options = {}) {
  const { targetPath = null } = options;
  const history = useHistory();
  const targetPathRef = useShadowRef(targetPath);

  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let tracking = false;
    let page = null;

    function getPage() {
      return document.getElementById("root")?.firstElementChild || document.body;
    }

    function onTouchStart(e) {
      const touch = e.touches[0];
      // The swipe-back gesture is initiable from the entire left half of
      // the screen. The tighter iOS-style edge-only zone made the gesture
      // hard to discover and easy to miss; the vertical-dominant check in
      // onTouchMove still filters out content scrolls.
      if (touch.clientX <= window.innerWidth / 2) {
        startX = touch.clientX;
        startY = touch.clientY;
        tracking = true;
        page = getPage();
        page.style.transition = "none";
      }
    }

    function onTouchMove(e) {
      if (!tracking) return;
      const dx = Math.max(0, e.touches[0].clientX - startX);
      const dy = Math.abs(e.touches[0].clientY - startY);
      if (dy > dx) {
        // vertical scroll — cancel
        tracking = false;
        page.style.transform = "";
        page.style.transition = "";
        return;
      }
      page.style.transform = `translateX(${dx}px)`;
      page.style.opacity = `${1 - dx / window.innerWidth * 0.5}`;
    }

    function onTouchEnd(e) {
      if (!tracking) return;
      tracking = false;

      const touch = e.changedTouches[0];
      const dx = touch.clientX - startX;
      const dy = Math.abs(touch.clientY - startY);

      if (dx >= 60 && dx > dy) {
        // Animate off-screen, then navigate
        page.style.transition = "transform 0.2s ease-out, opacity 0.2s ease-out";
        page.style.transform = `translateX(${window.innerWidth}px)`;
        page.style.opacity = "0";
        setTimeout(() => {
          page.style.transition = "";
          page.style.transform = "";
          page.style.opacity = "";
          if (targetPathRef.current) {
            history.replace(targetPathRef.current);
          } else {
            history.goBack();
          }
        }, 200);
      } else {
        // Snap back
        page.style.transition = "transform 0.15s ease-out, opacity 0.15s ease-out";
        page.style.transform = "";
        page.style.opacity = "";
        setTimeout(() => {
          page.style.transition = "";
        }, 150);
      }
    }

    document.addEventListener("touchstart", onTouchStart);
    document.addEventListener("touchmove", onTouchMove);
    document.addEventListener("touchend", onTouchEnd);

    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [history]);
}
