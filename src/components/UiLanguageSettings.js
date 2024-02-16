import React, { useEffect } from "react";
import uiLanguages from "../assorted/uiLanguages";
import LocalStorage from "../assorted/LocalStorage";

import strings from "../i18n/definitions";
import * as s from "./UiLanguageSettings.sc";

export default function UiLanguageSettings({ uiLanguage, setUiLanguage }) {
  useEffect(() => {
    let language = LocalStorage.getUiLanguage();
    if (language === undefined) {
      language = uiLanguages[1];
    }
    setUiLanguage(language);
    // eslint-disable-next-line 
  }, []);

  function onChange(language) {
    setUiLanguage(language);
    LocalStorage.setUiLanguage(language);
    strings.setLanguage(language.code);
  }

  return (
    <div>
      {uiLanguage &&
        uiLanguages.map((lang, index) => (
          <s.Container 
            key={index}
            htmlFor={lang.name}>
            <s.Icon
              src={
                uiLanguage.name === lang.name
                  ? lang.selectedIcon
                  : lang.deselectedIcon
              }
            />
            {lang.name}
            <s.Option
              type="radio"
              id={lang.name}
              name={"language"}
              onChange={() => {
                onChange(lang);
              }}
            />
          </s.Container>
        ))}
    </div>
  );
}
