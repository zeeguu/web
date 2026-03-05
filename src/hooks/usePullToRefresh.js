import { useEffect, useRef, useState } from "react";

export default function usePullToRefresh(onRefresh) {
  const [refreshing, setRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const onRefreshRef = useRef(onRefresh);
  onRefreshRef.current = onRefresh;

  useEffect(() => {
    let startY = 0;
    let pulling = false;

    const scrollHolder = document.getElementById("scrollHolder");
    if (!scrollHolder) return;

    function onTouchStart(e) {
      if (scrollHolder.scrollTop === 0) {
        startY = e.touches[0].clientY;
        pulling = true;
      }
    }

    function onTouchMove(e) {
      if (!pulling) return;
      const dy = e.touches[0].clientY - startY;
      if (dy > 0) {
        // Dampen the pull distance so it feels like resistance
        setPullDistance(Math.min(dy * 0.4, 60));
      }
    }

    function onTouchEnd(e) {
      if (!pulling) return;
      pulling = false;

      const dy = e.changedTouches[0].clientY - startY;
      setPullDistance(0);
      if (dy > 80) {
        setRefreshing(true);
        Promise.resolve(onRefreshRef.current()).finally(() => {
          setRefreshing(false);
        });
      }
    }

    scrollHolder.addEventListener("touchstart", onTouchStart);
    scrollHolder.addEventListener("touchmove", onTouchMove);
    scrollHolder.addEventListener("touchend", onTouchEnd);

    return () => {
      scrollHolder.removeEventListener("touchstart", onTouchStart);
      scrollHolder.removeEventListener("touchmove", onTouchMove);
      scrollHolder.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return { refreshing, pullDistance };
}
