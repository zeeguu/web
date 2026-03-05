import { useEffect } from "react";
import { useHistory } from "react-router-dom";

export default function useSwipeBack() {
  const history = useHistory();

  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let tracking = false;

    function onTouchStart(e) {
      const touch = e.touches[0];
      if (touch.clientX <= 30) {
        startX = touch.clientX;
        startY = touch.clientY;
        tracking = true;
      }
    }

    function onTouchMove(e) {
      // no-op, just let the gesture continue
    }

    function onTouchEnd(e) {
      if (!tracking) return;
      tracking = false;

      const touch = e.changedTouches[0];
      const dx = touch.clientX - startX;
      const dy = Math.abs(touch.clientY - startY);

      if (dx >= 80 && dx > dy) {
        history.goBack();
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
