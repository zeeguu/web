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
  alternativesLoaded,
}) {
  const [refToAlterMenu, clickedOutsideAlterMenu] = useClickOutside();
  const [inputValue, setInputValue] = useState("");

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

  const filteredAlternatives = word.alternatives?.filter((each) => each.translation !== word.translation) || [];
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
