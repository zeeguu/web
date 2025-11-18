import React, { useState } from 'react';
import * as s from './VirtualKeyboard.sc';

// Danish keyboard layout with special characters
// Danish uses: æ, ø, å (and their uppercase variants)
const DANISH_LAYOUT = {
  lowercase: [
    ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'],
    ['m', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x'],
    ['y', 'z', 'æ', 'ø', 'å', '', '', '', '', '', '', '']
  ],
  uppercase: [
    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
    ['M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X'],
    ['Y', 'Z', 'Æ', 'Ø', 'Å', '', '', '', '', '', '', '']
  ]
};

export default function DanishKeyboard({ onKeyPress, isCollapsed, setIsCollapsed }) {
  const [isShift, setIsShift] = useState(false);

  const handleKeyClick = (char) => {
    if (!char) return; // Skip empty slots
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

  const currentLayout = isShift ? DANISH_LAYOUT.uppercase : DANISH_LAYOUT.lowercase;

  if (isCollapsed) {
    return (
      <s.CollapsedKeyboard onClick={() => setIsCollapsed(false)}>
        <s.KeyboardIcon>⌨️</s.KeyboardIcon>
        <span>Show Danish Keyboard</span>
      </s.CollapsedKeyboard>
    );
  }

  return (
    <s.KeyboardContainer>
      <s.KeyboardHeader>
        <s.KeyboardTitle>Danish Keyboard</s.KeyboardTitle>
        <s.CollapseButton onClick={() => setIsCollapsed(true)}>▼</s.CollapseButton>
      </s.KeyboardHeader>

      <s.KeyboardRows>
        {currentLayout.map((row, rowIndex) => (
          <s.KeyRow key={`row-${rowIndex}`}>
            {row.map((char, charIndex) => {
              // Skip rendering empty keys but keep them for layout consistency
              if (!char) {
                return <s.Key key={`${rowIndex}-${charIndex}`} style={{ visibility: 'hidden' }} />;
              }
              return (
                <s.Key key={`${rowIndex}-${charIndex}`} onClick={() => handleKeyClick(char)}>
                  {char}
                </s.Key>
              );
            })}
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
