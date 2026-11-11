import { useEffect, useState, useSyncExternalStore } from "react";
import styled from "styled-components";

import { zeeguuOrange } from "../components/colors";
import { aikiSecondsToUnlock, aikiSessionActive, subscribeAikiSession } from "./aikiMinute";

// A small "50s till unlock" note while an Aiki session runs and the paused
// apps are still locked: in the toolbar, or under the Aiki page's title. The
// notes about breaks come from aikiMinute, once the ledger grants them.
// `hidden` keeps the space empty where another copy is already on screen.
// `long` spells out "of study", where there is room for it (the /aiki page).
export default function AikiCountdown({ className, hidden = false, long = false }) {
  const active = useSyncExternalStore(subscribeAikiSession, aikiSessionActive);
  const [seconds, setSeconds] = useState(null);

  useEffect(() => {
    if (!active) {
      setSeconds(null);
      return;
    }
    const tick = () => setSeconds(aikiSecondsToUnlock());
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [active]);

  if (hidden || seconds === null) return null;
  if (seconds <= 0) return <Pill className={className}>Unlocking…</Pill>;
  return <Pill className={className}>{long ? `${seconds}s of study to unlock` : `${seconds}s till unlock`}</Pill>;
}

const Pill = styled.span`
  font-size: 0.85rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: white;
  background: ${zeeguuOrange};
  border-radius: 999px;
  padding: 0.2rem 0.65rem;
  white-space: nowrap;
  align-self: center;
`;
