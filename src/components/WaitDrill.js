import { useContext, useEffect, useMemo, useRef, useState } from "react";
import LocalStorage from "../assorted/LocalStorage";
import fisherYatesShuffle from "../assorted/fisherYatesShuffle";
import { ThemeContext } from "../contexts/ThemeContext";
import {
  DrillAnswer,
  DrillBox,
  DrillHint,
  DrillHistoryItem,
  DrillHistoryList,
  DrillModeLink,
} from "./WaitDrill.sc";

const SRC_PRIORITY = ["exercise", "scheduled", "translation"];

const ORIGIN_VISIBLE_MS = 5000;
const TRANSLATION_VISIBLE_MS = 2500;
const HISTORY_MAX = 5;

function buildQueue(entries) {
  const buckets = SRC_PRIORITY.map((src) =>
    fisherYatesShuffle(entries.filter((e) => e.src === src)),
  );
  const tail = fisherYatesShuffle(entries.filter((e) => !SRC_PRIORITY.includes(e.src)));
  return [...buckets.flat(), ...tail];
}

// Minimalist text-only vocab drill shown during long loading waits. Two
// modes: passive (auto-cycles, card is non-interactive) and interactive
// (timer off, user taps to reveal / advance). Defaults to passive so the
// drill is ignorable; the link below toggles.
//
// Reads {origin, translation} pairs from LocalStorage (filled by completed
// exercises / scheduled-words seed / in-reader taps) so it works offline.
export default function WaitDrill() {
  const themeValue = useContext(ThemeContext);
  const isDark = !!themeValue?.isDark;
  const learnedLang = LocalStorage.getLearnedLanguage();
  const queue = useMemo(
    () => buildQueue(LocalStorage.getDrillVocab(learnedLang)),
    [learnedLang],
  );

  const [interactive, setInteractive] = useState(false);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [history, setHistory] = useState([]);
  const seqRef = useRef(0);
  const timerRef = useRef(null);

  function advance() {
    const w = queue[index];
    seqRef.current += 1;
    setHistory((prev) => [{ o: w.o, t: w.t, id: seqRef.current }, ...prev].slice(0, HISTORY_MAX));
    setRevealed(false);
    setIndex((i) => (i + 1) % queue.length);
  }

  useEffect(() => {
    if (interactive || queue.length === 0) return;
    const ms = revealed ? TRANSLATION_VISIBLE_MS : ORIGIN_VISIBLE_MS;
    timerRef.current = setTimeout(() => {
      if (revealed) advance();
      else setRevealed(true);
    }, ms);
    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactive, revealed, queue]);

  if (queue.length === 0) return null;

  const current = queue[index];

  function handleCardTap() {
    if (!interactive) return;
    if (revealed) advance();
    else setRevealed(true);
  }

  function toggleMode(e) {
    e.stopPropagation();
    setInteractive((m) => !m);
  }

  return (
    <>
      <DrillBox
        $isDark={isDark}
        $interactive={interactive}
        onClick={handleCardTap}
        role={interactive ? "button" : undefined}
        tabIndex={interactive ? 0 : undefined}
        onKeyDown={(e) => {
          if (interactive && (e.key === "Enter" || e.key === " ")) handleCardTap();
        }}
      >
        <div>
          <strong>{current.o}</strong>
          {"  →  "}
          <DrillAnswer $revealed={revealed}>
            {revealed ? current.t : "?"}
          </DrillAnswer>
        </div>
        {interactive && (
          <DrillHint>{revealed ? "tap for next" : "tap to reveal"}</DrillHint>
        )}
      </DrillBox>
      <DrillModeLink onClick={toggleMode}>
        {interactive ? "back to auto-cycle" : "tap to take control"}
      </DrillModeLink>
      {history.length > 0 && (
        <DrillHistoryList>
          {history.map((h, i) => (
            <DrillHistoryItem key={h.id} $age={i}>
              {h.o} → {h.t}
            </DrillHistoryItem>
          ))}
        </DrillHistoryList>
      )}
    </>
  );
}
