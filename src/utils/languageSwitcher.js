import LocalStorage from "../assorted/LocalStorage";
import { saveSharedUserInfo } from "./cookies/userInfo";

function apply(userDetails, setUserDetails) {
  setUserDetails(userDetails);
  LocalStorage.setUserInfo(userDetails);
  saveSharedUserInfo(userDetails);
}

/**
 * The new language is applied only once the server has saved it. Applying it
 * remounts every page (AppLayout keys its content on learned_language), and
 * the pages fetch at once -- from endpoints that read the language the server
 * has saved. Applied any earlier, they got the previous language's articles,
 * words and exercises, and the API cache (keyed on the language in
 * LocalStorage) kept serving those under the new language for five minutes.
 * Callers show their own progress meanwhile (the streak bar highlights the
 * flag, the language modal a spinner).
 *
 * onSaved runs in the same tick as the switch is applied, for a caller that
 * must navigate as the language changes, not before or after.
 */
export function switchLanguage(api, userDetails, setUserDetails, langCode, onDone, onSaved) {
  if (langCode === userDetails.learned_language) return;

  const newUserDetails = {
    ...userDetails,
    learned_language: langCode,
  };

  api.saveUserDetails(
    newUserDetails,
    () => {
      // Save failed: nothing was applied, so the UI already matches the server.
      if (onDone) onDone();
    },
    async () => {
      if (onSaved) onSaved();
      apply(newUserDetails, setUserDetails);
      if (onDone) onDone();
      // Same learned_language, so no second remount: this only refreshes what
      // the server derives from the switch (streaks, levels, ...).
      try {
        apply(await api.getUserDetails(), setUserDetails);
      } catch (e) {
        // The switch itself is saved and applied; the next load refreshes the rest.
      }
    },
  );
}
