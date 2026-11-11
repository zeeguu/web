import { useEffect, useState, useSyncExternalStore } from "react";
import styled from "styled-components";

import { zeeguuOrange } from "../components/colors";
import { aikiSecondsToUnlock, aikiSessionActive, subscribeAikiSession } from "./aikiMinute";

// A small "50s till unlock" note for the toolbar while an Aiki session runs
// and the paused apps are still locked. The notes about breaks come from
// aikiMinute, once the ledger grants them.
// `hidden` keeps the space empty where another copy is already on screen.
// `sentence` is the /aiki page's heading: "Study (50s) to unlock your paused
// apps", the seconds in the same pill as the toolbar's.
export default function AikiCountdown({ className, hidden = false, sentence = false }) {
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
  if (sentence) {
    return (
      <Sentence className={className}>
        {seconds > 0 ? (
          <>
            Study <Pill>{seconds}s</Pill> to unlock your paused apps
          </>
        ) : (
          "Unlocking your paused apps…"
        )}
      </Sentence>
    );
  }
  return <Pill className={className}>{seconds > 0 ? `${seconds}s till unlock` : "Unlocking…"}</Pill>;
}

const Sentence = styled.p`
  text-align: center;
  font-size: 1.15rem;
  line-height: 1.6;
  text-wrap: balance;
  color: var(--text-primary);
`;

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
