export const DEFAULT_LANGUAGE_ID = "en";
export const SILENCE_THRESHOLD_MS = 1500;
export const MIN_VOICE_BEFORE_STOP_ELIGIBLE_MS = 120;
export const BETWEEN_CARDS_DELAY_MS = 5000;

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
  da: (prompt, targetLanguage) => `Sig '${prompt}' på ${targetLanguage}.`,
  de: (prompt, targetLanguage) => `Bitte sag '${prompt}' auf ${targetLanguage}.`,
  el: (prompt, targetLanguage) => `Πες '${prompt}' στα ${targetLanguage}.`,
  en: (prompt, targetLanguage) => `Please say '${prompt}' in ${targetLanguage}.`,
  es: (prompt, targetLanguage) => `Di '${prompt}' en ${targetLanguage}.`,
  fr: (prompt, targetLanguage) => `Dis '${prompt}' en ${targetLanguage}.`,
  hu: (prompt, targetLanguage) => `Mondd azt, hogy '${prompt}' ${targetLanguage} nyelven.`,
  it: (prompt, targetLanguage) => `Di '${prompt}' in ${targetLanguage}.`,
  nl: (prompt, targetLanguage) => `Zeg '${prompt}' in het ${targetLanguage}.`,
  no: (prompt, targetLanguage) => `Si '${prompt}' på ${targetLanguage}.`,
  pl: (prompt, targetLanguage) => `Powiedz '${prompt}' po ${targetLanguage}.`,
  pt: (prompt, targetLanguage) => `Diz '${prompt}' em ${targetLanguage}.`,
  ro: (prompt, targetLanguage) => `Spune '${prompt}' în ${targetLanguage}.`,
  ru: (prompt, targetLanguage) => `Скажи '${prompt}' на ${targetLanguage}.`,
  sv: (prompt, targetLanguage) => `Säg '${prompt}' på ${targetLanguage}.`,
  tr: (prompt, targetLanguage) => `'${prompt}' kelimesini ${targetLanguage} dilinde söyle.`,
};

const FEEDBACK_COPY = {
  da: {
    successIntro: "Godt klaret! Det rigtige svar var",
    retryPrompt: "Du er meget tæt på. Prøv igen.",
    finalIncorrectIntro: "Du var meget tæt på. Det rigtige svar var",
  },
  de: {
    successIntro: "Gut gemacht! Die richtige Antwort war",
    retryPrompt: "Du bist ganz nah dran. Versuch es noch einmal.",
    finalIncorrectIntro: "Du warst ganz nah dran. Die richtige Antwort war",
  },
  el: {
    successIntro: "Μπράβο! Η σωστή απάντηση ήταν",
    retryPrompt: "Είσαι πολύ κοντά. Προσπάθησε ξανά.",
    finalIncorrectIntro: "Ήσουν πολύ κοντά. Η σωστή απάντηση ήταν",
  },
  en: {
    successIntro: "Well done! The correct answer was",
    retryPrompt: "Almost there. Try again.",
    finalIncorrectIntro: "You almost got it. The correct answer was",
  },
  es: {
    successIntro: "Muy bien. La respuesta correcta era",
    retryPrompt: "Ya casi. Inténtalo de nuevo.",
    finalIncorrectIntro: "Casi lo lograste. La respuesta correcta era",
  },
  fr: {
    successIntro: "Bien joué ! La bonne réponse était",
    retryPrompt: "Tu y es presque. Essaie encore.",
    finalIncorrectIntro: "Tu y étais presque. La bonne réponse était",
  },
  hu: {
    successIntro: "Szép munka! A helyes válasz ez volt",
    retryPrompt: "Nagyon közel vagy. Próbáld újra.",
    finalIncorrectIntro: "Majdnem sikerült. A helyes válasz ez volt",
  },
  it: {
    successIntro: "Ben fatto! La risposta corretta era",
    retryPrompt: "Ci sei quasi. Riprova.",
    finalIncorrectIntro: "Ci sei andato vicino. La risposta corretta era",
  },
  nl: {
    successIntro: "Goed gedaan! Het juiste antwoord was",
    retryPrompt: "Je bent er bijna. Probeer het opnieuw.",
    finalIncorrectIntro: "Je zat er bijna. Het juiste antwoord was",
  },
  no: {
    successIntro: "Bra jobbet! Det riktige svaret var",
    retryPrompt: "Nesten der. Prøv igjen.",
    finalIncorrectIntro: "Du var veldig nær. Det riktige svaret var",
  },
  pl: {
    successIntro: "Dobra robota! Poprawna odpowiedź to",
    retryPrompt: "Jesteś bardzo blisko. Spróbuj jeszcze raz.",
    finalIncorrectIntro: "Było bardzo blisko. Poprawna odpowiedź to",
  },
  pt: {
    successIntro: "Muito bem! A resposta correta era",
    retryPrompt: "Quase lá. Tenta outra vez.",
    finalIncorrectIntro: "Esteve quase. A resposta correta era",
  },
  ro: {
    successIntro: "Foarte bine! Răspunsul corect era",
    retryPrompt: "Ești foarte aproape. Mai încearcă o dată.",
    finalIncorrectIntro: "Ai fost foarte aproape. Răspunsul corect era",
  },
  ru: {
    successIntro: "Отлично! Правильный ответ был",
    retryPrompt: "Почти получилось. Попробуй еще раз.",
    finalIncorrectIntro: "Ты был очень близко. Правильный ответ был",
  },
  sv: {
    successIntro: "Bra jobbat! Rätt svar var",
    retryPrompt: "Du är väldigt nära. Försök igen.",
    finalIncorrectIntro: "Du var väldigt nära. Rätt svar var",
  },
  tr: {
    successIntro: "Aferin! Doğru cevap şuydu",
    retryPrompt: "Çok yaklaştın. Tekrar dene.",
    finalIncorrectIntro: "Çok yaklaştın. Doğru cevap şuydu",
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

export function promptInstructionText(promptText, translationLanguageId, learnedLanguageId) {
  if (!promptText) {
    return "";
  }

  const promptBuilder = PROMPT_COPY[translationLanguageId] || PROMPT_COPY.en;
  const targetLanguage = localizedLanguageName(learnedLanguageId, translationLanguageId);
  return promptBuilder(promptText, targetLanguage);
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
