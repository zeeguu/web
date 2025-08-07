import React, { useState, useEffect, useRef } from 'react';
import BottomInput from '../exercises/exerciseTypes/BottomInput.js';
import InteractiveText from '../reader/InteractiveText.js';

export default function IOSFocusTestIllusion() {
  const [inputValue, setInputValue] = useState("");
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [interactiveText, setInteractiveText] = useState(null);
  const [bottomInputRef, setBottomInputRef] = useState(null);
  const targetWordRef = useRef(null);
  const containerRef = useRef(null);
  
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
      },
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

  // Create visual illusion when we have the input ref
  useEffect(() => {
    if (bottomInputRef && targetWordRef.current && containerRef.current) {
      console.log('Creating visual illusion...');
      
      // Style the bottom input to be transparent/invisible
      const inputContainer = bottomInputRef.closest('.type-feedback')?.nextElementSibling || bottomInputRef.parentElement;
      if (inputContainer) {
        inputContainer.style.background = 'transparent';
        inputContainer.style.border = 'none';
        inputContainer.style.boxShadow = 'none';
      }
      
      // Make the input itself transparent but keep its functionality
      bottomInputRef.style.background = 'transparent';
      bottomInputRef.style.border = 'none';
      bottomInputRef.style.borderRadius = '0';
      bottomInputRef.style.outline = 'none';
      bottomInputRef.style.padding = '0';
      bottomInputRef.style.fontSize = 'inherit';
      bottomInputRef.style.fontFamily = 'inherit';
      bottomInputRef.style.color = 'transparent'; // Hide the text in bottom input
      bottomInputRef.style.caretColor = 'transparent'; // Hide cursor in bottom input
      
      // Sync the target word to show what's being typed
      const updateTargetWord = () => {
        if (targetWordRef.current && bottomInputRef) {
          const value = bottomInputRef.value || '';
          targetWordRef.current.textContent = value || '_____';
          
          // Style based on correctness
          if (value.toLowerCase().trim() === mockBookmark.to.toLowerCase()) {
            targetWordRef.current.style.color = '#FF8C00';
            targetWordRef.current.style.fontWeight = '600';
          } else {
            targetWordRef.current.style.color = 'inherit';
            targetWordRef.current.style.fontWeight = 'normal';
          }
        }
      };
      
      // Listen for input changes
      const handleInput = () => {
        updateTargetWord();
      };
      
      bottomInputRef.addEventListener('input', handleInput);
      updateTargetWord(); // Initial update
      
      return () => {
        if (bottomInputRef) {
          bottomInputRef.removeEventListener('input', handleInput);
        }
      };
    }
  }, [bottomInputRef]);

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

  return (
    <div 
      ref={containerRef}
      style={{ 
        padding: '2rem', 
        maxWidth: '600px', 
        margin: '0 auto',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      <h1>iOS Focus Test - Visual Illusion</h1>
      <p>BottomInput stays functional but styled to appear inline</p>
      
      <div style={{ 
        border: '1px solid #ccc', 
        borderRadius: '8px', 
        padding: '2rem',
        backgroundColor: '#f9f9f9',
        marginTop: '2rem',
        position: 'relative'
      }}>
        <h3>Test Sentence - Visual Illusion Approach</h3>
        
        <div style={{ fontSize: '1.2rem', lineHeight: '1.6', marginTop: '2rem' }}>
          <span>The big </span>
          <span 
            ref={targetWordRef}
            style={{ 
              display: 'inline-block',
              borderBottom: '2px dotted #333',
              minWidth: '6em',
              padding: '2px 4px',
              marginRight: '0.25em',
              marginLeft: '0.25em',
              position: 'relative',
              backgroundColor: 'white',
              cursor: 'text'
            }}
            onClick={() => {
              // Focus the hidden bottom input
              if (bottomInputRef) {
                bottomInputRef.focus();
              }
            }}
          >
            _____
          </span>
          <span> is beautiful</span>
        </div>
        
        <div style={{ 
          marginTop: '1rem', 
          fontSize: '0.8rem', 
          color: '#666',
          fontStyle: 'italic'
        }}>
          Click on the underlined area or use the input below - they're connected!
        </div>
      </div>

      {/* BottomInput - still functional but visually hidden/transparent */}
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

      <div style={{ 
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#e9ecef',
        borderRadius: '4px',
        fontSize: '0.9rem'
      }}>
        <strong>Debug Info:</strong>
        <br />Approach: Visual Illusion (BottomInput + Synced Display)
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
        <strong>How it works:</strong>
        <br />1. BottomInput remains in working position (gets autofocus)
        <br />2. BottomInput is styled to be transparent/invisible
        <br />3. Target word in sentence shows what you're typing
        <br />4. User feels like they're typing directly inline
        <br />5. Type "casa" to test (L1 answer mode)
      </div>
    </div>
  );
}