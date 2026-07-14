import { useRef, useState } from "react";
import { exitKioskMode } from "./kioskMode";
import ChoiceModal from "../components/modal_shared/ChoiceModal";

// The escape hatch out of kiosk mode: five taps in the top-left corner within
// a rolling 2-second window open a confirmation dialog. Deliberately hard to
// trigger by accident (so the locked-down user can't wander out), trivial for
// the person who set the device up. The corner hotspot is invisible and only
// ~56px, so it doesn't interfere with normal reading/scrolling.
const REQUIRED_TAPS = 5;
const WINDOW_MS = 2000;
const HOTSPOT_PX = 56;

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
        onClick={registerTap}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: HOTSPOT_PX,
          height: HOTSPOT_PX,
          zIndex: 2147483646,
          // Sit above content for taps but stay invisible and non-scrolling.
          background: "transparent",
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
