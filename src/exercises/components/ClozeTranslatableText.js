import { useState, useEffect, createElement, useMemo } from "react";
import TranslatableWord from "../../reader/TranslatableWord";
import * as s from "../../reader/TranslatableText.sc";
import { removePunctuation } from "../../utils/text/preprocessing";
import { orange600 } from "../../components/colors";

/**
 * Renders translatable text with a "slot" for cloze exercises.
 *
 * This component is intentionally decoupled from input handling.
 * It only knows how to:
 * - Render translatable words
 * - Find where the cloze word is
 * - Call renderClozeSlot(wordId) at that position
 *
 * The parent provides the actual cloze input via the render prop,
 * keeping all input-specific logic (hints, keyboards, etc.) separate.
 */
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

  function isHighlighted(word) {
    if (interactiveText.shouldHighlightWord) {
      return interactiveText.shouldHighlightWord(word);
    }
    if (highlightExpression) {
      const highlightedWords = highlightExpression.split(" ").map((w) => removePunctuation(w));
      return highlightedWords.includes(removePunctuation(word.word));
    }
    return false;
  }

  function renderHighlightedWord(word) {
    return <span key={word.id} style={{ color: orange600, fontWeight: "bold" }}>{word.word + " "}</span>;
  }

  function renderTranslatableWord(word) {
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
        disableTranslation={nonTranslatableWordIds.includes(word.id)}
      />
    );
  }

  function renderWordJSX(word) {
    const isFirstClozeWord = clozeWordIds[0] === word.id;
    const isPartOfCloze = clozeWordIds.includes(word.id);

    // Cloze slot: render input for first word, hide the rest
    if (isPartOfCloze && !isExerciseOver) {
      if (isFirstClozeWord && renderClozeSlot) {
        return renderClozeSlot(word.id);
      }
      return ""; // Hide other words in multi-word cloze
    }

    // Highlighted words get special styling
    if (isHighlighted(word)) {
      return renderHighlightedWord(word);
    }

    // Everything else is a translatable word
    return renderTranslatableWord(word);
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
