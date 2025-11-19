import React, { useState, useEffect } from 'react';
import { getScriptType, SCRIPT_TYPES } from '../../utils/misc/languageScripts';
import GreekKeyboard from './GreekKeyboard';
import DanishKeyboard from './DanishKeyboard';

const STORAGE_KEY = 'zeeguu_virtual_keyboard_collapsed';

/**
 * Virtual Keyboard component that displays the appropriate keyboard
 * based on the language script type.
 *
 * @param {string} languageCode - ISO language code (e.g., 'el' for Greek)
 * @param {function} onInput - Callback when user types a character
 * @param {string} currentValue - Current input value (for context)
 * @param {boolean} initialCollapsed - Whether keyboard starts collapsed
 * @param {function} onCollapsedChange - Callback when collapsed state changes
 */
export default function VirtualKeyboard({
  languageCode,
  onInput,
  currentValue = '',
  initialCollapsed = false,
  onCollapsedChange
}) {
  // Load collapsed state from localStorage
  const getInitialCollapsedState = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved !== null ? JSON.parse(saved) : initialCollapsed;
    } catch (e) {
      return initialCollapsed;
    }
  };

  const [isCollapsed, setIsCollapsed] = useState(getInitialCollapsedState);
  const scriptType = getScriptType(languageCode);

  // Save collapsed state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(isCollapsed));
    } catch (e) {
      // Ignore localStorage errors
    }

    // Notify parent component of collapsed state change
    if (onCollapsedChange) {
      onCollapsedChange(isCollapsed);
    }
  }, [isCollapsed, onCollapsedChange]);

  // Handle key press from virtual keyboard
  const handleKeyPress = (key) => {
    if (key === 'BACKSPACE') {
      // Remove last character
      onInput(currentValue.slice(0, -1));
    } else {
      // Add character to end
      onInput(currentValue + key);
    }
  };

  // Select the appropriate keyboard component based on script type
  const KeyboardComponent = {
    [SCRIPT_TYPES.GREEK]: GreekKeyboard,
    [SCRIPT_TYPES.DANISH]: DanishKeyboard,
    // Future keyboards can be added here:
    // [SCRIPT_TYPES.CYRILLIC]: CyrillicKeyboard,
    // [SCRIPT_TYPES.ARABIC]: ArabicKeyboard,
  }[scriptType];

  // Don't render anything if we don't have a keyboard for this script
  if (!KeyboardComponent) {
    return null;
  }

  return (
    <KeyboardComponent
      onKeyPress={handleKeyPress}
      isCollapsed={isCollapsed}
      setIsCollapsed={setIsCollapsed}
    />
  );
}
