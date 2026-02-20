import { useState, createElement, useMemo } from "react";
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
 * - Use provided clozeWordIds to determine slot position
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
  leftEllipsis,
  rightEllipsis,
  // exercise related
  isExerciseOver,
  clozeWordIds = [], // Word IDs to hide and replace with slot (computed by parent)
  nonTranslatableWords, // Phrase that should not be clickable anywhere (prevents cheating)
  // render prop for cloze slot
  renderClozeSlot = null, // (wordId) => ReactElement
}) {
  const [translationCount, setTranslationCount] = useState(0);

  const divType = interactiveText.formatting ? interactiveText.formatting : "div";

  // Compute paragraphs once when interactiveText changes
  const paragraphs = useMemo(() => {
    return interactiveText ? interactiveText.getParagraphs() : [];
  }, [interactiveText]);

  // Find ALL instances of the non-translatable phrase (prevents cheating by clicking other instances)
  const nonTranslatableWordIds = useMemo(() => {
    if (!nonTranslatableWords || !interactiveText || isExerciseOver) return [];

    const targetWords = nonTranslatableWords.split(" ").map(w => removePunctuation(w).toLowerCase());
    const linkedWordLists = interactiveText.paragraphsAsLinkedWordLists;
    if (!linkedWordLists || !linkedWordLists[0]) return [];

    const foundIds = [];
    let word = linkedWordLists[0].linkedWords.head;

    while (word) {
      if (removePunctuation(word.word).toLowerCase() === targetWords[0]) {
        // Check if this starts a match
        let currentWord = word;
        let matchedIds = [];
        let matched = true;

        for (const target of targetWords) {
          if (currentWord && removePunctuation(currentWord.word).toLowerCase() === target) {
            matchedIds.push(currentWord.id);
            currentWord = currentWord.next;
          } else {
            matched = false;
            break;
          }
        }

        if (matched) {
          foundIds.push(...matchedIds);
        }
      }
      word = word.next;
    }

    return foundIds;
  }, [interactiveText, nonTranslatableWords, isExerciseOver]);

  function wordUpdated() {
    setTranslationCount(translationCount + 1);
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
    const isPartOfCloze = clozeWordIds.includes(word.id);

    // During exercise with cloze slot: show slot for first cloze word, hide the rest
    if (isPartOfCloze && !isExerciseOver && renderClozeSlot) {
      const isFirstClozeWord = clozeWordIds[0] === word.id;
      if (isFirstClozeWord) {
        return renderClozeSlot(word.id);
      }
      return ""; // Hide other words in multi-word cloze
    }

    // Highlight cloze words (when no renderClozeSlot, or after exercise)
    if (isPartOfCloze) {
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
