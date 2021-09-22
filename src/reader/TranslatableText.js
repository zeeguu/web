import { useState, useEffect } from "react";
import TranslatableWord from "./TranslatableWord";
import * as s from "./TranslatableText.sc";

export function TranslatableText({
  isCorrect,
  interactiveText,
  translating,
  pronouncing,
  translatedWords,
  setTranslatedWords,
  bookmarkToStudy,
}) {
  const [translationCount, setTranslationCount] = useState(0);
  const [foundInstances, setFoundInstances] = useState([]);

  useEffect(() => {
    if (bookmarkToStudy) {
      findBookmarkInInteractiveText();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function wordUpdated() {
    setTranslationCount(translationCount + 1);
  }

  function findBookmarkInInteractiveText() {
    let bookmarkWords = bookmarkToStudy.split(" ");
    let word = interactiveText.paragraphsAsLinkedWordLists[0].linkedWords.head;
    while (word) {
      if (word.word === bookmarkWords[0]) {
        let copyOfFoundInstances = [...foundInstances];
        for (let index = 0; index < bookmarkWords.length; index++) {
          copyOfFoundInstances.push(word.id);
          word = word.next;
        }
        setFoundInstances(copyOfFoundInstances);
        break;
      } else {
        if (word.next) word = word.next;
        else break;
      }
    }
  }

  function colorWord(word) {
    return `<span class='highlightedWord'>${word} </span>`;
  }

  return (
    <s.TranslatableText>
      {interactiveText.getParagraphs().map((par, index) => (
        <div key={index} className="textParagraph">
          {par.getWords().map((word) =>
            isCorrect ? (
              foundInstances.includes(word.id) ? (
                <span
                  key={word.id}
                  dangerouslySetInnerHTML={{
                    __html: colorWord(word.word),
                  }}
                />
              ) : (
                <TranslatableWord
                  interactiveText={interactiveText}
                  key={word.id}
                  word={word}
                  wordUpdated={wordUpdated}
                  translating={translating}
                  pronouncing={pronouncing}
                  translatedWords={translatedWords}
                  setTranslatedWords={setTranslatedWords}
                />
              )
            ) : !bookmarkToStudy || translatedWords ? (
              <TranslatableWord
                interactiveText={interactiveText}
                key={word.id}
                word={word}
                wordUpdated={wordUpdated}
                translating={translating}
                pronouncing={pronouncing}
                translatedWords={translatedWords}
                setTranslatedWords={setTranslatedWords}
              />
            ) : foundInstances[0] === word.id ? (
              "______ "
            ) : foundInstances.includes(word.id) ? (
              ""
            ) : (
              <TranslatableWord
                interactiveText={interactiveText}
                key={word.id}
                word={word}
                wordUpdated={wordUpdated}
                translating={translating}
                pronouncing={pronouncing}
                translatedWords={translatedWords}
                setTranslatedWords={setTranslatedWords}
              />
            )
          )}
        </div>
      ))}
    </s.TranslatableText>
  );
}
