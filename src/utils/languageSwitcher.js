import LocalStorage from "../assorted/LocalStorage";
import { saveSharedUserInfo } from "./cookies/userInfo";

export function switchLanguage(api, userDetails, setUserDetails, langCode, onDone) {
  if (langCode === userDetails.learned_language) return;

  const previousUserDetails = userDetails;
  const newUserDetails = {
    ...userDetails,
    learned_language: langCode,
  };

  // Optimistic update so language-dependent UI (past lessons, tab counters,
  // etc.) starts refreshing immediately, without waiting for the
  // saveUserDetails + getUserDetails round-trips.
  setUserDetails(newUserDetails);
  LocalStorage.setUserInfo(newUserDetails);
  saveSharedUserInfo(newUserDetails);

  api.saveUserDetails(
    newUserDetails,
    () => {
      // Save failed — roll back so the UI matches what the server still has.
      setUserDetails(previousUserDetails);
      LocalStorage.setUserInfo(previousUserDetails);
      saveSharedUserInfo(previousUserDetails);
      if (onDone) onDone();
    },
    async () => {
      const freshUserDetails = await api.getUserDetails();
      setUserDetails(freshUserDetails);
      LocalStorage.setUserInfo(freshUserDetails);
      saveSharedUserInfo(freshUserDetails);
      if (onDone) onDone();
    },
  );
}
