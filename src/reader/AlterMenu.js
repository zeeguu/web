import { useEffect, useState } from "react";
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
}) {
  const [refToAlterMenu, clickedOutsideAlterMenu] = useClickOutside();
  const [inputValue, setInputValue] = useState("");

  // Alternatives load asynchronously - show spinner while loading
  const hasAlternativesLoaded = word.alternatives !== undefined;

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

  function shortenSource(word) {
    if (word.source === "Microsoft - without context") {
      return "Azure";
    }
    if (word.source === "Microsoft - with context") {
      return "Azure (contextual)";
    }

    if (word.source === "Google - without context") {
      return "Google";
    }
    if (word.source === "Google - with context") {
      return "Google (contextual)";
    }

    return word.source;
  }

  return (
    <AlterMenuSC ref={refToAlterMenu}>
      {/* Actions - always available, don't depend on alternatives */}
      {word.mweExpression && ungroupMwe && (
        <div className="removeLink" onClick={(e) => ungroupMwe(e, word)}>
          Ungroup expression
        </div>
      )}
      <div className="removeLink" onClick={(e) => deleteTranslation(e, word)}>
        Delete translation
      </div>

      {/* Alternatives section - shows spinner while loading */}
      {!hasAlternativesLoaded ? (
        <LoadingAnimation specificStyle={{ height: "3.5rem", margin: "1rem 3.1rem" }} delay={0}></LoadingAnimation>
      ) : (
        <>
          {word.alternatives.filter((each) => each.translation !== word.translation).length > 0 ? (
            <>
              <div style={{ color: "orange", fontSize: "small" }}>Choose alternative</div>
              {word.alternatives
                .filter((each) => each.translation !== word.translation)
                .map((each, index) => (
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
          ) : (
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
        </>
      )}
    </AlterMenuSC>
  );
}
