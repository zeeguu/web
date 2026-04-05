import LocalStorage from "../assorted/LocalStorage";
import { saveSharedUserInfo } from "./cookies/userInfo";

export function switchLanguage(api, userDetails, setUserDetails, langCode, onDone) {
  if (langCode === userDetails.learned_language) return;

  const newUserDetails = {
    ...userDetails,
    learned_language: langCode,
  };

  api.saveUserDetails(newUserDetails, () => {}, async () => {
    const freshUserDetails = await api.getUserDetails();
    setUserDetails(freshUserDetails);
    LocalStorage.setUserInfo(freshUserDetails);
    saveSharedUserInfo(freshUserDetails);
    if (onDone) onDone();
  });
}
