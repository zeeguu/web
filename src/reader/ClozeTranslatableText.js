import { useState, useEffect, createElement, useMemo } from "react";
import TranslatableWord from "./TranslatableWord";
import * as s from "./TranslatableText.sc";
import { removePunctuation } from "../utils/text/preprocessing";
import { orange600 } from "../components/colors";

export function ClozeTranslatableText({
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
  clozeWord, // Word(s) to hide and replace with slot
  nonTranslatableWords, // Word(s) that should not be clickable for translation
  updateBookmarks,
  // render prop for cloze slot
  renderClozeSlot = null, // (wordId) => ReactElement
}) {
  const [translationCount, setTranslationCount] = useState(0);

  const divType = interactiveText.formatting ? interactiveText.formatting : "div";

  // Compute paragraphs once when interactiveText changes
  const paragraphs = useMemo(() => {
    return interactiveText ? interactiveText.getParagraphs() : [];
  }, [interactiveText]);

  // Compute cloze word IDs once when interactiveText or clozeWord changes
  const clozeWordIds = useMemo(() => {
    if (!clozeWord || !interactiveText) return [];

    // If we have position-aware InteractiveExerciseText, use it to find the correct instance
    if (interactiveText.findSolutionPositionsInContext) {
      const targetWords = clozeWord.split(" ").map(w => w.toLowerCase());
      const solutionPositions = interactiveText.findSolutionPositionsInContext(targetWords);

      if (solutionPositions.length > 0) {
        let word = interactiveText.paragraphsAsLinkedWordLists[0].linkedWords.head;
        let foundIds = [];
        while (word) {
          for (const pos of solutionPositions) {
            const contextOffset = interactiveText.expectedPosition?.contextOffset || 0;
            const adjustedSentIndex = word.token.sent_i - contextOffset;
            if (adjustedSentIndex === pos.sentenceIndex && word.token.token_i === pos.tokenIndex) {
              foundIds.push(word.id);
            }
          }
          word = word.next;
        }
        if (foundIds.length > 0) {
          return foundIds;
        }
      }
    }

    // Fallback to word-based search
    let targetWords = clozeWord.split(" ");
    let word = interactiveText.paragraphsAsLinkedWordLists[0].linkedWords.head;

    while (word) {
      if (removePunctuation(word.word).toLowerCase() === targetWords[0].toLowerCase()) {
        let copyOfFoundIds = [];
        let currentWord = word;
        let matched = true;

        for (let index = 0; index < targetWords.length; index++) {
          if (currentWord && removePunctuation(currentWord.word).toLowerCase() === targetWords[index].toLowerCase()) {
            copyOfFoundIds.push(currentWord.id);
            currentWord = currentWord.next;
          } else {
            matched = false;
            break;
          }
        }

        if (matched && copyOfFoundIds.length === targetWords.length) {
          return copyOfFoundIds;
        }
      }
      word = word.next;
    }

    return [];
  }, [interactiveText, clozeWord]);

  // Compute non-translatable word IDs
  const nonTranslatableWordIds = useMemo(() => {
    if (!nonTranslatableWords || !interactiveText) return [];

    let targetWords = nonTranslatableWords.split(" ");
    let word = interactiveText.paragraphsAsLinkedWordLists[0].linkedWords.head;
    let foundIds = [];

    while (word) {
      if (removePunctuation(word.word).toLowerCase() === targetWords[0].toLowerCase()) {
        let tempIds = [];
        let currentWord = word;
        let matched = true;

        for (let index = 0; index < targetWords.length; index++) {
          if (currentWord && removePunctuation(currentWord.word).toLowerCase() === targetWords[index].toLowerCase()) {
            tempIds.push(currentWord.id);
            currentWord = currentWord.next;
          } else {
            matched = false;
            break;
          }
        }

        if (matched && tempIds.length === targetWords.length) {
          foundIds = tempIds;
          break;
        }
      }
      word = word.next;
    }

    return foundIds;
  }, [interactiveText, nonTranslatableWords]);

  useEffect(() => {
    if (setIsRendered) setIsRendered(true);
  }, [setIsRendered]);

  function wordUpdated() {
    setTranslationCount(translationCount + 1);
    if (updateBookmarks) updateBookmarks();
  }

  // Render a single word - this is now a pure function of its inputs
  function renderWordJSX(word) {
    const disableTranslation = nonTranslatableWordIds.includes(word.id);
    const isClozeWord = clozeWordIds.includes(word.id);

    // Check if this word should be highlighted
    let isWordHighlighted = false;
    if (!isClozeWord) {
      if (interactiveText.shouldHighlightWord) {
        isWordHighlighted = interactiveText.shouldHighlightWord(word);
      } else if (highlightExpression) {
        const highlightedWords = highlightExpression.split(" ").map((word) => removePunctuation(word));
        isWordHighlighted = highlightedWords.includes(removePunctuation(word.word));
      }
    }

    // Handle exercise over state for non-cloze words
    if (isExerciseOver && !isClozeWord) {
      if (isWordHighlighted) {
        return <span key={word.id} style={{ color: orange600, fontWeight: "bold" }}>{word.word + " "}</span>;
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

    if (!isExerciseOver || clozeWordIds[0] === word.id) {
      if (isWordHighlighted) {
        return <span key={word.id} style={{ color: orange600, fontWeight: "bold" }}>{word.word + " "}</span>;
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

      // Render the cloze slot for the first cloze word
      if (clozeWordIds[0] === word.id && renderClozeSlot) {
        return renderClozeSlot(word.id);
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

  // Render paragraphs directly - no state storage
  const renderedText = paragraphs.map((par, index) =>
    createElement(
      divType,
      { className: "textParagraph", key: index },
      <>
        {index === 0 && leftEllipsis && <>...</>}
        {par.getWords().map((word) => renderWordJSX(word))}
        {index === 0 && rightEllipsis && <>...</>}
      </>,
    ),
  );

  return <s.TranslatableText>{renderedText}</s.TranslatableText>;
}
