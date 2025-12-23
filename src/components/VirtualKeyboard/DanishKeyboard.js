import React, { useState } from 'react';
import * as s from './VirtualKeyboard.sc';

// Danish keyboard layout with QWERTY layout
// Danish uses: æ, ø, å (and their uppercase variants)
// Using 9 keys per row for better mobile sizing
// Special characters on the bottom row
const DANISH_LAYOUT = {
  lowercase: [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', 'p', ''],
    ['æ', 'ø', 'å', '', '', '', '', '', '']
  ],
  uppercase: [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'P', ''],
    ['Æ', 'Ø', 'Å', '', '', '', '', '', '']
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
    const specialChars = isShift ? ['Æ', 'Ø', 'Å'] : ['æ', 'ø', 'å'];
    return (
      <s.CollapsedKeyboardWithKeys>
        <s.SpecialKeysRow>
          {specialChars.map((char) => (
            <s.Key
              key={char}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleKeyClick(char)}
              style={{ width: '50px', minWidth: '50px' }}
            >
              {char}
            </s.Key>
          ))}
          <s.SpecialKey
            onMouseDown={(e) => e.preventDefault()}
            onClick={toggleShift}
            isActive={isShift}
            style={{ minWidth: 'auto', width: '50px', padding: '0' }}
          >
            ⇧
          </s.SpecialKey>
          <s.ExpandButton
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setIsCollapsed(false)}
          >
            ▲
          </s.ExpandButton>
        </s.SpecialKeysRow>
      </s.CollapsedKeyboardWithKeys>
    );
  }

  return (
    <s.KeyboardContainer>
      <s.KeyboardHeader>
        <s.KeyboardTitle>Danish Keyboard</s.KeyboardTitle>
        <s.CollapseButton
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setIsCollapsed(true)}
        >▼</s.CollapseButton>
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
                <s.Key
                  key={`${rowIndex}-${charIndex}`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleKeyClick(char)}
                >
                  {char}
                </s.Key>
              );
            })}
          </s.KeyRow>
        ))}

        {/* Bottom row with special keys */}
        <s.KeyRow>
          <s.SpecialKey onMouseDown={(e) => e.preventDefault()} onClick={toggleShift} isActive={isShift}>
            ⇧ Shift
          </s.SpecialKey>
          <s.SpaceKey onMouseDown={(e) => e.preventDefault()} onClick={handleSpace}>
            Space
          </s.SpaceKey>
          <s.SpecialKey onMouseDown={(e) => e.preventDefault()} onClick={handleBackspace}>
            ⌫ Back
          </s.SpecialKey>
        </s.KeyRow>
      </s.KeyboardRows>
    </s.KeyboardContainer>
  );
}
