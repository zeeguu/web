export const DEFAULT_LANGUAGE_ID = "en";
export const BETWEEN_CARDS_DELAY_MS = 5000;
export const TTS_PLAYBACK_PREROLL_MS = 120;
export const AFTER_TTS_BEFORE_RECORDING_MS = 80;

const PROMPT_COPY = {
  da: (promptText) => `Sig, ${promptText}`,
  en: (promptText) => `Please say, ${promptText}`,
};

const FEEDBACK_COPY = {
  da: {
    successIntro: "Godt klaret. Det rigtige svar var:",
    retryPrompt: "Du er meget tæt på. Prøv igen.",
    finalIncorrectIntro: "Fangede det ikke. Det rigtige svar var:",
  },
  en: {
    successIntro: "Great job. The correct answer was:",
    retryPrompt: "Almost there. Try again.",
    finalIncorrectIntro: "Didn't catch that. The correct answer was:",
  },
};

export function feedbackCopyForLanguage(languageCode) {
  return FEEDBACK_COPY[languageCode] || FEEDBACK_COPY.en;
}

export function promptInstructionText(translationLanguageId, promptText) {
  const promptBuilder = PROMPT_COPY[translationLanguageId] || PROMPT_COPY.en;
  return promptBuilder(promptText);
}
