import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AlterMenuSC } from "./AlterMenu.sc";
import LoadingAnimation from "../components/LoadingAnimation";

export default function AlterMenu({
  word,
  hideAlterMenu,
  selectAlternative,
  deleteTranslation,
  ungroupMwe,
  clickedOutsideTranslation,
  alternativesLoaded,
}) {
  const refToAlterMenu = useRef(null);
  const [inputValue, setInputValue] = useState("");

  useLayoutEffect(() => {
    const el = refToAlterMenu.current;
    if (el) {
      // Reset to default (left-aligned) to measure natural position
      el.style.right = "";
      const rect = el.getBoundingClientRect();
      if (rect.right > window.innerWidth) {
        el.style.right = "0";
      }
    }
  }, [alternativesLoaded]);

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

  function shortenSource(word) {
    const labels = {
      "Microsoft - without context": "Azure",
      "Microsoft - with context": "Azure (contextual)",
      "Microsoft - alignment": "Azure (alignment)",
      "Google - without context": "Google",
      "Google - with context": "Google (contextual)",
      "DeepL - with context": "DeepL",
    };
    return labels[word.source] || word.source;
  }

  const filteredAlternatives = buildAlternatives(word);
  const hasAlternatives = filteredAlternatives.length > 0;
  const headerBandStyle = {
    whiteSpace: "nowrap",
    backgroundColor: "#ffe59e",
    borderBottom: "1px solid rgba(139, 90, 43, 0.25)",
    padding: "0.4rem 0.6rem",
    margin: "-0.3em -0.3em 0.4rem -0.3em",
    fontWeight: 800,
  };
  const header = word.disagreement ? (
    <div style={{ ...headerBandStyle, color: "crimson" }}>
      <span style={{ fontSize: "1.4em", verticalAlign: "middle", lineHeight: 1, borderBottom: "none" }}>🤖🥊</span>{" "}
      Bots disagree
    </div>
  ) : (
    <div style={{ ...headerBandStyle, color: "#01345d" }}>Alternatives</div>
  );

  return (
    <AlterMenuSC ref={refToAlterMenu}>
      {/* Alternatives section - streams as they arrive */}
      {hasAlternatives && (
        <>
          {header}
          {filteredAlternatives.map((each, index) => (
            <div
              key={`${each.translation}-${each.source}-${index}`}
              onClick={(e) => selectAlternative(each.translation, shortenSource(each))}
              className="additionalTrans"
            >
              {each.translation}
              <div
                style={{
                  marginTop: "-4px",
                  fontSize: 8,
                  color: "rgb(240,204,160)",
                }}
              >
                {shortenSource(each)}
              </div>
            </div>
          ))}
        </>
      )}
      {/* Spinner only when we have nothing to show yet — competing_translations
          from the bookmark response already populate the list immediately, so
          showing a spinner under them looks like a stray "extra option". */}
      {!alternativesLoaded && !hasAlternatives && (
        <LoadingAnimation specificStyle={{ transform: "scale(0.4)", height: "2rem", margin: "0.5rem 0 -0.5rem 0" }} delay={0}></LoadingAnimation>
      )}
      {/* Only show "no alternatives" when done loading and none found */}
      {alternativesLoaded && !hasAlternatives && (
        <div className="noAlternatives">No alternative found</div>
      )}
      <input
        autoComplete="off"
        className="ownTranslationInput matchWidth"
        type="text"
        id="#userAlternative"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => handleKeyDown(e)}
        placeholder="Add own translation..."
      />
      <div className="actionsSection">
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
