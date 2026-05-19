import { useEffect, useMemo, useRef, useState } from "react";
import LocalStorage from "../assorted/LocalStorage";

const ORIGIN_VISIBLE_MS = 4500;
const TRANSLATION_VISIBLE_MS = 2200;
const SRC_PRIORITY = ["exercise", "scheduled", "translation"];

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQueue(entries) {
  const buckets = SRC_PRIORITY.map((src) => entries.filter((e) => e.src === src));
  const tail = entries.filter((e) => !SRC_PRIORITY.includes(e.src));
  return [...buckets.flatMap(shuffle), ...shuffle(tail)];
}

// Minimalist text-only vocab drill shown during long loading waits. Reads
// {origin, translation} pairs the app already accumulated in LocalStorage
// (exercises completed, words scheduled for study, in-reader taps) so it works
// offline. Renders nothing when the cache is empty — caller's regular spinner
// + diagnostic line still show.
export default function WaitDrill() {
  const learnedLang = LocalStorage.getLearnedLanguage();
  const queue = useMemo(
    () => buildQueue(LocalStorage.getDrillVocab(learnedLang)),
    [learnedLang],
  );

  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (queue.length === 0) return;

    function scheduleReveal() {
      timerRef.current = setTimeout(() => {
        setRevealed(true);
        timerRef.current = setTimeout(advance, TRANSLATION_VISIBLE_MS);
      }, ORIGIN_VISIBLE_MS);
    }

    function advance() {
      setRevealed(false);
      setIndex((i) => (i + 1) % queue.length);
    }

    scheduleReveal();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [index, queue]);

  if (queue.length === 0) return null;

  const current = queue[index];

  function handleTap() {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!revealed) {
      setRevealed(true);
      timerRef.current = setTimeout(() => {
        setRevealed(false);
        setIndex((i) => (i + 1) % queue.length);
      }, TRANSLATION_VISIBLE_MS);
    } else {
      setRevealed(false);
      setIndex((i) => (i + 1) % queue.length);
    }
  }

  return (
    <div
      onClick={handleTap}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleTap();
      }}
      style={{
        marginTop: "0.5rem",
        marginBottom: "0.5rem",
        padding: "1rem 1.25rem",
        minWidth: "16rem",
        maxWidth: "22rem",
        textAlign: "center",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        fontSize: "1rem",
        lineHeight: "1.6",
        color: "#444",
        border: "1px solid #ccc",
        borderRadius: "0.25rem",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <div style={{ fontSize: "0.75em", color: "#888", marginBottom: "0.5rem" }}>
        a word while we wait…
      </div>
      <div>
        <strong>{current.o}</strong>
        {"  →  "}
        <span style={{ color: revealed ? "#444" : "#bbb" }}>
          {revealed ? current.t : "?"}
        </span>
      </div>
      <div style={{ fontSize: "0.7em", color: "#aaa", marginTop: "0.5rem" }}>
        tap for next
      </div>
    </div>
  );
}
