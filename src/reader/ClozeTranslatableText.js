import { useState, useEffect, createElement, useRef } from "react";
import TranslatableWord from "./TranslatableWord";
import * as s from "./TranslatableText.sc";
import { removePunctuation } from "../utils/text/preprocessing";

export function ClozeTranslatableText({
  interactiveText,
  translating,
  pronouncing,
  translatedWords,
  setTranslatedWords,
  setIsRendered,
  boldExpression,
  leftEllipsis,
  rightEllipsis,
  // exercise related
  isExerciseOver,
  bookmarkToStudy,
  overrideBookmarkHighlightText,
  updateBookmarks,
  // cloze specific props
  onInputChange,
  onInputSubmit,
  inputValue = "",
  placeholder = "",
  isCorrectAnswer = false,
  shouldFocus = true,
}) {
  const [translationCount, setTranslationCount] = useState(0);
  const [foundInstances, setFoundInstances] = useState([]);
  const [paragraphs, setParagraphs] = useState([]);
  const [firstWordID, setFirstWordID] = useState(0);
  const [renderedText, setRenderedText] = useState();
  const [showHint, setShowHint] = useState(true);
  const inputRef = useRef(null);
  
  // Don't auto-hide hint - let it stay until user interacts
  
  // Only hide hint when there's actual user interaction or typing
  // Don't hide just because of autoFocus attempts
  
  const divType = interactiveText.formatting ? interactiveText.formatting : "div";

  useEffect(() => {
    if (bookmarkToStudy) {
      findBookmarkInInteractiveText();
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
    bookmarkToStudy,
    rightEllipsis,
    leftEllipsis,
    inputValue,
    isCorrectAnswer,
    showHint,
  ]);

  useEffect(() => {
    if (setIsRendered) setIsRendered(true);
  }, [setIsRendered]);

  function wordUpdated() {
    setTranslationCount(translationCount + 1);
    if (updateBookmarks) updateBookmarks();
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

  function handleInputKeyPress(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (onInputSubmit) {
        onInputSubmit(e.target.value, e.target);
      }
    }
  }

  function handleInputChange(e) {
    setShowHint(false); // Hide hint on first interaction
    
    let value = e.target.value;
    
    // Match capitalization of the solution
    if (bookmarkToStudy && value) {
      const solution = bookmarkToStudy;
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
    // If the word is a bookmarked word, it won't be translated when clicked
    const disableTranslation = foundInstances.includes(word.id);

    // If boldExpression is defined, the bookmark is highlighted, otherwise highlightedWords will be set to an empty array to avoid runtime error
    const highlightedWords = boldExpression ? boldExpression.split(" ").map((word) => removePunctuation(word)) : [];
    const isWordHighlighted = highlightedWords.includes(removePunctuation(word.word));

    // Don't switch rendering mode when exercise is over if we have an inline input
    // Keep the input visible but disabled
    if (isExerciseOver && !foundInstances.includes(word.id)) {
      // For non-target words, render normally even when exercise is over
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
    
    if (!isExerciseOver || foundInstances[0] === word.id) {
      // During exercise OR for the target word even after exercise
      if (isWordHighlighted) {
        return <span key={word.id} style={{ color: "orange", fontWeight: "bold" }}>{word.word + " "}</span>;
      }
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
            disableTranslation={disableTranslation}
          />
        );
      }

      if (foundInstances[0] === word.id) {
        // Inline input field for cloze exercise
        const inputWidth = Math.max(inputValue.length * 0.8, 4); // Dynamic width based on content
        
        return (
          <span 
            key={word.id}
            style={{ 
              position: 'relative',
              display: 'inline-block',
              marginRight: '0.25em',
              marginLeft: '0.25em',
              cursor: 'text'
            }}
            onClick={() => {
              setShowHint(false);
              if (inputRef.current) {
                inputRef.current.focus();
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
                  color: #FF8C00;
                  font-weight: 600;
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
              {showHint && inputValue === '' && (
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
                value={isExerciseOver && !isCorrectAnswer ? bookmarkToStudy : inputValue}
                placeholder={placeholder}
                onChange={handleInputChange}
                onKeyPress={handleInputKeyPress}
                onFocus={() => setShowHint(false)}
                disabled={isCorrectAnswer || isExerciseOver}
                style={{
                  border: 'none',
                  borderBottom: `2px solid ${isExerciseOver || isCorrectAnswer ? '#FF8C00' : '#333'}`,
                  borderBottomStyle: isExerciseOver || isCorrectAnswer ? 'solid' : 'dotted',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: 'inherit',
                  fontFamily: 'inherit',
                  textAlign: 'left',
                  width: `${Math.max((isExerciseOver && !isCorrectAnswer ? bookmarkToStudy.length : inputValue.length) * 0.8, 4)}em`,
                  minWidth: '4em',
                  padding: '2px 4px',
                  margin: '0',
                  color: isExerciseOver || isCorrectAnswer ? '#FF8C00' : 'inherit',
                  fontWeight: isExerciseOver || isCorrectAnswer ? '600' : 'normal',
                  cursor: isCorrectAnswer || isExerciseOver ? 'default' : 'text',
                  animation: isCorrectAnswer ? 'correctAnswer 0.6s ease-out forwards' : (inputValue === '' ? 'pulseUnderline 2s ease-in-out infinite' : 'none'),
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