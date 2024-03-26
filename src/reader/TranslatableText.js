import { useState, useEffect } from "react";
import TranslatableWord from "./TranslatableWord";
import * as s from "./TranslatableText.sc";
import { removePunctuation } from "../utils/preprocessing/preprocessing";
import exerciseTypes from "../exercises/ExerciseTypeConstants";

export function TranslatableText({
  isCorrect,
  interactiveText,
  translating,
  pronouncing,
  translatedWords,
  setTranslatedWords,
  bookmarkToStudy,
  overrideBookmarkHighlightText,
  setIsRendered,
  boldWord,
  exerciseType,
  wordOptions,
}) {
  const [translationCount, setTranslationCount] = useState(0);
  const [foundInstances, setFoundInstances] = useState([]);
  const [paragraphs, setParagraphs] = useState([]);
  const [firstWordID, setFirstWordID] = useState(0);
  const [renderedText, setRenderedText] = useState();

  useEffect(() => {
    if (bookmarkToStudy) {
      findBookmarkInInteractiveText();
    }
    setParagraphs(interactiveText.getParagraphs());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setRenderedText(
      paragraphs.map((par, index) => (
        <div key={index} className="textParagraph">
          {par.getWords().map((word) => renderWordJSX(word))}
        </div>
      )),
    );
  }, [paragraphs, translationCount, isCorrect]);

  useEffect(() => {
    if (setIsRendered) setIsRendered(true);
  }, [renderedText]);

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

  function renderWordJSX(word) {
    // If the word is a bookmarked word, it won't be translated when clicked
    const isBookmarkWord = foundInstances.includes(word.id);
    const boldWords = boldWord ? boldWord.split(" ") : [];
    const isBoldWord = boldWords.includes(removePunctuation(word.word));

    if (isBoldWord) {
      return <span style={{ fontWeight: "bold" }}>{word.word + " "}</span>;
    }

    if (isCorrect) {
      if (word.id === firstWordID && overrideBookmarkHighlightText) {
        // In case we want to override the highlighted bookmark
        // with another string. Used in the OrderWords.
        return (
          <span
            key={word.id}
            dangerouslySetInnerHTML={{
              __html: colorWord(overrideBookmarkHighlightText),
            }}
          />
        );
      }
      if (foundInstances.includes(word.id)) {
        if (overrideBookmarkHighlightText) {
          return <></>;
        }
        return (
          <span
            key={word.id}
            dangerouslySetInnerHTML={{
              __html: colorWord(word.word),
            }}
          />
        );
      } else {
        return (
          <TranslatableWord
            interactiveText={interactiveText}
            key={word.id}
            word={word}
            wordUpdated={wordUpdated}
            translating={translating}
            pronouncing={pronouncing}
            translatedWords={translatedWords}
            setTranslatedWords={setTranslatedWords}
            isBookmarkWord={isBookmarkWord}
          />
        );
      }
    } else {
      if (!bookmarkToStudy || translatedWords) {
        return (
          <TranslatableWord
            interactiveText={interactiveText}
            key={word.id}
            word={word}
            wordUpdated={wordUpdated}
            translating={translating}
            pronouncing={pronouncing}
            translatedWords={translatedWords}
            setTranslatedWords={setTranslatedWords}
            isBookmarkWord={isBookmarkWord}
          />
        );
      }

      // TODO: Consider moving this into exerciseTypes.isTranslation()
      const translationExercise =
        exerciseType === exerciseTypes.translateWhatYouHear &&
        exerciseType === exerciseTypes.multipleChoice;

      if (foundInstances[0] === word.id && !translationExercise) {
        // If we want, we can render it according to words size.
        // "_".repeat(word.word.length) + " ";
        return "_______ ";
      }

      if (isBookmarkWord && !translationExercise) {
        return "";
      }

      return (
        <TranslatableWord
          interactiveText={interactiveText}
          key={word.id}
          word={word}
          wordUpdated={wordUpdated}
          translating={translating}
          pronouncing={pronouncing}
          translatedWords={translatedWords}
          setTranslatedWords={setTranslatedWords}
          isBookmarkWord={isBookmarkWord}
        />
      );
    }
  }

  return <s.TranslatableText>{renderedText}</s.TranslatableText>;
}
