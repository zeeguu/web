import LocalStorage from "../../assorted/LocalStorage";

// Language names come from the API: App saves them from /system_languages at
// startup, so a language added there is named here without a web release.

/**
 * A language's display name, or undefined when the API has not named it (yet:
 * the very first launch, before /system_languages has answered).
 */
export function knownLanguageName(code) {
  return LocalStorage.getLanguageNames()[code];
}

/**
 * A language's display name, falling back to the code itself. Lives here so the
 * fallback is decided once.
 */
export function languageName(code) {
  return knownLanguageName(code) || code;
}

// The teacher dashboard's cohort payload carries a language *name* ("Danish")
// and no code, but flags are keyed by code. Reverse the names rather than widen
// the endpoint, so this works against the API that is already deployed.
export function languageCodeFromName(name) {
  if (!name) return undefined;
  const entry = Object.entries(LocalStorage.getLanguageNames()).find(
    ([, each]) => each.toLowerCase() === name.toLowerCase(),
  );
  return entry?.[0];
}
