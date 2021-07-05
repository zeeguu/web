import { useState, useEffect } from "react";
import uiLanguages from "../uiLanguages";
import LocalStorage from "../LocalStorage";
import strings from "../../i18n/definitions";

// Mircea; extracted here behavior that was added by Bjorn
// to support multiple languages in the UI;
// the useEffect initializes the UI language with a default 'en'

export default function useUILanguage() {
  let defaultUILanguage = uiLanguages[1];
  if (LocalStorage.getUiLanguage() !== undefined) {
    defaultUILanguage = LocalStorage.getUiLanguage();
  } else {
    LocalStorage.setUiLanguage(uiLanguages[1]);
  }
  const [uiLanguage, setUiLanguage] = useState(defaultUILanguage);

  useEffect(() => {
    strings.setLanguage(uiLanguage.code);
  }, []);
}
