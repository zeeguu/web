export const VERBAL_FLASHCARDS_LEARNED_LANGUAGE = "da";
export const VERBAL_FLASHCARDS_TRANSLATION_LANGUAGES = ["da", "en"];

function normalizedLanguageCode(languageCode) {
  return String(languageCode || "").toLowerCase();
}

export function hasSupportedVerbalFlashcardsLearnedLanguage(userDetails) {
  return normalizedLanguageCode(userDetails?.learned_language) === VERBAL_FLASHCARDS_LEARNED_LANGUAGE;
}

export function hasSupportedVerbalFlashcardsTranslationLanguage(userDetails) {
  return VERBAL_FLASHCARDS_TRANSLATION_LANGUAGES.includes(
    normalizedLanguageCode(userDetails?.native_language),
  );
}
