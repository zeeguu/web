import { useRef, useState } from "react";
import { exitKioskMode } from "./kioskMode";
import ChoiceModal from "../components/modal_shared/ChoiceModal";

// The escape hatch out of kiosk mode: five quick taps in the top-right corner
// open a confirmation dialog. Deliberately hard to trigger by accident (so the
// locked-down user can't wander out), trivial for the person who set it up.
//
// iOS notes (learned the hard way): use pointerdown, NOT click — click on a
// bare div is flaky on WKWebView and rapid taps get eaten by double-tap-zoom
// detection. `touch-action: manipulation` disables that zoom gesture so every
// tap registers immediately. The hotspot is invisible — reliability comes from
// the touch handling, not a visible marker, so nothing shows to the reader.
const REQUIRED_TAPS = 5;
const WINDOW_MS = 2500;
const HOTSPOT_PX = 72;

export default function CornerTapExit() {
  const tapTimes = useRef([]);
  const [showConfirm, setShowConfirm] = useState(false);

  function registerTap() {
    const now = Date.now();
    tapTimes.current = tapTimes.current.filter((t) => now - t < WINDOW_MS);
    tapTimes.current.push(now);
    if (tapTimes.current.length >= REQUIRED_TAPS) {
      tapTimes.current = [];
      setShowConfirm(true);
    }
  }

  return (
    <>
      <div
        onPointerDown={registerTap}
        aria-hidden="true"
        style={{
          position: "fixed",
          // Sit just inside the safe area so the status bar / notch can't
          // intercept taps at the very top edge.
          top: "env(safe-area-inset-top, 0px)",
          right: "env(safe-area-inset-right, 0px)",
          width: HOTSPOT_PX,
          height: HOTSPOT_PX,
          zIndex: 2147483646,
          background: "transparent",
          // Register every tap immediately: no 300ms click delay, no double-tap zoom.
          touchAction: "manipulation",
          cursor: "pointer",
          WebkitUserSelect: "none",
          userSelect: "none",
          WebkitTapHighlightColor: "transparent",
        }}
      />

      {showConfirm && (
        <ChoiceModal
          message="Exit reader mode?"
          primaryLabel="Exit"
          secondaryLabel="Cancel"
          onPrimary={exitKioskMode}
          onSecondary={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
