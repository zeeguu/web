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
  deleteTranslation,
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
      return "Azure";
    }
    if (word.source === "Microsoft - with context") {
      return "Azure (in context)";
    }

    if (word.source === "Google - without context") {
      return "Google";
    }
    if (word.source === "Google - with context") {
      return "Google (in context)";
    }

    return word.source;
  }

  return (
    <AlterMenuSC
      ref={refToAlterMenu}
      className={word.alternatives === undefined ? "loading" : ""}
    >
      {word.alternatives === undefined ? (
        <LoadingAnimation
          specificStyle={{ height: "3.5rem", margin: "1rem 3.1rem" }}
          delay={0}
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
        ))
      )}
      {word.alternatives !== undefined && (
        <>
          <input
            autocomplete="off"
            className="ownTranslationInput matchWidth"
            type="text"
            id="#userAlternative"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e)}
            placeholder="add own translation..."
          />
        </>
      )}
      {word.alternatives !== undefined && (
        <div className="removeLink" onClick={(e) => deleteTranslation(e, word)}>
          Delete Translation
        </div>
      )}
    </AlterMenuSC>
  );
}
