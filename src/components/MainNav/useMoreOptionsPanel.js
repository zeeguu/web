import { useEffect, useRef, useState } from "react";
import { fadeIn, fadeOut, slideIn, slideOut } from "../transitions";

// Open/close state for the More panel, with the transitions it plays on the
// way in and out. The panel is unmounted 300ms after closing, once the slide
// out has finished.
export default function useMoreOptionsPanel() {
  const [overlayTransition, setOverlayTransition] = useState({});
  const [moreOptionsTransition, setMoreOptionsTransition] = useState({});
  const [renderMoreOptions, setRenderMoreOptions] = useState(false);
  const hideDelay = useRef(0);

  useEffect(() => () => clearTimeout(hideDelay.current), []);

  function showMoreOptions() {
    clearTimeout(hideDelay.current);
    setOverlayTransition(fadeIn);
    setRenderMoreOptions(true);
    setMoreOptionsTransition(slideIn);
  }

  function hideMoreOptions() {
    clearTimeout(hideDelay.current);
    setOverlayTransition(fadeOut);
    setMoreOptionsTransition(slideOut);
    hideDelay.current = setTimeout(() => setRenderMoreOptions(false), 300);
  }

  return { renderMoreOptions, overlayTransition, moreOptionsTransition, showMoreOptions, hideMoreOptions };
}
