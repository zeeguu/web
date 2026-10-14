import { useEffect, useMemo, useState } from "react";
import LocalStorage from "../assorted/LocalStorage";
import { getDrillVocab } from "../assorted/drillCache";
import fisherYatesShuffle from "../assorted/fisherYatesShuffle";
import { DrillAnswer, DrillPair } from "./WaitDrill.sc";

const SRC_PRIORITY = ["exercise", "scheduled", "translation"];

const ORIGIN_VISIBLE_MS = 5000;
const TRANSLATION_VISIBLE_MS = 2500;

function buildQueue(entries) {
  const buckets = SRC_PRIORITY.map((src) =>
    fisherYatesShuffle(entries.filter((e) => e.src === src)),
  );
  const tail = fisherYatesShuffle(entries.filter((e) => !SRC_PRIORITY.includes(e.src)));
  return [...buckets.flat(), ...tail];
}

// Minimalist vocab drill shown during long loading waits: one word pair that
// auto-cycles (word, then its translation, then the next word). Tapping skips
// ahead — reveals the translation, or moves on if it's already shown — and
// restarts the timer, so a user who wants to go faster just keeps tapping.
//
// Reads {origin, translation} pairs from LocalStorage (filled by completed
// exercises / scheduled-words seed / in-reader taps) so it works offline.
export default function WaitDrill() {
  const learnedLang = LocalStorage.getLearnedLanguage();
  const queue = useMemo(
    () => buildQueue(getDrillVocab(learnedLang)),
    [learnedLang],
  );

  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  function step() {
    if (!revealed) {
      setRevealed(true);
      return;
    }
    setRevealed(false);
    setIndex((i) => (i + 1) % queue.length);
  }

  // Re-armed on every step, so a tap also resets the countdown.
  useEffect(() => {
    if (queue.length === 0) return;
    const ms = revealed ? TRANSLATION_VISIBLE_MS : ORIGIN_VISIBLE_MS;
    const timer = setTimeout(step, ms);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, revealed, queue]);

  if (queue.length === 0) return null;

  const current = queue[index];

  return (
    <DrillPair
      onClick={step}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") step();
      }}
    >
      <strong>{current.o}</strong>
      {"  →  "}
      <DrillAnswer $revealed={revealed}>
        {revealed ? current.t : "?"}
      </DrillAnswer>
    </DrillPair>
  );
}
