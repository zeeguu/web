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
  const inputRef = useRef(null);
  
  // Auto-focus the input when it's rendered
  useEffect(() => {
    if (inputRef.current && !isExerciseOver) {
      // Function to focus the input
      const focusInput = () => {
        if (inputRef.current) {
          inputRef.current.focus();
          // On mobile, try multiple approaches to show keyboard
          inputRef.current.click();
          
          // Select all text (if any)
          inputRef.current.select();
        }
      };
      
      // Try with delays for mobile browsers
      setTimeout(focusInput, 100);
      setTimeout(focusInput, 300);
      setTimeout(focusInput, 500);
    }
  }, []); // Run once when component mounts
  
  // Re-focus when shouldFocus changes (for SpellWhatYouHear after audio)
  useEffect(() => {
    if (inputRef.current && !isExerciseOver && shouldFocus && !inputValue) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.click();
        }
      }, 100);
    }
  }, [shouldFocus]);
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
              // Help mobile users by focusing on tap
              if (inputRef.current) {
                inputRef.current.focus();
                inputRef.current.click();
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
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              placeholder={placeholder}
              onChange={handleInputChange}
              onKeyPress={handleInputKeyPress}
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
              autoFocus
              inputMode="text"
            />
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