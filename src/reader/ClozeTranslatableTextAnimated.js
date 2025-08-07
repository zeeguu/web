import { useState, useEffect, createElement, useRef } from "react";
import TranslatableWord from "./TranslatableWord";
import * as s from "./TranslatableText.sc";
import { removePunctuation } from "../utils/text/preprocessing";

export function ClozeTranslatableTextAnimated({
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
  const [inputAnimationState, setInputAnimationState] = useState('top'); // 'top', 'animating', 'inline'
  const [targetPosition, setTargetPosition] = useState({ top: 0, left: 0 });
  const inputRef = useRef(null);
  const targetWordRef = useRef(null);
  const containerRef = useRef(null);
  
  // Hide hint after 3 seconds or on first interaction
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);
  
  // iOS focus attempt with animation
  useEffect(() => {
    if (shouldFocus && foundInstances.length > 0) {
      console.log('Starting focus sequence...');
      
      // Start at top position
      setInputAnimationState('top');
      
      // Focus immediately after render
      const focusTimer = setTimeout(() => {
        if (inputRef.current) {
          console.log('Attempting to focus input...');
          inputRef.current.focus();
          console.log('Input focused:', document.activeElement === inputRef.current);
        }
      }, 50);
      
      // Wait a bit, then calculate target position and animate
      const animateTimer = setTimeout(() => {
        if (targetWordRef.current && containerRef.current) {
          const containerRect = containerRef.current.getBoundingClientRect();
          const targetRect = targetWordRef.current.getBoundingClientRect();
          
          setTargetPosition({
            top: targetRect.top - containerRect.top,
            left: targetRect.left - containerRect.left
          });
          
          console.log('Starting animation to position:', {
            top: targetRect.top - containerRect.top,
            left: targetRect.left - containerRect.left
          });
          
          setInputAnimationState('animating');
          
          // After animation completes, switch to inline mode
          setTimeout(() => {
            console.log('Switching to inline mode');
            setInputAnimationState('inline');
          }, 500); // Match animation duration
        }
      }, 600);
      
      return () => {
        clearTimeout(focusTimer);
        clearTimeout(animateTimer);
      };
    }
  }, [shouldFocus, foundInstances]);
  
  // Focus input when it becomes visible at top
  useEffect(() => {
    if (inputAnimationState === 'top' && inputRef.current) {
      const timer = setTimeout(() => {
        if (inputRef.current) {
          console.log('Direct focus attempt in top state...');
          inputRef.current.focus();
          console.log('Focus result:', document.activeElement === inputRef.current);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [inputAnimationState]);
  
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
    inputAnimationState,
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
    setShowHint(false);
    if (onInputChange) {
      onInputChange(e.target.value, e.target);
    }
  }

  function renderWordJSX(word) {
    // If the word is a bookmarked word, it won't be translated when clicked
    const disableTranslation = foundInstances.includes(word.id);

    // If boldExpression is defined, the bookmark is highlighted, otherwise highlightedWords will be set to an empty array to avoid runtime error
    const highlightedWords = boldExpression ? boldExpression.split(" ").map((word) => removePunctuation(word)) : [];
    const isWordHighlighted = highlightedWords.includes(removePunctuation(word.word));

    if (isExerciseOver) {
      if (word.id === firstWordID && overrideBookmarkHighlightText) {
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
            disableTranslation={disableTranslation}
          />
        );
      }
    } else {
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
        // Target word - render placeholder or inline input based on animation state
        if (inputAnimationState === 'inline') {
          const inputWidth = Math.max(inputValue.length * 0.8, 4);
          
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
              {showHint && inputValue === '' && (
                <div
                  style={{
                    position: 'absolute',
                    top: '0.2em',
                    left: '0',
                    fontSize: '0.7em',
                    color: '#999',
                    opacity: 1,
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
                value={inputValue}
                placeholder={placeholder}
                onChange={handleInputChange}
                onKeyPress={handleInputKeyPress}
                onFocus={() => setShowHint(false)}
                style={{
                  border: 'none',
                  borderBottom: `2px ${isCorrectAnswer ? 'solid' : 'dotted'} ${isCorrectAnswer ? '#FF8C00' : '#333'}`,
                  background: 'transparent',
                  outline: 'none',
                  fontSize: 'inherit',
                  fontFamily: 'inherit',
                  textAlign: 'left',
                  width: `${inputWidth}em`,
                  minWidth: '4em',
                  padding: '2px 4px',
                  margin: '0',
                  color: 'inherit',
                  fontWeight: 'normal',
                  cursor: 'text',
                  animation: isCorrectAnswer ? 'correctAnswer 0.6s ease-out forwards' : (inputValue === '' ? 'pulseUnderline 2s ease-in-out infinite' : 'none'),
                }}
                autoComplete="off"
                spellCheck="false"
                inputMode="text"
              />
            </span>
          );
        } else {
          // Show placeholder with ref for positioning
          return (
            <span 
              ref={targetWordRef}
              key={word.id}
              style={{ 
                display: 'inline-block',
                borderBottom: '2px dotted #333',
                minWidth: '4em',
                height: '1.2em',
                marginRight: '0.25em',
                marginLeft: '0.25em',
              }}
            >
              &nbsp;
            </span>
          );
        }
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

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
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
        
        @keyframes slideToPosition {
          from {
            top: 0;
            left: 50%;
            transform: translateX(-50%);
          }
          to {
            top: ${targetPosition.top}px;
            left: ${targetPosition.left}px;
            transform: translateX(0);
          }
        }
      `}</style>
      
      {/* Floating input during animation phases */}
      {(inputAnimationState === 'top' || inputAnimationState === 'animating') && (
        <div
          style={{
            position: 'absolute',
            top: inputAnimationState === 'top' ? 0 : `${targetPosition.top}px`,
            left: inputAnimationState === 'top' ? '50%' : `${targetPosition.left}px`,
            transform: inputAnimationState === 'top' ? 'translateX(-50%)' : 'translateX(0)',
            transition: inputAnimationState === 'animating' ? 'all 0.5s ease-out' : 'none',
            zIndex: 1000,
            backgroundColor: 'white',
            padding: '4px',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          {showHint && inputValue === '' && (
            <div
              style={{
                position: 'absolute',
                top: '-1.5em',
                left: '0',
                fontSize: '0.7em',
                color: '#999',
                opacity: 1,
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
            value={inputValue}
            placeholder={placeholder}
            onChange={handleInputChange}
            onKeyPress={handleInputKeyPress}
            onFocus={() => setShowHint(false)}
            style={{
              border: 'none',
              borderBottom: `2px ${isCorrectAnswer ? 'solid' : 'dotted'} ${isCorrectAnswer ? '#FF8C00' : '#333'}`,
              background: 'transparent',
              outline: 'none',
              fontSize: 'inherit',
              fontFamily: 'inherit',
              textAlign: 'left',
              width: '8em',
              minWidth: '4em',
              padding: '2px 4px',
              margin: '0',
              color: 'inherit',
              fontWeight: 'normal',
              cursor: 'text',
            }}
            autoComplete="off"
            spellCheck="false"
            inputMode="text"
          />
        </div>
      )}
      
      <s.TranslatableText>{renderedText}</s.TranslatableText>
    </div>
  );
}