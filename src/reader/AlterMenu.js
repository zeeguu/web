import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AlterMenuSC } from "./AlterMenu.sc";

const HEADER_BAND_STYLE = {
  whiteSpace: "nowrap",
  padding: "0.1rem 0 0.2rem",
  fontSize: "0.7em",
  fontWeight: 500,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  opacity: 0.7,
};

const PROVIDER_NAME_OVERRIDES = {
  Microsoft: "Azure",
};

function shortenSource(alt) {
  // Source comes in as "Provider - variant" (e.g. "Microsoft - with context",
  // "Google - MWE phrase"); collapse to just the provider name.
  const provider = (alt.source || "").split(" - ")[0];
  return PROVIDER_NAME_OVERRIDES[provider] || provider || alt.source;
}

// ADR 022: `word.alternatives` carries the full vote-ordered provider list
// (winner at index 0) directly from /translate_word, plus any LLM-on-demand
// result appended via askLlmTranslation. The menu shows the non-winner
// entries — dedupe by normalised translation text and drop anything equal
// to the current primary translation.
//
// `allAgreedWithPrimary` is true when the providers ran (alternatives is
// non-empty in some source) but everything they returned matched the
// primary. The header turns into an affirmation instead of "no alternatives
// found", so the user can tell the system did look — it just confirmed
// the translation they already had. (Especially common for past-translation
// words: the user previously accepted the providers' consensus, so when we
// ask the providers again they say the same thing.)
//
// `word.competing_translations` is the legacy field kept during ADR 022's
// deprecation window; consulted for clients (extension build) that still
// only receive it. Safe to drop once the extension reads `alternatives`.
function buildAlternatives(word) {
  const seen = new Set();
  const list = [];
  let hadAnyEntry = false;
  const normaliseKey = (t) => (t || "").toLowerCase().trim();
  const primaryKey = normaliseKey(word.translation);
  if (primaryKey) seen.add(primaryKey);

  const sources = [word.competing_translations, word.alternatives];
  for (const src of sources) {
    if (!src) continue;
    for (const entry of src) {
      const key = normaliseKey(entry?.translation);
      if (!key) continue;
      hadAnyEntry = true;
      if (seen.has(key)) continue;
      seen.add(key);
      list.push(entry);
    }
  }
  return { list, allAgreedWithPrimary: hadAnyEntry && list.length === 0 };
}

export default function AlterMenu({
  word,
  hideAlterMenu,
  selectAlternative,
  deleteTranslation,
  ungroupMwe,
  askLlmTranslation,
}) {
  const refToAlterMenu = useRef(null);
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const [showOwnInput, setShowOwnInput] = useState(false);
  // ADR 022: Ask-LLM is opt-in. While the LLM call is in flight the row
  // shows "Asking LLM…" and is disabled. On success we hide the button
  // (the new alternative is now in the list). On failure we leave the
  // button visible with an inline error so the user can retry — silently
  // removing it would look like "the option just vanished and nothing
  // happened," which is exactly what we got bug-reported on.
  //
  // Initial state is seeded from word._llmAsked so closing and reopening
  // the menu doesn't show the button again (and let the user pay for
  // another LLM round trip for an answer we already have). Component
  // state alone would reset on remount.
  const [isAskingLlm, setIsAskingLlm] = useState(false);
  const [llmSucceeded, setLlmSucceeded] = useState(word._llmAsked === "succeeded");
  const [llmAgreedWithPrimary, setLlmAgreedWithPrimary] = useState(word._llmAsked === "agreed");
  const [llmError, setLlmError] = useState(false);

  useEffect(() => {
    if (showOwnInput && inputRef.current) inputRef.current.focus();
  }, [showOwnInput]);

  // Close the menu as soon as the user starts scrolling — the menu is
  // viewport-fixed, so without this it'd stay floating while the trigger
  // word moves away under it. touchmove catches the finger drag before
  // iOS gets around to firing scroll, so the menu disappears at gesture
  // start instead of after the page has already moved.
  useEffect(() => {
    function handleScrollIntent(e) {
      const el = refToAlterMenu.current;
      if (e?.target && el && el.contains(e.target)) return;
      hideAlterMenu();
    }
    window.addEventListener("scroll", handleScrollIntent, { passive: true });
    window.addEventListener("touchmove", handleScrollIntent, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScrollIntent);
      window.removeEventListener("touchmove", handleScrollIntent);
    };
  }, [hideAlterMenu]);

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

  const { list: filteredAlternatives, allAgreedWithPrimary } = buildAlternatives(word);
  const hasAlternatives = filteredAlternatives.length > 0;

  // Reposition only when something that can change menu dimensions changes;
  // otherwise re-runs on every keystroke in the input force a reflow.
  useLayoutEffect(() => {
    const el = refToAlterMenu.current;
    const trigger = el?.parentElement;
    if (!el || !trigger) return;
    const triggerRect = trigger.getBoundingClientRect();
    const margin = 8;
    el.style.position = "fixed";
    el.style.margin = "0";
    el.style.top = `${triggerRect.bottom + 4}px`;
    el.style.left = "0";
    const elWidth = el.offsetWidth;
    let left = triggerRect.left;
    if (left + elWidth > window.innerWidth - margin) {
      left = window.innerWidth - elWidth - margin;
    }
    if (left < margin) left = margin;
    el.style.left = `${left}px`;
  }, [hasAlternatives, showOwnInput, filteredAlternatives.length]);

  let header = null;
  if (word.disagreement) {
    header = (
      <div style={{ ...HEADER_BAND_STYLE, color: "var(--altermenu-header-text)" }}>
        <span style={{ fontSize: "1.4em", verticalAlign: "middle", lineHeight: 1, borderBottom: "none" }}>🤖🥊</span>{" "}
        Bots disagree
      </div>
    );
  } else if (hasAlternatives) {
    header = (
      <div style={{ ...HEADER_BAND_STYLE, color: "var(--altermenu-header-text)" }}>Alternatives</div>
    );
  } else if (allAgreedWithPrimary) {
    const label = llmAgreedWithPrimary ? "All providers & AI agree" : "All providers agree";
    header = (
      <div style={{ ...HEADER_BAND_STYLE, color: "var(--altermenu-header-text)" }}>{label}</div>
    );
  } else {
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
        {askLlmTranslation && !llmSucceeded && !llmAgreedWithPrimary && (
          <div
            className="neutralLink"
            aria-disabled={isAskingLlm}
            style={isAskingLlm ? { opacity: 0.7, pointerEvents: "none" } : undefined}
            onClick={() => {
              if (isAskingLlm) return;
              setLlmError(false);
              setIsAskingLlm(true);
              askLlmTranslation(
                word,
                (info) => {
                  setIsAskingLlm(false);
                  if (info?.agreedWithPrimary) {
                    word._llmAsked = "agreed";
                    setLlmAgreedWithPrimary(true);
                  } else {
                    word._llmAsked = "succeeded";
                    setLlmSucceeded(true);
                  }
                },
                () => {
                  setIsAskingLlm(false);
                  setLlmError(true);
                },
              );
            }}
          >
            {isAskingLlm ? "Asking AI…" : llmError ? "Ask AI — try again" : "Ask AI"}
          </div>
        )}
        {!showOwnInput && (
          <div className="neutralLink" onClick={() => setShowOwnInput(true)}>
            Add own translation
          </div>
        )}
        {word.mweExpression && ungroupMwe && (
          <div className="neutralLink" onClick={(e) => ungroupMwe(e, word)}>
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
