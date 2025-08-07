import React, { useState, useEffect, useRef } from 'react';
import { ClozeTranslatableText } from '../reader/ClozeTranslatableText.js';
import { ClozeTranslatableTextSimple } from '../reader/ClozeTranslatableTextSimple.js';
import InteractiveText from '../reader/InteractiveText.js';

export default function IOSFocusTest() {
  const [inputValue, setInputValue] = useState("");
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [shouldFocus, setShouldFocus] = useState(true);
  const [useAnimatedVersion, setUseAnimatedVersion] = useState(true);
  const [interactiveText, setInteractiveText] = useState(null);
  
  // Mock exercise data for testing
  const mockBookmark = {
    from: "house",
    to: "casa",
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

  function handleInputChange(value) {
    setInputValue(value);
    const isCorrect = value.toLowerCase().trim() === mockBookmark.from.toLowerCase();
    setIsCorrectAnswer(isCorrect);
  }

  function handleInputSubmit(value) {
    console.log('Submitted:', value);
  }

  if (!interactiveText) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '600px', 
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1>iOS Focus Test</h1>
      <p>Testing autofocus behavior on iOS with animated positioning</p>
      
      <div style={{ 
        border: '1px solid #ccc', 
        borderRadius: '8px', 
        padding: '2rem',
        backgroundColor: '#f9f9f9',
        marginTop: '2rem'
      }}>
        <h3>iOS Focus Test - Simple Approach (Like BottomInput)</h3>
        <div style={{ fontSize: '1.2rem', lineHeight: '1.6', minHeight: '4rem' }}>
          <ClozeTranslatableTextSimple
            interactiveText={interactiveText}
            translating={false}
            pronouncing={false}
            translatedWords={null}
            setTranslatedWords={() => {}}
            isExerciseOver={false}
            bookmarkToStudy={mockBookmark.from}
            onInputChange={handleInputChange}
            onInputSubmit={handleInputSubmit}
            inputValue={inputValue}
            placeholder=""
            isCorrectAnswer={isCorrectAnswer}
            shouldFocus={shouldFocus}
          />
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
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

      <div style={{ 
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#e9ecef',
        borderRadius: '4px',
        fontSize: '0.9rem'
      }}>
        <strong>Debug Info:</strong>
        <br />Input Value: "{inputValue}"
        <br />Is Correct: {isCorrectAnswer ? 'Yes' : 'No'}
        <br />Auto-Focus: {shouldFocus ? 'Enabled' : 'Disabled'}
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
        <br />1. Simple inline input with autoFocus (like TranslateL2toL1's BottomInput)
        <br />2. Multiple programmatic focus attempts as backup
        <br />3. Should work on desktop and hopefully iOS Safari
        <br />4. Type "house" to see the correct answer animation (orange color)
      </div>
    </div>
  );
}