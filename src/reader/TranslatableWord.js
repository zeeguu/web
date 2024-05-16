import { useState } from "react";
import AlterMenu from "./AlterMenu";
import { useClickOutside } from "react-click-outside-hook";

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
  const [showingAlternatives, setShowingAlternatives] = useState(false);
  const [refToZtran, hasClickedOutside] = useClickOutside();
  const [hasBeenClicked, setHasBeenClicked] = useState();
  console.log(word);

  function clickOnWord(e, word) {
    setHasBeenClicked(true);
    if (word.translation) {
      interactiveText.pronounce(word);
      return;
    }
    if (translating) {
      interactiveText.translate(word, () => {
        wordUpdated();
        e.target.className = null;
      });
      if (translatedWords) {
        let copyOfWords = [...translatedWords];
        copyOfWords.push(word.word);
        setTranslatedWords(copyOfWords);
      }
    }
    if (pronouncing) {
      interactiveText.pronounce(word);
    }
  }

  function toggleAlternatives(e, word) {
    if (showingAlternatives) {
      setShowingAlternatives(false);
      return;
    }
    interactiveText.alternativeTranslations(word, () => {
      wordUpdated(word);
      setShowingAlternatives(!showingAlternatives);
    });
  }

  function selectAlternative(alternative, preferredSource) {
    interactiveText.selectAlternative(
      word,
      alternative,
      preferredSource,
      () => {
        wordUpdated();
        setShowingAlternatives(false);
      },
    );
  }

  function clickedOutsideAlterMenu() {
    setShowingAlternatives(false);
  }

  function hideTranslation(e, word) {
    console.log(word);
    word.translation = undefined;
    word.splitIntoComponents();
    wordUpdated();
  }

  //disableTranslation so user cannot translate words that are being tested
  if (!word.translation || disableTranslation) {
    return (
      <>
        <z-tag onClick={(e) => clickOnWord(e, word)}>{word.word + " "}</z-tag>
      </>
    );
  }

  return (
    <>
      <z-tag>
        <z-tran
          ref={refToZtran}
          chosen={word.translation}
          translation0={word.translation}
          onClick={(e) => toggleAlternatives(e, word)}
        >
          <span className="arrow">▼</span>
        </z-tran>
        <z-orig>
          <span onClick={(e) => hideTranslation(e, word)}>{word.word} </span>
          {showingAlternatives && (
            <AlterMenu
              word={word}
              isClickOutsideWordSpan={hasClickedOutside}
              setShowingAlternatives={setShowingAlternatives}
              selectAlternative={selectAlternative}
              clickedOutsideAlterMenu={clickedOutsideAlterMenu}
            />
          )}
        </z-orig>
      </z-tag>
    </>
  );
}
