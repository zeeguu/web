import { useEffect } from "react";

/**
 * Registers global keydown handlers that skip input/textarea elements.
 *
 * @param {Object} keyMap  – e.g. { ArrowRight: handleNext, Enter: handleSubmit }
 * @param {boolean} enabled – pass false to temporarily disable (default true)
 */
export default function useKeyboardNavigation(keyMap, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
        return;

      const handler = keyMap[e.key];
      if (handler) {
        e.preventDefault();
        handler();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [keyMap, enabled]);
}
