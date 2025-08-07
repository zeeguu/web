import React, { useState, useEffect, useRef } from 'react';
import { ClozeTranslatableText } from '../reader/ClozeTranslatableText.js';
import BottomInput from '../exercises/exerciseTypes/BottomInput.js';
import InteractiveText from '../reader/InteractiveText.js';

export default function IOSFocusTestMoving() {
  const [inputValue, setInputValue] = useState("");
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [shouldFocus, setShouldFocus] = useState(true);
  const [interactiveText, setInteractiveText] = useState(null);
  const [useMovingInput, setUseMovingInput] = useState(true);
  const [bottomInputRef, setBottomInputRef] = useState(null);
  const targetPlaceholderRef = useRef(null);
  const movingContainerRef = useRef(null);
  
  // Mock exercise data for testing
  const mockBookmark = {
    from: "house",
    to: "casa",
    from_lang: "en",
    to_lang: "es",
    context_tokenized: [
      { 
        word: "The", 
        id: 1, 
        token: { has_space: true, is_punct: false, is_like_symbol: false },
        next: null
      },
      { 
        word: "big", 
        id: 2, 
        token: { has_space: true, is_punct: false, is_like_symbol: false },
        next: null
      },
      { 
        word: "house", 
        id: 3, 
        token: { has_space: true, is_punct: false, is_like_symbol: false },
        next: null
      }, // This will be the word to fill in
      { 
        word: "is", 
        id: 4, 
        token: { has_space: true, is_punct: false, is_like_symbol: false },
        next: null
      },
      { 
        word: "beautiful", 
        id: 5, 
        token: { has_space: false, is_punct: false, is_like_symbol: false },
        next: null
      }
    ]
  };

  useEffect(() => {
    // Create mock InteractiveText
    const mockInteractive = {
      getParagraphs: () => [{
        getWords: () => mockBookmark.context_tokenized
      }],
      paragraphsAsLinkedWordLists: [{
        linkedWords: {
          head: mockBookmark.context_tokenized[0]
        }
      }]
    };
    setInteractiveText(mockInteractive);
  }, []);

  // Move the BottomInput to the target location when we have both refs
  useEffect(() => {
    if (useMovingInput && bottomInputRef && targetPlaceholderRef.current && movingContainerRef.current) {
      console.log('Moving input to target location...');
      
      // Get position of target placeholder
      const targetRect = targetPlaceholderRef.current.getBoundingClientRect();
      const containerRect = movingContainerRef.current.getBoundingClientRect();
      
      // Calculate relative position
      const relativeTop = targetRect.top - containerRect.top;
      const relativeLeft = targetRect.left - containerRect.left;
      
      // Style the input to be positioned absolutely at the target location
      bottomInputRef.style.position = 'absolute';
      bottomInputRef.style.top = `${relativeTop}px`;
      bottomInputRef.style.left = `${relativeLeft}px`;
      bottomInputRef.style.width = 'auto';
      bottomInputRef.style.maxWidth = 'none';
      bottomInputRef.style.minWidth = '8em';
      bottomInputRef.style.zIndex = '1000';
      bottomInputRef.style.backgroundColor = 'white';
      bottomInputRef.style.border = 'none';
      bottomInputRef.style.borderBottom = '2px dotted #333';
      bottomInputRef.style.borderRadius = '0';
      bottomInputRef.style.padding = '2px 4px';
      bottomInputRef.style.fontSize = 'inherit';
      
      // Hide the target placeholder
      targetPlaceholderRef.current.style.opacity = '0';
      
      console.log('Input moved to position:', { top: relativeTop, left: relativeLeft });
    }
  }, [useMovingInput, bottomInputRef, targetPlaceholderRef.current]);

  function handleInputChange(value) {
    setInputValue(value);
    const isCorrect = value.toLowerCase().trim() === mockBookmark.from.toLowerCase();
    setIsCorrectAnswer(isCorrect);
  }

  function handleCorrectAnswer() {
    console.log('Correct answer!');
    setIsCorrectAnswer(true);
  }

  function handleIncorrectAnswer() {
    console.log('Incorrect answer!');
  }

  function handleInputRef(inputElement) {
    console.log('Received input ref:', inputElement);
    setBottomInputRef(inputElement);
  }

  if (!interactiveText) {
    return <div>Loading...</div>;
  }

  // Custom render function that adds a placeholder where we want the input
  const renderTextWithPlaceholder = () => {
    return (
      <div style={{ fontSize: '1.2rem', lineHeight: '1.6' }}>
        <span>The big </span>
        <span 
          ref={targetPlaceholderRef}
          style={{ 
            display: 'inline-block',
            borderBottom: '2px dotted #333',
            minWidth: '6em',
            height: '1.2em',
            marginRight: '0.25em',
            marginLeft: '0.25em',
            position: 'relative'
          }}
        >
          {/* This is where we want the input to appear */}
          &nbsp;
        </span>
        <span> is beautiful</span>
      </div>
    );
  };

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '600px', 
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1>iOS Focus Test - Moving BottomInput</h1>
      <p>Testing moving a working BottomInput to inline position</p>
      
      <div 
        ref={movingContainerRef}
        style={{ 
          border: '1px solid #ccc', 
          borderRadius: '8px', 
          padding: '2rem',
          backgroundColor: '#f9f9f9',
          marginTop: '2rem',
          position: 'relative',
          minHeight: '8rem'
        }}
      >
        <h3>Test Sentence: {useMovingInput ? '(Moving BottomInput)' : '(Regular ClozeText)'}</h3>
        
        {useMovingInput ? renderTextWithPlaceholder() : (
          <div style={{ fontSize: '1.2rem', lineHeight: '1.6', minHeight: '4rem' }}>
            <ClozeTranslatableText
              interactiveText={interactiveText}
              translating={false}
              pronouncing={false}
              translatedWords={null}
              setTranslatedWords={() => {}}
              isExerciseOver={false}
              bookmarkToStudy={mockBookmark.from}
              onInputChange={handleInputChange}
              onInputSubmit={() => {}}
              inputValue={inputValue}
              placeholder=""
              isCorrectAnswer={isCorrectAnswer}
              shouldFocus={shouldFocus}
            />
          </div>
        )}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <button 
          onClick={() => {
            setUseMovingInput(!useMovingInput);
            setInputValue(""); // Clear input when switching
          }}
          style={{ 
            padding: '0.5rem 1rem', 
            marginRight: '1rem',
            backgroundColor: useMovingInput ? '#dc3545' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          {useMovingInput ? 'Switch to Regular' : 'Switch to Moving Input'}
        </button>
        
        <button 
          onClick={() => setShouldFocus(!shouldFocus)}
          style={{ 
            padding: '0.5rem 1rem', 
            marginRight: '1rem',
            backgroundColor: shouldFocus ? '#007bff' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          {shouldFocus ? 'Auto-Focus Enabled' : 'Auto-Focus Disabled'}
        </button>
        
        <button 
          onClick={() => setInputValue("")}
          style={{ 
            padding: '0.5rem 1rem',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Reset Test
        </button>
      </div>

      {/* BottomInput - positioned absolutely when moving */}
      {useMovingInput && (
        <div style={{ marginTop: '2rem' }}>
          <BottomInput
            handleCorrectAnswer={handleCorrectAnswer}
            handleIncorrectAnswer={handleIncorrectAnswer}
            setIsCorrect={() => {}}
            exerciseBookmark={mockBookmark}
            notifyOfUserAttempt={() => {}}
            isL1Answer={true}
            onInputRef={handleInputRef}
          />
        </div>
      )}

      <div style={{ 
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#e9ecef',
        borderRadius: '4px',
        fontSize: '0.9rem'
      }}>
        <strong>Debug Info:</strong>
        <br />Approach: {useMovingInput ? 'Moving BottomInput' : 'Regular ClozeText'}
        <br />Input Value: "{inputValue}"
        <br />Is Correct: {isCorrectAnswer ? 'Yes' : 'No'}
        <br />Input Ref: {bottomInputRef ? 'Available' : 'Not available'}
        <br />Device: {navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad') ? 'iOS Device' : 'Other Device'}
      </div>
      
      <div style={{ 
        marginTop: '1rem',
        padding: '1rem',
        backgroundColor: '#d1ecf1',
        borderRadius: '4px',
        fontSize: '0.9rem'
      }}>
        <strong>Test Instructions:</strong>
        <br />1. BottomInput renders normally (with autoFocus working)
        <br />2. We get the input ref via callback
        <br />3. We move the actual DOM element to the inline position
        <br />4. This preserves focus behavior while getting inline positioning
        <br />5. Type "casa" to test (this is L1 answer mode)
      </div>
    </div>
  );
}