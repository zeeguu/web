import { useContext, useMemo, useState } from "react";
import LocalStorage from "../assorted/LocalStorage";
import fisherYatesShuffle from "../assorted/fisherYatesShuffle";
import { ThemeContext } from "../contexts/ThemeContext";
import { DrillAnswer, DrillBox, DrillHint } from "./WaitDrill.sc";

const SRC_PRIORITY = ["exercise", "scheduled", "translation"];

function buildQueue(entries) {
  const buckets = SRC_PRIORITY.map((src) =>
    fisherYatesShuffle(entries.filter((e) => e.src === src)),
  );
  const tail = fisherYatesShuffle(entries.filter((e) => !SRC_PRIORITY.includes(e.src)));
  return [...buckets.flat(), ...tail];
}

// Minimalist text-only vocab drill shown during long loading waits. Reads
// {origin, translation} pairs the app already accumulated in LocalStorage
// (exercises completed, words scheduled for study, in-reader taps) so it
// works offline. Tap-driven — no auto-advance, so the user gets to think.
// Renders nothing when the cache is empty.
export default function WaitDrill() {
  const themeValue = useContext(ThemeContext);
  const isDark = !!themeValue?.isDark;
  const learnedLang = LocalStorage.getLearnedLanguage();
  const queue = useMemo(
    () => buildQueue(LocalStorage.getDrillVocab(learnedLang)),
    [learnedLang],
  );

  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  if (queue.length === 0) return null;

  const current = queue[index];

  function handleTap() {
    if (!revealed) {
      setRevealed(true);
    } else {
      setRevealed(false);
      setIndex((i) => (i + 1) % queue.length);
    }
  }

  return (
    <DrillBox
      $isDark={isDark}
      onClick={handleTap}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleTap();
      }}
    >
      <div>
        <strong>{current.o}</strong>
        {"  →  "}
        <DrillAnswer $revealed={revealed}>
          {revealed ? current.t : "?"}
        </DrillAnswer>
      </div>
      <DrillHint>{revealed ? "tap for next" : "tap to reveal"}</DrillHint>
    </DrillBox>
  );
}
