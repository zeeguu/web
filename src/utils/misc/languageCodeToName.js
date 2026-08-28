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

// The teacher dashboard's cohort payload carries a language *name* ("Danish")
// and no code, but flags are keyed by code. Reverse the map rather than widen
// the endpoint, so this works against the API that is already deployed.
const NAME_TO_LANGUAGE_CODE = Object.fromEntries(
  Object.entries(LANGUAGE_CODE_TO_NAME).map(([code, name]) => [name.toLowerCase(), code]),
);

export function languageCodeFromName(name) {
  return name ? NAME_TO_LANGUAGE_CODE[name.toLowerCase()] : undefined;
}
