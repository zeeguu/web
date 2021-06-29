import { useState, useEffect } from "react";
import LocalStorage from "../LocalStorage";
import strings from "../../i18n/definitions";

// Mircea; extracted here behavior that was added by Bjorn
// to support multiple languages in the UI;
// the useEffect initializes the UI language with a default 'en'

export default function useUILanguage() {
  const [uiLanguage, setUiLanguage] = useState(LocalStorage.getUiLanguage());

  useEffect(() => {
    const uiLang = LocalStorage.getUiLanguage();
    if (uiLang === undefined) {
      LocalStorage.setUiLanguage({ code: "en" });
    }
    strings.setLanguage(uiLang.code);
    setUiLanguage(uiLang);
  }, []);
}
