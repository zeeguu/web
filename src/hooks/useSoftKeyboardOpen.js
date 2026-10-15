import { useEffect, useState } from "react";
import { opensSoftKeyboard } from "../utils/misc/opensSoftKeyboard";

// The keyboard takes ~40% of a phone screen; browser bars coming and
// going change the height by far less than this.
const KEYBOARD_SHRINK_RATIO = 0.8;

// True while the phone's on-screen keyboard is up, so a screen can drop
// whatever is not needed for typing and keep the rest in view.
//
// Focus alone is not enough: iOS can focus an autoFocus input without
// raising the keyboard. So we also require the visual viewport to have
// shrunk well below the tallest height seen in this orientation.
export default function useSoftKeyboardOpen() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    let fullHeight = viewport.height;
    let timeout;

    const update = () => {
      fullHeight = Math.max(fullHeight, viewport.height);
      setIsOpen(
        opensSoftKeyboard(document.activeElement) && viewport.height < fullHeight * KEYBOARD_SHRINK_RATIO,
      );
    };
    // focusout fires before focus lands on the next element, so read
    // activeElement once the move has settled.
    const updateSoon = () => {
      clearTimeout(timeout);
      timeout = setTimeout(update, 0);
    };
    const resetForOrientation = () => {
      fullHeight = 0;
      updateSoon();
    };

    viewport.addEventListener("resize", update);
    document.addEventListener("focusin", updateSoon);
    document.addEventListener("focusout", updateSoon);
    window.addEventListener("orientationchange", resetForOrientation);
    update();
    return () => {
      clearTimeout(timeout);
      viewport.removeEventListener("resize", update);
      document.removeEventListener("focusin", updateSoon);
      document.removeEventListener("focusout", updateSoon);
      window.removeEventListener("orientationchange", resetForOrientation);
    };
  }, []);

  return isOpen;
}
