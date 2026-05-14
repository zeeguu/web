import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AlterMenuSC } from "./AlterMenu.sc";
import LoadingAnimation from "../components/LoadingAnimation";

const HEADER_BAND_STYLE = {
  whiteSpace: "nowrap",
  padding: "0.1rem 0 0.2rem",
  fontSize: "0.7em",
  fontWeight: 500,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  opacity: 0.7,
};

const PROVIDER_LABELS = {
  "Microsoft - without context": "Azure",
  "Microsoft - with context": "Azure",
  "Microsoft - alignment": "Azure",
  "Google - without context": "Google",
  "Google - with context": "Google",
  "Google - MWE phrase": "Google",
  "DeepL - with context": "DeepL",
};

function shortenSource(alt) {
  return PROVIDER_LABELS[alt.source] || alt.source;
}

// Merge competing_translations (known immediately from the bookmark
// response, when providers disagree) with word.alternatives (streamed
// in lazily by AlterMenu open). Dedupe by normalised translation text
// and drop anything equal to the current primary translation.
function buildAlternatives(word) {
  const seen = new Set();
  const list = [];
  const normaliseKey = (t) => (t || "").toLowerCase().trim();
  const primaryKey = normaliseKey(word.translation);
  if (primaryKey) seen.add(primaryKey);

  const sources = [word.competing_translations, word.alternatives];
  for (const src of sources) {
    if (!src) continue;
    for (const entry of src) {
      const key = normaliseKey(entry?.translation);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      list.push(entry);
    }
  }
  return list;
}

export default function AlterMenu({
  word,
  hideAlterMenu,
  selectAlternative,
  deleteTranslation,
  ungroupMwe,
  alternativesLoaded,
}) {
  const refToAlterMenu = useRef(null);
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const [showOwnInput, setShowOwnInput] = useState(false);

  useEffect(() => {
    if (showOwnInput && inputRef.current) inputRef.current.focus();
  }, [showOwnInput]);

  useLayoutEffect(() => {
    const el = refToAlterMenu.current;
    const trigger = el?.parentElement;
    if (!el || !trigger) return;
    const triggerRect = trigger.getBoundingClientRect();
    const margin = 8;
    el.style.position = "fixed";
    el.style.margin = "0";
    el.style.top = `${triggerRect.bottom + 4}px`;
    // Measure the menu's intrinsic width once positioned
    el.style.left = "0";
    const elWidth = el.offsetWidth;
    let left = triggerRect.left;
    if (left + elWidth > window.innerWidth - margin) {
      left = window.innerWidth - elWidth - margin;
    }
    if (left < margin) left = margin;
    el.style.left = `${left}px`;
  });

  // Modal-style outside-click handling: a capture-phase document listener
  // fires before any target's own click handler, so we can stopPropagation
  // BEFORE the tapped word's clickOnWord runs. This way a tap outside the
  // menu just closes the menu — it doesn't translate the new word.
  useEffect(() => {
    function handleCapture(e) {
      const el = refToAlterMenu.current;
      if (el && !el.contains(e.target)) {
        // stopPropagation kills React's delegated onClick before it dispatches
        // (so the tapped word doesn't translate). preventDefault on touchend
        // also stops the browser from synthesizing the click that would
        // otherwise slip through after our menu unmounts.
        e.stopPropagation();
        e.preventDefault();
        hideAlterMenu();
      }
    }
    const opts = { capture: true, passive: false };
    document.addEventListener("click", handleCapture, opts);
    document.addEventListener("touchend", handleCapture, opts);
    return () => {
      document.removeEventListener("click", handleCapture, opts);
      document.removeEventListener("touchend", handleCapture, opts);
    };
  }, [hideAlterMenu]);

  function handleKeyDown(e) {
    if (e.code === "Enter") {
      selectAlternative(inputValue, "User Suggested");
    }
  }

  const filteredAlternatives = buildAlternatives(word);
  const hasAlternatives = filteredAlternatives.length > 0;
  const showEmptyHeader = alternativesLoaded && !hasAlternatives;
  let header = null;
  if (word.disagreement) {
    header = (
      <div style={{ ...HEADER_BAND_STYLE, color: "var(--altermenu-header-text-disagreement)" }}>
        <span style={{ fontSize: "1.4em", verticalAlign: "middle", lineHeight: 1, borderBottom: "none" }}>🤖🥊</span>{" "}
        Bots disagree
      </div>
    );
  } else if (hasAlternatives) {
    header = (
      <div style={{ ...HEADER_BAND_STYLE, color: "var(--altermenu-header-text)" }}>Alternatives</div>
    );
  } else if (showEmptyHeader) {
    header = (
      <div style={{ ...HEADER_BAND_STYLE, color: "var(--altermenu-header-text)" }}>No alternatives found</div>
    );
  }

  return (
    <AlterMenuSC ref={refToAlterMenu}>
      {header}
      {hasAlternatives && filteredAlternatives.map((each, index) => (
        <div
          key={`${each.translation}-${each.source}-${index}`}
          onClick={(e) => selectAlternative(each.translation, shortenSource(each))}
          className="additionalTrans"
        >
          {each.translation}
          <div className="altermenuSourceLabel">{shortenSource(each)}</div>
        </div>
      ))}
      {/* Spinner only when we have nothing to show yet — competing_translations
          from the bookmark response already populate the list immediately, so
          showing a spinner under them looks like a stray "extra option". */}
      {!alternativesLoaded && !hasAlternatives && (
        <LoadingAnimation specificStyle={{ transform: "scale(0.4)", height: "2rem", margin: "0.5rem 0 -0.5rem 0" }} delay={0}></LoadingAnimation>
      )}
      {showOwnInput && (
        <input
          ref={inputRef}
          autoComplete="off"
          className="ownTranslationInput matchWidth"
          type="text"
          id="#userAlternative"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e)}
          placeholder="Type your translation and press Enter"
        />
      )}
      <div className="actionsSection">
        {!showOwnInput && (
          <div className="addOwnLink" onClick={() => setShowOwnInput(true)}>
            Add own translation
          </div>
        )}
        {word.mweExpression && ungroupMwe && (
          <div className="removeLink" onClick={(e) => ungroupMwe(e, word)}>
            Ungroup expression
          </div>
        )}
        <div className="removeLink" onClick={(e) => deleteTranslation(e, word)}>
          Delete translation
        </div>
      </div>
    </AlterMenuSC>
  );
}
