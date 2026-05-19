import { useContext, useEffect, useMemo, useRef, useState } from "react";
import LocalStorage, { DRILL_OPT_IN } from "../assorted/LocalStorage";
import fisherYatesShuffle from "../assorted/fisherYatesShuffle";
import { ThemeContext } from "../contexts/ThemeContext";
import {
  DrillAnswer,
  DrillBox,
  DrillDismiss,
  DrillHint,
  DrillPromptActions,
  DrillPromptButton,
  DrillPromptText,
} from "./WaitDrill.sc";

const SRC_PRIORITY = ["exercise", "scheduled", "translation"];

// Hybrid auto-rotation + tap-to-reveal. Origin visible long enough to
// recall (~5s), then auto-reveal; tap during this window rewards active
// recall by revealing immediately. Translation lingers a moment for
// registration, then auto-advances.
const ORIGIN_VISIBLE_MS = 5000;
const TRANSLATION_VISIBLE_MS = 2500;

function buildQueue(entries) {
  const buckets = SRC_PRIORITY.map((src) =>
    fisherYatesShuffle(entries.filter((e) => e.src === src)),
  );
  const tail = fisherYatesShuffle(entries.filter((e) => !SRC_PRIORITY.includes(e.src)));
  return [...buckets.flat(), ...tail];
}

// Minimalist text-only vocab drill shown during long loading waits, opt-in
// per Chrome-dino UX: first time we ask "practice while we wait?"; the
// choice is persisted in LocalStorage so we never nag again. Reads
// {origin, translation} pairs from LocalStorage (filled by completed
// exercises / scheduled-words seed / in-reader taps) so it works offline.
// Hybrid pacing: auto-advances on its own, but tap reveals/advances early.
export default function WaitDrill() {
  const themeValue = useContext(ThemeContext);
  const isDark = !!themeValue?.isDark;
  const learnedLang = LocalStorage.getLearnedLanguage();
  const queue = useMemo(
    () => buildQueue(LocalStorage.getDrillVocab(learnedLang)),
    [learnedLang],
  );

  const [optIn, setOptIn] = useState(() => LocalStorage.getDrillOptIn());
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (optIn !== DRILL_OPT_IN.YES || queue.length === 0) return;
    const ms = revealed ? TRANSLATION_VISIBLE_MS : ORIGIN_VISIBLE_MS;
    timerRef.current = setTimeout(() => {
      if (revealed) {
        setRevealed(false);
        setIndex((i) => (i + 1) % queue.length);
      } else {
        setRevealed(true);
      }
    }, ms);
    return () => clearTimeout(timerRef.current);
  }, [optIn, revealed, queue]);

  if (queue.length === 0) return null;
  if (optIn === DRILL_OPT_IN.NO) return null;

  function accept() {
    LocalStorage.setDrillOptIn(DRILL_OPT_IN.YES);
    setOptIn(DRILL_OPT_IN.YES);
  }
  function decline() {
    LocalStorage.setDrillOptIn(DRILL_OPT_IN.NO);
    setOptIn(DRILL_OPT_IN.NO);
  }

  if (optIn !== DRILL_OPT_IN.YES) {
    return (
      <DrillBox $isDark={isDark} as="div">
        <DrillPromptText>
          Practice a few words while we wait?
        </DrillPromptText>
        <DrillPromptActions>
          <DrillPromptButton $isDark={isDark} onClick={accept}>
            yes
          </DrillPromptButton>
          <DrillPromptButton $isDark={isDark} $muted onClick={decline}>
            no thanks
          </DrillPromptButton>
        </DrillPromptActions>
      </DrillBox>
    );
  }

  const current = queue[index];

  function handleTap() {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!revealed) {
      setRevealed(true);
    } else {
      setRevealed(false);
      setIndex((i) => (i + 1) % queue.length);
    }
  }

  function dismiss(e) {
    e.stopPropagation();
    decline();
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
      <DrillDismiss
        aria-label="Stop showing the drill"
        onClick={dismiss}
      >
        ×
      </DrillDismiss>
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
