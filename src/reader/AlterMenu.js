import { useEffect, useState } from "react";
import { useClickOutside } from "react-click-outside-hook";
import { zeeguuDarkOrange } from "../components/colors";
import { AlterMenuSC } from "./AlterMenu.sc";
import LoadingAnimation from "../components/LoadingAnimation";

export default function AlterMenu({
  word,
  hideAlterMenu,
  selectAlternative,
  hideTranslation,
  clickedOutsideTranslation,
}) {
  const [refToAlterMenu, clickedOutsideAlterMenu] = useClickOutside();
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (clickedOutsideAlterMenu && clickedOutsideTranslation) {
      hideAlterMenu();
    }
  }, [clickedOutsideAlterMenu]);

  function handleKeyDown(e) {
    if (e.code === "Enter") {
      selectAlternative(inputValue, "User Suggested");
    }
  }

  function shortenSource(word) {
    if (word.source === "Microsoft - without context") {
      return "Microsoft translate";
    }
    if (word.source === "Microsoft - with context") {
      return "contextual Microsoft translate";
    }

    if (word.source === "Google - without context") {
      return "Google translate";
    }
    if (word.source === "Google - with context") {
      return "contextual Google translate";
    }

    return word.source;
  }
  return (
    <AlterMenuSC ref={refToAlterMenu}>
      {word.alternatives === undefined ? (
        <LoadingAnimation
          specificStyle={{ height: "1em", margin: "1em 3em" }}
          delay={100}
        ></LoadingAnimation>
      ) : (
        word.alternatives.map((each) => (
          <div
            key={each.translation}
            onClick={(e) =>
              selectAlternative(each.translation, shortenSource(each))
            }
            className="additionalTrans"
          >
            {each.translation}
            <div style={{ fontSize: 9, color: zeeguuDarkOrange }}>
              {shortenSource(each)}
            </div>
          </div>
        ))
      )}
      {word.alternatives !== undefined && (
        <input
          className="ownTranslationInput matchWidth"
          type="text"
          id="#userAlternative"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e)}
          placeholder="add own translation..."
        />
      )}

      <div className="alterMenuLink" onClick={(e) => hideTranslation(e, word)}>
        Hide Translation
      </div>
    </AlterMenuSC>
  );
}
