import { useState } from "react";
import AlterMenu from "./AlterMenu";

export default function TranslatableWord({
  interactiveText,
  word,
  wordUpdated,
  translating,
  pronouncing,
}) {
  const [showingAlternatives, setShowingAlternatives] = useState(false);

  function clickOnWord(word) {
    if (translating) {
      interactiveText.translate(word, () => {
        wordUpdated();
      });
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

  function selectAlternative(alternative) {
    interactiveText.selectAlternative(word, alternative, () => {
      wordUpdated();
      setShowingAlternatives(false);
    });
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

  if (!word.translation) {
    return (
      <>
        <z-tag onClick={(e) => clickOnWord(word)}>{word.word}</z-tag>
        <span> </span>
      </>
    );
  }
  return (
    <>
      <z-tag>
        <z-tran
          chosen={word.translation}
          translation0={word.translation}
          onClick={(e) => toggleAlternatives(e, word)}
        />
        <z-orig>
          <span onClick={(e) => hideTranslation(e, word)}>{word.word} </span>
          {showingAlternatives && (
            <AlterMenu
              word={word}
              setShowingAlternatives={setShowingAlternatives}
              selectAlternative={selectAlternative}
              clickedOutsideAlterMenu={clickedOutsideAlterMenu}
            />
          )}
        </z-orig>
      </z-tag>
      <span>{"  "} </span>
    </>
  );
}
