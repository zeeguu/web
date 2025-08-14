import { useState, useEffect, createElement, useRef } from "react";
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
}) {
  const [translationCount, setTranslationCount] = useState(0);
  const [clozeWordIds, setClozeWordIds] = useState([]);
  const [nonTranslatableWordIds, setNonTranslatableWordIds] = useState([]);
  const [paragraphs, setParagraphs] = useState([]);
  const [firstClozeWordId, setFirstClozeWordId] = useState(0);
  const [renderedText, setRenderedText] = useState();
  const [hintVisible, setHintVisible] = useState(true);
  const inputRef = useRef(null);
  
  const divType = interactiveText.formatting ? interactiveText.formatting : "div";

  useEffect(() => {
    if (clozeWord) {
      findClozeWords();
    }
    if (nonTranslatableWords) {
      findNonTranslatableWords();
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
    inputValue,
    isCorrectAnswer,
    hintVisible,
  ]);

  useEffect(() => {
    if (setIsRendered) setIsRendered(true);
  }, [setIsRendered]);

  function wordUpdated() {
    setTranslationCount(translationCount + 1);
    if (updateBookmarks) updateBookmarks();
  }

  function findClozeWords() {
    if (!clozeWord) return;
    console.log("Finding cloze words for:", clozeWord);
    
    // If we have position-aware InteractiveExerciseText, use it to find the correct instance
    if (interactiveText.findSolutionPositionsInContext) {
      const targetWords = clozeWord.split(" ").map(w => w.toLowerCase());
      const solutionPositions = interactiveText.findSolutionPositionsInContext(targetWords);
      console.log("Found solution positions:", solutionPositions);
      
      if (solutionPositions.length > 0) {
        // Find the word IDs at those positions
        let word = interactiveText.paragraphsAsLinkedWordLists[0].linkedWords.head;
        let foundIds = [];
        while (word) {
          for (const pos of solutionPositions) {
            const contextOffset = interactiveText.expectedPosition?.contextOffset || 0;
            const adjustedSentIndex = word.token.sent_i - contextOffset;
            if (adjustedSentIndex === pos.sentenceIndex && word.token.token_i === pos.tokenIndex) {
              foundIds.push(word.id);
              if (foundIds.length === 1) setFirstClozeWordId(word.id);
            }
          }
          word = word.next;
        }
        if (foundIds.length > 0) {
          console.log("Setting cloze word IDs from positions:", foundIds);
          setClozeWordIds(foundIds);
          return;
        }
      }
    }
    
    // Fallback to word-based search
    console.log("Falling back to word-based cloze search");
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

  function colorWord(word) {
    return `<span class='highlightedWord'>${word} </span>`;
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
      }
    }
    
    if (onInputChange) {
      onInputChange(value, e.target);
    }
  }


  function renderWordJSX(word) {
    // If the word is a non-translatable word, it won't be translated when clicked
    const disableTranslation = nonTranslatableWordIds.includes(word.id);
    
    // Check if this word is part of the cloze (hidden) text
    const isClozeWord = clozeWordIds.includes(word.id);

    // Check if this word should be highlighted
    // IMPORTANT: Don't highlight if this is a cloze word (it should show as blank instead)
    let isWordHighlighted = false;
    if (!isClozeWord) {
      // Only check highlighting if this is NOT a cloze word
      if (interactiveText.shouldHighlightWord) {
        // Use position-aware highlighting for exercises (both during and after)
        isWordHighlighted = interactiveText.shouldHighlightWord(word);
        if (word.word.toLowerCase() === "det") {
          console.log(`ClozeTranslatableText: Checking highlight for "det" using position-aware logic - result: ${isWordHighlighted}`);
          console.log(`  isExerciseOver: ${isExerciseOver}`);
        }
      } else if (highlightExpression) {
        // Fallback to word-based highlighting for non-exercises
        const highlightedWords = highlightExpression.split(" ").map((word) => removePunctuation(word));
        isWordHighlighted = highlightedWords.includes(removePunctuation(word.word));
        if (word.word.toLowerCase() === "det") {
          console.log(`ClozeTranslatableText: Using fallback highlighting for "det" - result: ${isWordHighlighted}`);
          console.log(`  highlightExpression: "${highlightExpression}"`);
          console.log(`  highlightedWords:`, highlightedWords);
        }
      }
    }

    // Don't switch rendering mode when exercise is over if we have an inline input
    // Keep the input visible but disabled
    if (isExerciseOver && !isClozeWord) {
      // Check if this word should be highlighted when showing the solution
      if (isWordHighlighted) {
        return <span key={word.id} style={{ color: orange600, fontWeight: "bold" }}>{word.word + " "}</span>;
      }
      // For non-highlighted words, render normally even when exercise is over
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
      // During exercise OR for the target word even after exercise
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

      if (clozeWordIds[0] === word.id) {
        // Inline input field for cloze exercise
        const currentValue = isExerciseOver && !isCorrectAnswer ? clozeWord : inputValue;
        
        // Function to measure actual text width
        const measureTextWidth = (text) => {
          if (!text) return 4; // Default for empty text
          
          // Create a temporary span to measure text
          const span = document.createElement('span');
          span.style.visibility = 'hidden';
          span.style.position = 'absolute';
          span.style.whiteSpace = 'nowrap';
          span.style.fontSize = 'inherit';
          span.style.fontFamily = 'inherit';
          span.style.fontWeight = (isCorrectAnswer || isExerciseOver) ? '700' : 'normal';
          span.textContent = text;
          
          document.body.appendChild(span);
          const width = span.getBoundingClientRect().width;
          document.body.removeChild(span);
          
          // Convert to em units (approximately) and add some padding
          return (width / 16) + 0.5; // Assuming 1em ≈ 16px, plus padding
        };
        
        const inputWidth = (isCorrectAnswer || isExerciseOver) ? 
          measureTextWidth(currentValue) : // Exact fit when finalized
          Math.max(currentValue.length * 0.8, 4); // Generous width during typing
        
        console.log('Debug:', { currentValue, inputWidth, isCorrectAnswer, isExerciseOver });
        
        return (
          <span 
            key={word.id}
            style={{ 
              position: 'relative',
              display: 'inline-block',
              marginRight: '0.25em',
              marginLeft: '0.25em',
              cursor: (isCorrectAnswer || isExerciseOver) ? 'default' : 'text'
            }}
            onClick={() => {
              if (!isCorrectAnswer && !isExerciseOver) {
                // Don't hide hint immediately on click - let user see it until they type
                if (inputRef.current) {
                  inputRef.current.focus();
                }
              }
            }}
          >
            <style>{`
              @keyframes correctAnswer {
                0% { 
                  color: inherit;
                  font-weight: normal;
                }
                100% { 
                  color: ${orange600} !important;
                  font-weight: 700;
                }
              }
              
              @keyframes pulseUnderline {
                0%, 100% { 
                  border-bottom-color: #333;
                }
                50% { 
                  border-bottom-color: #666;
                }
              }
            `}</style>
            <>
              {showHint && hintVisible && inputValue === '' && !isExerciseOver && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '0.7em',
                    color: '#999',
                    opacity: 0.8,
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap'
                  }}
                >
                  tap to type
                </div>
              )}
              <input
                ref={inputRef}
                type="text"
                value={isExerciseOver && !isCorrectAnswer ? clozeWord : inputValue}
                placeholder={placeholder}
                onChange={handleInputChange}
                onKeyPress={handleInputKeyPress}
                onFocus={() => {
                  // Don't hide hint immediately on focus - let user see it until they type
                  // The hint will be hidden when they actually start typing in handleInputChange
                }}
                disabled={isCorrectAnswer || isExerciseOver}
                style={{
                  border: 'none',
                  borderBottom: `${canTypeInline ? '2px dotted' : '1px solid'} ${isExerciseOver || isCorrectAnswer ? orange600 : '#333'}`,
                  background: 'transparent',
                  outline: 'none',
                  fontSize: 'inherit',
                  fontFamily: 'inherit',
                  textAlign: (isCorrectAnswer || isExerciseOver) ? 'center' : 'left',
                  width: `${inputWidth}em`,
                  maxWidth: `${inputWidth}em`,
                  minWidth: (isCorrectAnswer || isExerciseOver) ? '2em' : '4em',
                  padding: '2px 4px',
                  margin: '0',
                  color: isExerciseOver || isCorrectAnswer ? orange600 : 'inherit',
                  fontWeight: isExerciseOver || isCorrectAnswer ? '700' : 'normal',
                  cursor: isCorrectAnswer || isExerciseOver ? 'default' : 'text',
                  animation: isCorrectAnswer ? 'correctAnswer 0.6s ease-out forwards' : (inputValue === '' ? 'pulseUnderline 2s ease-in-out infinite' : 'none'),
                  opacity: isCorrectAnswer || isExerciseOver ? '1 !important' : '1',
                }}
                autoComplete="off"
                spellCheck="false"
                inputMode="text"
              />
            </>
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