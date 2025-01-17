import { useState, useContext, useEffect } from "react";
import { useClickOutside } from "react-click-outside-hook";
import AlterMenu from "./AlterMenu";
import { APIContext } from "../contexts/APIContext";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import extractDomain from "../utils/web/extractDomain";
import redirect from "../utils/routing/routing";

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

  useEffect(() => {
    if (word.translation) setIsVisible(false);
  }, []);

  function clickOnWord(e, word) {
    if (word.translation) {
      if (pronouncing) interactiveText.pronounce(word);
      if ((translating && !isVisible) || (!translating && isVisible))
        setIsVisible(!isVisible);
      return;
    }
    if (translating) {
      if (!disableTranslation && !word.is_punct) {
        e.target.classList.add("loading");
        setPreviousWord(word.word);
        setIsWordTranslating(true);
        interactiveText.translate(word, () => {
          wordUpdated();
          e.target.classList.remove("loading");
          setIsWordTranslating(false);
          setIsVisible(true);
        });
      }

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
    word.splitIntoComponents();
    wordUpdated();
  }

  function getWordClass(word) {
    /*
    Function determines which class to be assigned to the word object.
    Mainly, to render the punctuation cases that need to be handled differently.
    By default, all punctuation words are assigned the class "punct", which means they
    are moved slightly to the left, to be close to the previous tokens.
    - left_punct means that the punctuation is moved a bit to the right, for example ( 
    */
    const noMarginPunctuation = ["–", "—", "“", "‘", '"'];
    let allClasses = [];
    if (word.is_punct) allClasses.push("punct");
    if (
      word.is_left_punct ||
      (word.is_punct &&
        word.prev &&
        [":", ".", ","].includes(word.prev.word.trim()))
    )
      allClasses.push("left-punct");
    if (word.is_like_num) allClasses.push("number");
    if (noMarginPunctuation.includes(word.word.trim()))
      allClasses.push("no-margin");
    return allClasses.join(" ");
  }

  const wordClass = getWordClass(word);

  if (word.is_like_email)
    return (
      <>
        <z-tag>
          <a href={"mailto:" + word.word}>{extractDomain(word.word) + " "}</a>
        </z-tag>
      </>
    );
  if (word.is_like_url)
    return (
      <>
        <z-tag onClick={() => redirect(word.word, true)}>
          <span className="link-style">{extractDomain(word.word) + " "}</span>
        </z-tag>
      </>
    );
  //disableTranslation so user cannot translate words that are being tested
  if (
    (!isWordTranslating && !word.translation && !isClickedToPronounce) ||
    disableTranslation
  ) {
    return (
      <>
        <z-tag class={wordClass} onClick={(e) => clickOnWord(e, word)}>
          {word.word + " "}
        </z-tag>
      </>
    );
  }

  return (
    <>
      <z-tag class={wordClass}>
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
