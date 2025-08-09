import { useState, useEffect, createElement } from "react";
import TranslatableWord from "./TranslatableWord";
import * as s from "./TranslatableText.sc";
import { removePunctuation } from "../utils/text/preprocessing";
import { orange500 } from "../components/colors";

export function TranslatableText({
  interactiveText,
  translating,
  pronouncing,
  translatedWords,
  setTranslatedWords,
  setIsRendered,
  highlightExpression,
  leftEllipsis,
  rightEllipsis,
  // exercise related
  isExerciseOver,
  clozeWord, // Word(s) to hide and replace with underlines/placeholders in cloze exercises
  nonTranslatableWords, // Word(s) that should not be clickable for translation
  overrideBookmarkHighlightText, // boldAndDeactivatedText -- used in OrderWords
  updateBookmarks, // callback - should be probably named: notifyWordTranslated --- actually only used once in ArticleReader, in quite a bad way. consider alterantoves
}) {
  const [translationCount, setTranslationCount] = useState(0);
  const [nonTranslatableWordIds, setNonTranslatableWordIds] = useState([]);
  const [clozeWordIds, setClozeWordIds] = useState([]);
  const [paragraphs, setParagraphs] = useState([]);
  const [firstClozeWordId, setFirstClozeWordId] = useState(0);
  const [renderedText, setRenderedText] = useState();
  const divType = interactiveText.formatting ? interactiveText.formatting : "div";

  useEffect(() => {
    if (nonTranslatableWords) {
      findNonTranslatableWords();
    }
    if (clozeWord) {
      findClozeWords();
    }
    if (interactiveText) setParagraphs(interactiveText.getParagraphs());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactiveText]);

  useEffect(() => {
    setRenderedText(
      paragraphs.map((par, index) =>
        createElement(
          divType,
          { className: "textParagraph", key: index },
          <>
            {index === 0 && leftEllipsis && <>...</>}
            {par.getWords().map((word) => renderWordJSX(word))}
            {index === 0 && rightEllipsis && <>...</>}
          </>,
        ),
      ),
    );
    //eslint-disable-next-line
  }, [
    paragraphs,
    translationCount,
    translating,
    pronouncing,
    isExerciseOver,
    clozeWord,
    nonTranslatableWords,
    rightEllipsis,
    leftEllipsis,
  ]);

  useEffect(() => {
    if (setIsRendered) setIsRendered(true);
  }, [setIsRendered]);

  function wordUpdated() {
    setTranslationCount(translationCount + 1);
    if (updateBookmarks) updateBookmarks();
  }

  function findNonTranslatableWords() {
    if (!nonTranslatableWords) return;
    let targetWords = nonTranslatableWords.split(" ");
    let word = interactiveText.paragraphsAsLinkedWordLists[0].linkedWords.head;
    while (word) {
      if (removePunctuation(word.word).toLowerCase() === targetWords[0].toLowerCase()) {
        let copyOfFoundIds = [...nonTranslatableWordIds];
        for (let index = 0; index < targetWords.length; index++) {
          if (removePunctuation(word.word).toLowerCase() === targetWords[index].toLowerCase()) {
            copyOfFoundIds.push(word.id);
            word = word.next;
          } else {
            copyOfFoundIds = [...nonTranslatableWordIds];
            word = word.next;
            break;
          }
        }
        setNonTranslatableWordIds(copyOfFoundIds);
        if (copyOfFoundIds.length === targetWords.length) break;
      } else {
        word = word.next;
      }
    }
  }

  function findClozeWords() {
    if (!clozeWord) return;
    let targetWords = clozeWord.split(" ");
    let word = interactiveText.paragraphsAsLinkedWordLists[0].linkedWords.head;
    while (word) {
      if (removePunctuation(word.word).toLowerCase() === targetWords[0].toLowerCase()) {
        let copyOfFoundIds = [...clozeWordIds];
        for (let index = 0; index < targetWords.length; index++) {
          if (removePunctuation(word.word).toLowerCase() === targetWords[index].toLowerCase()) {
            if (index === 0) setFirstClozeWordId(word.id);
            copyOfFoundIds.push(word.id);
            word = word.next;
          } else {
            copyOfFoundIds = [...clozeWordIds];
            word = word.next;
            break;
          }
        }
        setClozeWordIds(copyOfFoundIds);
        if (copyOfFoundIds.length === targetWords.length) break;
      } else {
        word = word.next;
      }
    }
  }

  function colorWord(word) {
    return `<span class='highlightedWord'>${word} </span>`;
  }

  function renderWordJSX(word) {
    // If the word is a non-translatable word, it won't be translated when clicked
    const disableTranslation = nonTranslatableWordIds.includes(word.id);
    
    // Check if this word is part of the cloze (hidden) text
    const isClozeWord = clozeWordIds.includes(word.id);

    // If highlightExpression is defined, the bookmark is highlighted, otherwise highlightedWords will be set to an empty array to avoid runtime error
    const highlightedWords = highlightExpression ? highlightExpression.split(" ").map((word) => removePunctuation(word).toLowerCase()) : [];
    const isWordHighlighted = highlightedWords.includes(removePunctuation(word.word).toLowerCase());

    // Debug highlighting logic for case mismatch issues
    if (highlightExpression) {
      console.log('TranslatableText highlighting debug for word:', word.word, {
        'word.id': word.id,
        'word.word': word.word,
        'word.word (removePunctuation)': removePunctuation(word.word),
        'word.word (removePunctuation + toLowerCase)': removePunctuation(word.word).toLowerCase(),
        'highlightExpression': highlightExpression,
        'highlightExpression.split(" ")': highlightExpression.split(" "),
        'highlightedWords (processed)': highlightedWords,
        'isWordHighlighted': isWordHighlighted,
        'isExerciseOver': isExerciseOver,
        'isClozeWord': isClozeWord
      });
    }

    if (isExerciseOver) {
      if (word.id === firstClozeWordId && overrideBookmarkHighlightText) {
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
      if (isClozeWord) {
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
      } else if (isWordHighlighted) {
        // Highlight words based on highlightExpression when showing solution
        return <span key={word.id} style={{ color: orange500, fontWeight: "bold" }}>{word.word + " "}</span>;
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
            disableTranslation={disableTranslation}
          />
        );
      }
    } else {
      if (isWordHighlighted) {
        return <span key={word.id} style={{ color: orange500, fontWeight: "bold" }}>{word.word + " "}</span>;
      }
      if (!clozeWord || translatedWords) {
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
            disableTranslation={disableTranslation}
          />
        );
      }

      if (clozeWordIds[0] === word.id) {
        // Fixed-length underline with smooth transition animation
        const fixedUnderlineLength = '4em'; // Fixed length to prevent solution hints
        
        return (
          <span 
            key={word.id}
            style={{ 
              position: 'relative',
              display: 'inline-block',
              minWidth: fixedUnderlineLength,
              textAlign: 'center',
              marginRight: '0.5em'
            }}
          >
            {/* Underline placeholder - visible during exercise */}
            <span 
              style={{
                position: 'absolute',
                opacity: isExerciseOver ? 0 : 1,
                transition: 'opacity 0.6s ease-in-out',
                borderBottom: '2px dotted #333',
                width: fixedUnderlineLength,
                display: 'inline-block',
                height: '1.2em',
                left: '50%',
                transform: 'translateX(-50%)',
                top: 0
              }}
            />
            
            {/* Actual word - revealed when exercise is over */}
            <span 
              style={{
                opacity: isExerciseOver ? 1 : 0,
                transition: 'opacity 0.6s ease-in-out',
                color: orange500,
                fontWeight: 'bold',
                display: 'inline-block'
              }}
            >
              {word.word}
            </span>
          </span>
        );
      }

      if (disableTranslation) {
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
          disableTranslation={disableTranslation}
        />
      );
    }
  }

  return <s.TranslatableText>{renderedText}</s.TranslatableText>;
}
