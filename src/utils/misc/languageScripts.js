// Language script types and detection utilities
// Used to determine when to show virtual keyboards for non-Roman alphabets

export const SCRIPT_TYPES = {
  ROMAN: 'roman',
  GREEK: 'greek',
  DANISH: 'danish',
  CYRILLIC: 'cyrillic',
  ARABIC: 'arabic',
  CHINESE: 'chinese',
  JAPANESE: 'japanese',
};

// Map language codes to their script types
export const LANGUAGE_TO_SCRIPT = {
  'el': SCRIPT_TYPES.GREEK,
  'da': SCRIPT_TYPES.DANISH,  // Danish with special characters (æ, ø, å)
  'ru': SCRIPT_TYPES.CYRILLIC,
  'uk': SCRIPT_TYPES.CYRILLIC,
  'sr': SCRIPT_TYPES.CYRILLIC,
  'ar': SCRIPT_TYPES.ARABIC,
  'zh-CN': SCRIPT_TYPES.CHINESE,
  'ja': SCRIPT_TYPES.JAPANESE,
  // Roman alphabet languages (default)
  'en': SCRIPT_TYPES.ROMAN,
  'es': SCRIPT_TYPES.ROMAN,
  'fr': SCRIPT_TYPES.ROMAN,
  'de': SCRIPT_TYPES.ROMAN,
  'it': SCRIPT_TYPES.ROMAN,
  'pt': SCRIPT_TYPES.ROMAN,
  'nl': SCRIPT_TYPES.ROMAN,
  'sv': SCRIPT_TYPES.ROMAN,
  'no': SCRIPT_TYPES.ROMAN,
  'pl': SCRIPT_TYPES.ROMAN,
  'ro': SCRIPT_TYPES.ROMAN,
  'tr': SCRIPT_TYPES.ROMAN,
  'sq': SCRIPT_TYPES.ROMAN,
  'hu': SCRIPT_TYPES.ROMAN,
  'lv': SCRIPT_TYPES.ROMAN,
};

/**
 * Determines if a language uses a non-Roman script and needs a virtual keyboard
 * @param {string} languageCode - ISO language code (e.g., 'el', 'ru', 'da')
 * @param {number} userId - User ID (optional, for future use)
 * @returns {boolean} - True if virtual keyboard should be shown
 */
export function needsVirtualKeyboard(languageCode, userId = null) {
  const scriptType = LANGUAGE_TO_SCRIPT[languageCode];
  return scriptType && scriptType !== SCRIPT_TYPES.ROMAN;
}

/**
 * Gets the script type for a given language
 * @param {string} languageCode - ISO language code
 * @returns {string} - Script type (defaults to 'roman')
 */
export function getScriptType(languageCode) {
  return LANGUAGE_TO_SCRIPT[languageCode] || SCRIPT_TYPES.ROMAN;
}
