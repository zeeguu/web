import { useState, useEffect } from "react";
import { defaultUILanguage } from "../uiLanguages";
import LocalStorage from "../LocalStorage";
import strings from "../../i18n/definitions";

// Mircea; extracted here behavior that was added by Bjorn
// to support multiple languages in the UI;
// the useEffect initializes the UI language with a default 'en'

export default function useUILanguage() {
  if (LocalStorage.getUiLanguage() === undefined) {
    LocalStorage.setUiLanguage(defaultUILanguage);
  }

  const [uiLanguage, setUiLanguage] = useState(LocalStorage.getUiLanguage());

  useEffect(() => {
    strings.setLanguage(uiLanguage.code);
  }, []);
}
