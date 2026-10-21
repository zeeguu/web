import { useEffect, useState, useSyncExternalStore } from "react";
import styled from "styled-components";

import { zeeguuOrange } from "../components/colors";
import { aikiProgress, aikiSessionActive, subscribeAikiSession } from "./aikiMinute";

// A thin line across the top of the screen that fills over each minute of
// learning in an Aiki session, so the learner sees their next break coming.
// The notes about breaks come from aikiMinute, once the ledger grants them.
export default function AikiMinuteBar() {
  const active = useSyncExternalStore(subscribeAikiSession, aikiSessionActive);
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    if (!active) {
      setProgress(null);
      return;
    }
    const tick = () => setProgress(aikiProgress());
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [active]);

  if (!progress) return null;
  const minute = Math.floor(progress.seconds / 60);
  return (
    <Track>
      <Fill key={minute} style={{ width: `${((progress.seconds % 60) / 60) * 100}%` }} />
    </Track>
  );
}

const Track = styled.div`
  position: fixed;
  top: env(safe-area-inset-top);
  left: 0;
  right: 0;
  height: 3px;
  z-index: 2000;
  pointer-events: none;
`;

const Fill = styled.div`
  height: 100%;
  background: ${zeeguuOrange};
  transition: width 1s linear;
`;
