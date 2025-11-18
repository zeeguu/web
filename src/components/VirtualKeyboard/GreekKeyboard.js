import React, { useState } from 'react';
import * as s from './VirtualKeyboard.sc';

// Greek keyboard layout based on standard Greek keyboard
// Row layout matches physical keyboard for familiarity
const GREEK_LAYOUT = {
  lowercase: [
    ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ'],
    ['ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω'],
    ['ά', 'έ', 'ή', 'ί', 'ό', 'ύ', 'ώ', 'ϊ', 'ΐ', 'ϋ', 'ΰ', 'ς']
  ],
  uppercase: [
    ['Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ', 'Ι', 'Κ', 'Λ', 'Μ'],
    ['Ν', 'Ξ', 'Ο', 'Π', 'Ρ', 'Σ', 'Τ', 'Υ', 'Φ', 'Χ', 'Ψ', 'Ω'],
    ['Ά', 'Έ', 'Ή', 'Ί', 'Ό', 'Ύ', 'Ώ', 'Ϊ', '', 'Ϋ', '', '΢']
  ],
  // Additional accented characters if needed
  accents: []
};

export default function GreekKeyboard({ onKeyPress, isCollapsed, setIsCollapsed }) {
  const [isShift, setIsShift] = useState(false);

  const handleKeyClick = (char) => {
    onKeyPress(char);
    // Reset shift after typing (like a real keyboard)
    if (isShift) {
      setIsShift(false);
    }
  };

  const handleBackspace = () => {
    onKeyPress('BACKSPACE');
  };

  const handleSpace = () => {
    onKeyPress(' ');
  };

  const toggleShift = () => {
    setIsShift(!isShift);
  };

  const currentLayout = isShift ? GREEK_LAYOUT.uppercase : GREEK_LAYOUT.lowercase;

  if (isCollapsed) {
    return (
      <s.CollapsedKeyboard onClick={() => setIsCollapsed(false)}>
        <s.KeyboardIcon>⌨️</s.KeyboardIcon>
        <span>Show Greek Keyboard</span>
      </s.CollapsedKeyboard>
    );
  }

  return (
    <s.KeyboardContainer>
      <s.KeyboardHeader>
        <s.KeyboardTitle>Greek Keyboard</s.KeyboardTitle>
        <s.CollapseButton onClick={() => setIsCollapsed(true)}>▼</s.CollapseButton>
      </s.KeyboardHeader>

      <s.KeyboardRows>
        {currentLayout.map((row, rowIndex) => (
          <s.KeyRow key={`row-${rowIndex}`}>
            {row.map((char, charIndex) => (
              <s.Key key={`${rowIndex}-${charIndex}`} onClick={() => handleKeyClick(char)}>
                {char}
              </s.Key>
            ))}
          </s.KeyRow>
        ))}

        {/* Bottom row with special keys */}
        <s.KeyRow>
          <s.SpecialKey onClick={toggleShift} isActive={isShift}>
            ⇧ Shift
          </s.SpecialKey>
          <s.SpaceKey onClick={handleSpace}>
            Space
          </s.SpaceKey>
          <s.SpecialKey onClick={handleBackspace}>
            ⌫ Back
          </s.SpecialKey>
        </s.KeyRow>
      </s.KeyboardRows>
    </s.KeyboardContainer>
  );
}
