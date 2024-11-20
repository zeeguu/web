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
      return "Goog";
    }
    if (word.source === "Google - with context") {
      return "Goog + ctx";
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
          specificStyle={{ height: "1rem", margin: "2rem 4rem" }}
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
      <div className="alterMenuLink" onClick={(e) => hideTranslation(e, word)}>
        Hide Translation
      </div>
    </AlterMenuSC>
  );
}
