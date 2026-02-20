import React, { useState } from 'react';
import * as s from './VirtualKeyboard.sc';
import { insertAtCursor } from '../../utils/input/cursorAwareInsert';

// Special characters for each language
const LANGUAGE_SPECIAL_CHARS = {
  // Scandinavian
  da: { lowercase: ['æ', 'ø', 'å'], uppercase: ['Æ', 'Ø', 'Å'], name: 'Danish' },
  no: { lowercase: ['æ', 'ø', 'å'], uppercase: ['Æ', 'Ø', 'Å'], name: 'Norwegian' },
  sv: { lowercase: ['å', 'ä', 'ö'], uppercase: ['Å', 'Ä', 'Ö'], name: 'Swedish' },

  // Germanic
  de: { lowercase: ['ä', 'ö', 'ü', 'ß'], uppercase: ['Ä', 'Ö', 'Ü', 'ẞ'], name: 'German' },

  // Romance
  fr: { lowercase: ['é', 'è', 'ê', 'à', 'ç', 'ù', 'ô'], uppercase: ['É', 'È', 'Ê', 'À', 'Ç', 'Ù', 'Ô'], name: 'French' },
  es: { lowercase: ['ñ', 'á', 'é', 'í', 'ó', 'ú', '¿', '¡'], uppercase: ['Ñ', 'Á', 'É', 'Í', 'Ó', 'Ú', '¿', '¡'], name: 'Spanish' },
  pt: { lowercase: ['ã', 'õ', 'ç', 'á', 'é', 'ó', 'ê', 'ô'], uppercase: ['Ã', 'Õ', 'Ç', 'Á', 'É', 'Ó', 'Ê', 'Ô'], name: 'Portuguese' },
  it: { lowercase: ['à', 'è', 'é', 'ì', 'ò', 'ù'], uppercase: ['À', 'È', 'É', 'Ì', 'Ò', 'Ù'], name: 'Italian' },
  ro: { lowercase: ['ă', 'â', 'î', 'ș', 'ț'], uppercase: ['Ă', 'Â', 'Î', 'Ș', 'Ț'], name: 'Romanian' },

  // Other
  pl: { lowercase: ['ą', 'ć', 'ę', 'ł', 'ń', 'ó', 'ś', 'ź', 'ż'], uppercase: ['Ą', 'Ć', 'Ę', 'Ł', 'Ń', 'Ó', 'Ś', 'Ź', 'Ż'], name: 'Polish' },
  hu: { lowercase: ['á', 'é', 'í', 'ó', 'ö', 'ő', 'ú', 'ü', 'ű'], uppercase: ['Á', 'É', 'Í', 'Ó', 'Ö', 'Ő', 'Ú', 'Ü', 'Ű'], name: 'Hungarian' },
  tr: { lowercase: ['ç', 'ğ', 'ı', 'ö', 'ş', 'ü'], uppercase: ['Ç', 'Ğ', 'İ', 'Ö', 'Ş', 'Ü'], name: 'Turkish' },
  nl: { lowercase: ['é', 'ë', 'ï', 'ó', 'ö', 'ü'], uppercase: ['É', 'Ë', 'Ï', 'Ó', 'Ö', 'Ü'], name: 'Dutch' },
};

/**
 * Check if a language has special characters that need a character bar
 */
export function hasSpecialCharacters(languageCode) {
  return languageCode in LANGUAGE_SPECIAL_CHARS;
}

/**
 * SpecialCharacterBar - A compact bar showing special characters for a language
 */
export default function SpecialCharacterBar({
  languageCode,
  onKeyPress,
  currentValue = '',
  inputRef = null, // Optional ref to input for cursor-aware insertion
}) {
  const [isShift, setIsShift] = useState(false);

  const charSet = LANGUAGE_SPECIAL_CHARS[languageCode];
  if (!charSet) return null;

  const chars = isShift ? charSet.uppercase : charSet.lowercase;

  const handleKeyClick = (char) => {
    insertAtCursor(inputRef, char, currentValue, onKeyPress);

    if (isShift) {
      setIsShift(false);
    }
  };

  const toggleShift = () => {
    setIsShift(!isShift);
  };

  return (
    <s.CollapsedKeyboardWithKeys>
      <s.SpecialKeysRow style={{ flexWrap: 'wrap', gap: '4px' }}>
        {chars.map((char, index) => (
          <s.Key
            key={`${char}-${index}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleKeyClick(char)}
            style={{ width: '42px', minWidth: '42px', height: '38px' }}
          >
            {char}
          </s.Key>
        ))}
        <s.SpecialKey
          onMouseDown={(e) => e.preventDefault()}
          onClick={toggleShift}
          isActive={isShift}
          style={{ minWidth: 'auto', width: '42px', padding: '0' }}
        >
          ⇧
        </s.SpecialKey>
      </s.SpecialKeysRow>
    </s.CollapsedKeyboardWithKeys>
  );
}
