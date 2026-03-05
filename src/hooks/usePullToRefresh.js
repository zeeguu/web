import { useEffect } from "react";

export default function usePullToRefresh(onRefresh) {
  useEffect(() => {
    let startY = 0;
    let pulling = false;

    function onTouchStart(e) {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
        pulling = true;
      }
    }

    function onTouchEnd(e) {
      if (!pulling) return;
      pulling = false;

      const dy = e.changedTouches[0].clientY - startY;
      if (dy > 80) {
        onRefresh();
      }
    }

    document.addEventListener("touchstart", onTouchStart);
    document.addEventListener("touchend", onTouchEnd);

    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [onRefresh]);
}
