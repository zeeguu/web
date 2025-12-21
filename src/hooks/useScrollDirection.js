import { useState, useEffect, useRef } from "react";

/**
 * Hook that detects scroll direction for smart hide/show header behavior.
 * Returns "up" when scrolling up (show header), "down" when scrolling down (hide header).
 *
 * @param {Object} options
 * @param {number} options.threshold - Minimum scroll distance before direction change triggers (default: 10)
 * @param {number} options.topOffset - Distance from top where header always shows (default: 100)
 * @returns {"up" | "down"} Current scroll direction
 */
export default function useScrollDirection({ threshold = 10, topOffset = 100 } = {}) {
  const [scrollDirection, setScrollDirection] = useState("up");
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const scrollHolder = document.getElementById("scrollHolder");
    if (!scrollHolder) return;

    const updateScrollDirection = () => {
      const scrollY = scrollHolder.scrollTop;

      // Always show header when near the top
      if (scrollY < topOffset) {
        setScrollDirection("up");
        lastScrollY.current = scrollY;
        ticking.current = false;
        return;
      }

      const diff = scrollY - lastScrollY.current;

      // Only update if scroll exceeds threshold (prevents jitter)
      if (Math.abs(diff) > threshold) {
        setScrollDirection(diff > 0 ? "down" : "up");
        lastScrollY.current = scrollY;
      }

      ticking.current = false;
    };

    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking.current = true;
      }
    };

    scrollHolder.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      scrollHolder.removeEventListener("scroll", handleScroll);
    };
  }, [threshold, topOffset]);

  return scrollDirection;
}
