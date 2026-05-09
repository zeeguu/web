export const DEFAULT_LANGUAGE_ID = "en";
export const BETWEEN_CARDS_DELAY_MS = 5000;
export const TTS_PLAYBACK_PREROLL_MS = 120;

const PROMPT_COPY = {
  da: (promptText) => `Lad os prøve den her. Sig: ${promptText}.`,
  en: (promptText) => `Let's try this one. Say: ${promptText}.`,
};

const FEEDBACK_COPY = {
  da: {
    successIntro: "Ja, lige præcis. Svaret er:",
    retryPrompt: "Lad os prøve en gang til.",
    finalIncorrectIntro: "Lad os høre svaret. Det er:",
    revealAnswerIntro: "Bare rolig. Svaret er:",
    finalPracticePrompt: "Prøv nu selv at sige det.",
    finalPracticeSuccess: "Flot. Vi går videre.",
    finalPracticeMoveOn: "Okay. Vi går videre.",
  },
  en: {
    successIntro: "Yes, exactly. The answer is:",
    retryPrompt: "Let's try that once more.",
    finalIncorrectIntro: "Let's listen to the answer. It is:",
    revealAnswerIntro: "No worries. The answer is:",
    finalPracticePrompt: "Now try saying it yourself.",
    finalPracticeSuccess: "Nice. Let's keep going.",
    finalPracticeMoveOn: "Okay. Let's keep going.",
  },
};

export function feedbackCopyForLanguage(languageCode) {
  return FEEDBACK_COPY[languageCode] || FEEDBACK_COPY.en;
}

export function promptInstructionText(translationLanguageId, promptText) {
  const promptBuilder = PROMPT_COPY[translationLanguageId] || PROMPT_COPY.en;
  return promptBuilder(promptText);
}
