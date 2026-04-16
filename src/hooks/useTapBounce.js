import { useCallback, useRef, useState } from "react";
import { playTapChime } from "../utils/chimes";

// One bouncy button per call site. `bouncingKey` identifies which button is
// currently animating; pair it with `className="tap-bouncing"` on the matching
// element and compose with any other classes the component already applies.
export default function useTapBounce() {
  const [bouncingKey, setBouncingKey] = useState(null);
  const timer = useRef();

  const trigger = useCallback((key) => {
    playTapChime();
    setBouncingKey(null);
    requestAnimationFrame(() => {
      setBouncingKey(key);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setBouncingKey(null), 240);
    });
  }, []);

  return { bouncingKey, trigger };
}
