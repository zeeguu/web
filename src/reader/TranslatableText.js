import { useState, useEffect } from "react";
import TranslatableWord from "./TranslatableWord";
import * as s from "./TranslatableText.sc";
import { removePunctuation } from "../utils/preprocessing/preprocessing";

export function TranslatableText({
  isCorrect,
  interactiveText,
  translating,
  pronouncing,
  translatedWords,
  setTranslatedWords,
  bookmarkToStudy,
  overrideBookmarkHighlightText,
}) {
  const [translationCount, setTranslationCount] = useState(0);
  const [foundInstances, setFoundInstances] = useState([]);
  const [firstWordID, setFirstWordID] = useState(0);

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
      if (removePunctuation(word.word) === bookmarkWords[0]) {
        let copyOfFoundInstances = [...foundInstances];
        for (let index = 0; index < bookmarkWords.length; index++) {
          if (removePunctuation(word.word) === bookmarkWords[index]) {
            if (index === 0) setFirstWordID(word.id);
            copyOfFoundInstances.push(word.id);
            word = word.next;
          } else {
            copyOfFoundInstances = [...foundInstances];
            word = word.next;
            break;
          }
        }
        setFoundInstances(copyOfFoundInstances);
        if (copyOfFoundInstances.length === bookmarkWords.length) break;
      } else {
        word = word.next;
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
                overrideBookmarkHighlightText ? (
                    word.id === firstWordID ? (
                        <span
                          key={word.id}
                          dangerouslySetInnerHTML={{
                            __html: colorWord(overrideBookmarkHighlightText),
                          }}
                        />
                      ) : (
                        <></>
                      )
                ) : 
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
