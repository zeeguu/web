import { useState, useContext } from "react";
import { useClickOutside } from "react-click-outside-hook";
import AlterMenu from "./AlterMenu";
import { APIContext } from "../contexts/APIContext";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { zeeguuDarkRed } from "../components/colors";

export default function TranslatableWord({
  interactiveText,
  word,
  wordUpdated,
  translating,
  pronouncing,
  translatedWords,
  setTranslatedWords,
  disableTranslation,
}) {
  const [showingAlterMenu, setShowingAlterMenu] = useState(false);
  const [refToTranslation, clickedOutsideTranslation] = useClickOutside();
  const [isClickedToPronounce, setIsClickedToPronounce] = useState(false);
  const [isWordTranslating, setIsWordTranslating] = useState(false);
  const [prevWord, setPreviousWord] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const api = useContext(APIContext);

  function clickOnWord(e, word) {
    if (word.translation) {
      if (pronouncing) interactiveText.pronounce(word);
      if ((translating && !isVisible) || (!translating && isVisible))
        setIsVisible(!isVisible);
      return;
    }
    if (translating) {
      e.target.classList.add("loading");
      setPreviousWord(word.word);
      setIsWordTranslating(true);
      interactiveText.translate(word, () => {
        wordUpdated();
        e.target.classList.remove("loading");
        setIsWordTranslating(false);
        setIsVisible(true);
      });
      if (translatedWords) {
        let copyOfWords = [...translatedWords];
        copyOfWords.push(word.word);
        setTranslatedWords(copyOfWords);
      }
    }
    if (pronouncing || isClickedToPronounce) {
      setIsClickedToPronounce(true);
      interactiveText.pronounce(word);
    }
  }

  function toggleAlterMenu(e, word) {
    if (showingAlterMenu) {
      setShowingAlterMenu(false);
      return;
    }
    setShowingAlterMenu(true);
    interactiveText.alternativeTranslations(word, () => {
      wordUpdated(word);
    });
  }

  function deleteTranslation(e, word) {
    api.deleteBookmark(
      word.bookmark_id,
      (response) => {
        if (response === "OK") {
          // delete was successful; log and close
          word.translation = undefined;
          word.splitIntoComponents();
          wordUpdated();
        }
      },
      (error) => {
        // onError
        console.log(error);
        alert(
          "something went wrong and we could not delete the bookmark; try again later.",
        );
      },
    );
  }

  function selectAlternative(alternative, preferredSource) {
    interactiveText.selectAlternative(
      word,
      alternative,
      preferredSource,
      () => {
        wordUpdated();
        setShowingAlterMenu(false);
      },
    );
  }

  function hideAlterMenu() {
    setShowingAlterMenu(false);
  }

  function hideTranslation(e, word) {
    word.translation = undefined;
    word.splitIntoComponents();
    wordUpdated();
  }

  //disableTranslation so user cannot translate words that are being tested
  if ((!word.translation && !isClickedToPronounce) || disableTranslation) {
    return (
      <>
        <z-tag onClick={(e) => clickOnWord(e, word)}>{word.word + " "}</z-tag>
      </>
    );
  }
  return (
    <>
      <z-tag>
        {word.translation && isVisible && (
          <z-tran
            chosen={word.translation}
            translation0={word.translation}
            ref={refToTranslation}
          >
            <div className="translationContainer">
              <span onClick={(e) => toggleAlterMenu(e, word)}>
                {word.translation}
              </span>
              <span className="arrow" onClick={(e) => toggleAlterMenu(e, word)}>
                {showingAlterMenu ? "▲" : "▼"}
              </span>
              <span className="hide">
                <VisibilityOffIcon
                  fontSize="8px"
                  onClick={(e) => {
                    setIsVisible(!isVisible);
                    setShowingAlterMenu(false);
                  }}
                />
              </span>
            </div>
          </z-tran>
        )}
        <z-orig>
          {isWordTranslating ? (
            <span> {prevWord} </span>
          ) : (
            <span onClick={(e) => clickOnWord(e, word)}>{word.word} </span>
          )}
          {showingAlterMenu && (
            <AlterMenu
              word={word}
              setShowingAlternatives={setShowingAlterMenu}
              selectAlternative={selectAlternative}
              hideAlterMenu={hideAlterMenu}
              clickedOutsideTranslation={clickedOutsideTranslation}
              hideTranslation={hideTranslation}
              deleteTranslation={deleteTranslation}
            />
          )}
        </z-orig>
      </z-tag>
    </>
  );
}
