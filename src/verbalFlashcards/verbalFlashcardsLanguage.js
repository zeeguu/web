export const DEFAULT_LANGUAGE_ID = "en";
export const SILENCE_THRESHOLD_MS = 1500;
export const MIN_VOICE_BEFORE_STOP_ELIGIBLE_MS = 120;
export const BETWEEN_CARDS_DELAY_MS = 5000;
export const TTS_PLAYBACK_PREROLL_MS = 120;
export const AFTER_TTS_BEFORE_RECORDING_MS = 250;

const SUPPORTED_RECORDING_MIME_TYPES = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];

const LANGUAGE_LOCALES = {
  da: "da-DK",
  de: "de-DE",
  el: "el-GR",
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
  hu: "hu-HU",
  it: "it-IT",
  nl: "nl-NL",
  no: "nb-NO",
  pl: "pl-PL",
  pt: "pt-PT",
  ro: "ro-RO",
  ru: "ru-RU",
  sv: "sv-SE",
  tr: "tr-TR",
};

const FALLBACK_LANGUAGE_NAMES = {
  da: "Danish",
  de: "German",
  el: "Greek",
  en: "English",
  es: "Spanish",
  fr: "French",
  hu: "Hungarian",
  it: "Italian",
  nl: "Dutch",
  no: "Norwegian",
  pl: "Polish",
  pt: "Portuguese",
  ro: "Romanian",
  ru: "Russian",
  sv: "Swedish",
  tr: "Turkish",
};

const PROMPT_COPY = {
  da: (targetLanguage) => `På ${targetLanguage}, sig`,
  en: (targetLanguage) => `In ${targetLanguage}, please say`,
};

const FEEDBACK_COPY = {
  da: {
    successIntro: "Godt klaret! Det rigtige svar var",
    retryPrompt: "Du er meget tæt på. Prøv igen.",
    finalIncorrectIntro: "Fangede det ikke. Det rigtige svar var",
  },
  en: {
    successIntro: "Great job! The correct answer was",
    retryPrompt: "Almost there. Try again.",
    finalIncorrectIntro: "Didn't catch that. The correct answer was",
  },
};

function localeForLanguage(languageCode) {
  return LANGUAGE_LOCALES[languageCode] || languageCode || "en-US";
}

function localizedLanguageName(languageCode, displayLanguageCode) {
  if (!languageCode) {
    return "the target language";
  }

  if (typeof Intl !== "undefined" && typeof Intl.DisplayNames === "function") {
    try {
      const displayNames = new Intl.DisplayNames([localeForLanguage(displayLanguageCode)], { type: "language" });
      const localizedName = displayNames.of(languageCode);
      if (localizedName) {
        return localizedName;
      }
    } catch (error) {
      console.warn("Could not localize language name:", error);
    }
  }

  return FALLBACK_LANGUAGE_NAMES[languageCode] || languageCode || "the target language";
}

export function feedbackCopyForLanguage(languageCode) {
  return FEEDBACK_COPY[languageCode] || FEEDBACK_COPY.en;
}

export function promptInstructionIntroText(translationLanguageId, learnedLanguageId) {
  const promptBuilder = PROMPT_COPY[translationLanguageId] || PROMPT_COPY.en;
  const targetLanguage = localizedLanguageName(learnedLanguageId, translationLanguageId);
  return promptBuilder(targetLanguage);
}

export function supportedRecordingMimeType() {
  if (typeof window === "undefined" || !window.MediaRecorder || typeof MediaRecorder.isTypeSupported !== "function") {
    return "";
  }

  for (const type of SUPPORTED_RECORDING_MIME_TYPES) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }

  return "";
}
