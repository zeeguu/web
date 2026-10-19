import { franc } from "franc-min";

// Mapping from ISO 639-3 codes (used by franc) to ISO 639-1 codes (used by Zeeguu)
const francToZeeguuLanguageMap = {
  deu: "de", // German
  spa: "es", // Spanish
  fra: "fr", // French
  nld: "nl", // Dutch
  eng: "en", // English
  ita: "it", // Italian
  cmn: "zh-CN", // Mandarin Chinese
  dan: "da", // Danish
  tur: "tr", // Turkish
  arb: "ar", // Arabic
  som: "so", // Somali
  kur: "ku", // Kurdish
  swe: "sv", // Swedish
  rus: "ru", // Russian
};

/**
 * Detects the language of the provided text and returns the Zeeguu language code.
 * Returns null if the language cannot be detected or is not supported by Zeeguu.
 *
 * @param {string} text - The text to detect the language from
 * @returns {string|null} - The Zeeguu language code (e.g., "de", "es") or null
 */
export function detectLanguageFromText(text) {
  if (!text || text.trim().length < 10) {
    // Need at least some text for reliable detection
    return null;
  }

  // Strip HTML tags to get plain text for better detection
  const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const plainText = stripHtml(text);

  // franc returns ISO 639-3 codes
  const detectedCode = franc(plainText, { minLength: 10 });

  // franc returns "und" when it cannot determine the language
  if (detectedCode === "und") {
    return null;
  }

  // Map to Zeeguu language code
  const zeeguuCode = francToZeeguuLanguageMap[detectedCode];

  return zeeguuCode || null;
}
