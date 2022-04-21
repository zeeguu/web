import { useEffect } from "react";
import { defaultUILanguage } from "../uiLanguages";
import LocalStorage from "../LocalStorage";
import strings from "../../i18n/definitions";

// Mircea; extracted here behavior that was added by Bjorn
// to support multiple languages in the UI;
// the useEffect initializes the UI language with a default 'en'
// not very clear why this is a hook and not a simple function

export default function useUILanguage() {
  if (LocalStorage.getUiLanguage() === undefined) {
    LocalStorage.setUiLanguage(defaultUILanguage);
  }

  useEffect(() => {
    strings.setLanguage(LocalStorage.getUiLanguage().code);
    // eslint-disable-next-line
  }, []);
}
