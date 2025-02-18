import { useState, useEffect } from "react";
import { useClickOutside } from "react-click-outside-hook";
import AlterMenu from "./AlterMenu";
import extractDomain from "../utils/web/extractDomain";
import addProtocolToLink from "../utils/web/addProtocolToLink";
import redirect from "../utils/routing/routing";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

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
  const [isTranslationVisible, setIsTranslationVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetchedAlternatives, setHasFetchedAlternatives] = useState(false);

  useEffect(() => {
    if (word.isTranslationVisible) {
      setIsTranslationVisible(true);
      return;
    }
    if (word.translation) setIsTranslationVisible(false);
  }, [word]);

  function clickOnWord(e, word) {
    if (word.token.is_like_num || word.token.is_punct) return;
    if (word.translation) {
      if (pronouncing) interactiveText.pronounce(word);
      if (
        (translating && !isTranslationVisible) ||
        (!translating && isTranslationVisible)
      )
        setIsTranslationVisible(!isTranslationVisible);
      return;
    }
    if (translating) {
      if (!disableTranslation) {
        setIsLoading(true);
        setPreviousWord(word.word);
        setIsWordTranslating(true);
        interactiveText.translate(word, true, () => {
          wordUpdated();
          setIsLoading(false);
          setIsWordTranslating(false);
          setIsTranslationVisible(true);
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
    if (!hasFetchedAlternatives)
      interactiveText.alternativeTranslations(word, () => {
        wordUpdated(word);
        setHasFetchedAlternatives(true);
      });
  }

  function unlinkLastWord(e, word) {
    setIsLoading(true);
    interactiveText.api.deleteBookmark(
      word.bookmark_id,
      (response) => {
        if (response === "OK") {
          // delete was successful; log and close
          let withoutLastWord = word.unlinkLastWord();
          interactiveText.translate(withoutLastWord, true, () => {
            withoutLastWord.isTranslationVisible = true;
            let unlinkedWord = withoutLastWord.next;
            interactiveText.translate(unlinkedWord, false, () => {
              unlinkedWord.isTranslationVisible = true;
              wordUpdated();
              setIsLoading(false);
            });
          });
        }
      },
      (error) => {
        // onError
        console.error(error);
      },
    );
  }

  function deleteTranslation(e, word) {
    interactiveText.api.deleteBookmark(
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
    if (word.token.has_space !== undefined) {
      // from stanza, has_space property
      if (word.token.is_punct || word.token.is_like_symbol)
        allClasses.push("no-hover");
    } else {
      // we are in NLTK
      if (word.token.is_punct) {
        allClasses.push("punct");
        allClasses.push("no-hover");
      }
      if (
        word.token.is_left_punct ||
        (word.token.is_punct &&
          word.prev &&
          [":", ".", ","].includes(word.prev.word.trim()))
      )
        allClasses.push("left-punct");
      if (noMarginPunctuation.includes(word.word.trim()))
        allClasses.push("no-margin");
    }
    if (word.token.is_like_num) allClasses.push("number");
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
        <z-tag onClick={() => redirect(addProtocolToLink(word.word), true)}>
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
          {word.word + (word.token.has_space === true ? " " : "")}
        </z-tag>
      </>
    );
  }

  return (
    <>
      <z-tag className={wordClass}>
        {word.translation && isTranslationVisible && (
          <z-tran
            chosen={word.translation}
            translation0={word.translation}
            ref={refToTranslation}
          >
            <div className="translationContainer">
              <span className="hide low-oppacity translation-icon">
                <VisibilityOffIcon
                  fontSize="8px"
                  onClick={(e) => {
                    setIsTranslationVisible(!isTranslationVisible);
                    setShowingAlterMenu(false);
                  }}
                />
              </span>
              <span
                className="translation"
                onClick={(e) => toggleAlterMenu(e, word)}
              >
                {word.translation}
              </span>
              <span className="arrow" onClick={(e) => toggleAlterMenu(e, word)}>
                {showingAlterMenu ? "▲" : "▼"}
              </span>
              {word.mergedTokens.length > 1 && (
                <span className="unlink low-oppacity translation-icon">
                  <LinkOffIcon
                    fontSize="8px"
                    onClick={(e) => {
                      unlinkLastWord(e, word);
                    }}
                  />
                </span>
              )}
            </div>
          </z-tran>
        )}
        <z-orig>
          {isWordTranslating ? (
            <span className={isLoading ? " loading" : ""}> {prevWord} </span>
          ) : (
            <span
              className={isLoading ? " loading" : ""}
              onClick={(e) => clickOnWord(e, word)}
            >
              {word.word}{" "}
            </span>
          )}
          {showingAlterMenu && (
            <AlterMenu
              word={word}
              setShowingAlternatives={setShowingAlterMenu}
              selectAlternative={selectAlternative}
              hideAlterMenu={hideAlterMenu}
              clickedOutsideTranslation={clickedOutsideTranslation}
              deleteTranslation={deleteTranslation}
            />
          )}
        </z-orig>
      </z-tag>
    </>
  );
}
