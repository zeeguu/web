const startsUpper = (s) => !!s && s[0] !== s[0].toLowerCase();
const startsLower = (s) => !!s && s[0] !== s[0].toUpperCase();

// A meaning is stored with the case of the occurrence it was first
// translated in, so "Dette" → "This" (sentence-initial) also shows up over a
// mid-sentence "dette". When the stored origin and the word on screen differ
// in case only because of where they sit in a sentence, carry that difference
// over to the translation. When they agree, the translation's case is left
// alone: "mandag" → "Monday", "jyske" → "Jutland" are capitalised on purpose.
export function matchTranslationCase(displayedWord, origin, translation) {
  if (!displayedWord || !origin || !translation) return translation;

  if (startsUpper(origin) && startsLower(displayedWord) && startsUpper(translation)) {
    const firstWord = translation.split(/[\s']/)[0];
    // Leave acronyms ("EU") and the English pronoun "I" alone.
    if (firstWord === "I" || startsUpper(translation.slice(1))) return translation;
    return translation[0].toLowerCase() + translation.slice(1);
  }

  if (startsLower(origin) && startsUpper(displayedWord) && startsLower(translation)) {
    return translation[0].toUpperCase() + translation.slice(1);
  }

  return translation;
}
