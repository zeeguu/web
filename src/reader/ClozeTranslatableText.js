import { useState, useEffect, createElement, useRef, useMemo } from "react";
import TranslatableWord from "./TranslatableWord";
import ClozeInputField from "./ClozeInputField";
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
  clozeWord, // Word(s) to hide and replace with input field
  nonTranslatableWords, // Word(s) that should not be clickable for translation
  overrideBookmarkHighlightText,
  updateBookmarks,
  // cloze specific props
  onInputChange,
  onInputSubmit,
  inputValue = "",
  placeholder = "",
  isCorrectAnswer = false,
  shouldFocus = true,
  showHint = true, // Whether to show "tap to type" hint
  canTypeInline = false, // Whether this exercise type allows inline typing
  answerLanguageCode = null, // Language code for the answer
  suppressOSKeyboard = false, // Whether to suppress the OS keyboard
  aboveClozeElement = null, // Element to render above the cloze placeholder
  onInputRef = null, // Callback to expose inputRef to parent
}) {
  const [translationCount, setTranslationCount] = useState(0);
  const [hintVisible, setHintVisible] = useState(true);
  const inputRef = useRef(null);

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

  // Expose inputRef to parent for virtual keyboard
  useEffect(() => {
    if (onInputRef) onInputRef(inputRef);
  }, [onInputRef]);

  // Blur input when virtual keyboard is shown to hide native keyboard
  useEffect(() => {
    if (suppressOSKeyboard && inputRef.current) {
      inputRef.current.blur();
    }
  }, [suppressOSKeyboard]);

  function wordUpdated() {
    setTranslationCount(translationCount + 1);
    if (updateBookmarks) updateBookmarks();
  }

  function handleInputKeyPress(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (onInputSubmit) {
        onInputSubmit(e.target.value, e.target);
      }
    }
  }

  function handleInputChange(e) {
    // Only hide hint when user actually has typed something
    if (e.target.value.length > 0) {
      setHintVisible(false);
    }

    let value = e.target.value;

    // Save cursor position before any modifications
    const cursorPosition = e.target.selectionStart;

    // Match capitalization of the solution
    if (clozeWord && value) {
      const solution = clozeWord;
      if (solution.length > 0) {
        // If solution starts with uppercase, capitalize first letter
        if (solution[0] === solution[0].toUpperCase()) {
          value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        } else {
          // Otherwise make it lowercase
          value = value.toLowerCase();
        }

        // Update the input value to match our formatting
        e.target.value = value;

        // Restore cursor position after setting value
        e.target.setSelectionRange(cursorPosition, cursorPosition);
      }
    }

    if (onInputChange) {
      onInputChange(value, e.target);
    }
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

      // Render the cloze input for the first cloze word
      if (clozeWordIds[0] === word.id) {
        return (
          <ClozeInputField
            key={word.id}
            wordId={word.id}
            inputRef={inputRef}
            inputValue={inputValue}
            clozeWord={clozeWord}
            placeholder={placeholder}
            isExerciseOver={isExerciseOver}
            isCorrectAnswer={isCorrectAnswer}
            canTypeInline={canTypeInline}
            showHint={showHint}
            hintVisible={hintVisible}
            aboveClozeElement={aboveClozeElement}
            onInputChange={handleInputChange}
            onInputKeyPress={handleInputKeyPress}
          />
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
