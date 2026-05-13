import { useEffect, useLayoutEffect, useState } from "react";
import { useClickOutside } from "react-click-outside-hook";
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
  const [refToAlterMenu, clickedOutsideAlterMenu] = useClickOutside();
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

  useEffect(() => {
    if (clickedOutsideAlterMenu && clickedOutsideTranslation) {
      hideAlterMenu();
    }
  }, [clickedOutsideAlterMenu, clickedOutsideTranslation, hideAlterMenu]);

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

  return (
    <AlterMenuSC ref={refToAlterMenu}>
      {/* Alternatives section - streams as they arrive */}
      {hasAlternatives && (
        <>
          <div style={{ color: "orange", fontSize: "small" }}>Choose alternative</div>
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
      {/* Show spinner while still loading */}
      {!alternativesLoaded && (
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
