import { useContext, useEffect, useMemo, useRef, useState } from "react";
import LocalStorage from "../assorted/LocalStorage";
import fisherYatesShuffle from "../assorted/fisherYatesShuffle";
import { ThemeContext } from "../contexts/ThemeContext";
import { DrillAnswer, DrillBox, DrillHint, DrillLabel } from "./WaitDrill.sc";

const ORIGIN_VISIBLE_MS = 4500;
const TRANSLATION_VISIBLE_MS = 2200;
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
// (exercises completed, words scheduled for study, in-reader taps) so it works
// offline. Renders nothing when the cache is empty — caller's regular spinner
// + diagnostic line still show.
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
  const timerRef = useRef(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;
    return () => {
      cancelledRef.current = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function advance() {
    if (cancelledRef.current) return;
    setRevealed(false);
    setIndex((i) => (i + 1) % queue.length);
  }

  function reveal() {
    if (cancelledRef.current) return;
    setRevealed(true);
    timerRef.current = setTimeout(advance, TRANSLATION_VISIBLE_MS);
  }

  useEffect(() => {
    if (queue.length === 0) return;
    timerRef.current = setTimeout(reveal, ORIGIN_VISIBLE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, queue]);

  if (queue.length === 0) return null;

  const current = queue[index];

  function handleTap() {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (revealed) advance();
    else reveal();
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
      <DrillLabel>a word while we wait…</DrillLabel>
      <div>
        <strong>{current.o}</strong>
        {"  →  "}
        <DrillAnswer $revealed={revealed}>
          {revealed ? current.t : "?"}
        </DrillAnswer>
      </div>
      <DrillHint>tap for next</DrillHint>
    </DrillBox>
  );
}
