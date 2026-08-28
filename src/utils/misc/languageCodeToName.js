export const LANGUAGE_CODE_TO_NAME = {
  sq: "Albanian",
  ar: "Arabic",
  "zh-CN": "Chinese",
  da: "Danish",
  nl: "Dutch",
  en: "English",
  fr: "French",
  de: "German",
  hu: "Hungarian",
  it: "Italian",
  ku: "Kurdish",
  lv: "Latvian",
  no: "Norwegian",
  pl: "Polish",
  pt: "Portuguese",
  ro: "Romanian",
  ru: "Russian",
  so: "Somali",
  es: "Spanish",
  sv: "Swedish",
  tr: "Turkish",
  uk: "Ukrainian",
  vi: "Vietnamese",
  ja: "Japanese",
  sr: "Serbian",
  ind: "Indonesian",
  ur: "Urdu",
  ta: "Tamil",
  bn: "Bengali",
  el: "Greek",
};

/**
 * A language's display name, falling back to the code itself for anything the
 * map does not cover. Lives here so the fallback is decided once: five callers
 * had each written `LANGUAGE_CODE_TO_NAME[code] || code` for themselves.
 */
export function languageName(code) {
  return LANGUAGE_CODE_TO_NAME[code] || code;
}
