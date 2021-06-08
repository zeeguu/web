import React, { useEffect } from "react";
import danSelected from "./icons/dan-selected.png";
import danDeselected from "./icons/dan-deselected.png";
import engSelected from "./icons/eng-selected.png";
import engDeselected from "./icons/eng-deselected.png";
import LocalStorage from "../assorted/LocalStorage";

import strings from "../i18n/definitions";
import * as s from "./LanguageSettings.sc";

export default function LanguageSettings({ language, setLanguage }) {
  const languages = [
    {
      name: "dansk",
      code: "da",
      selectedIcon: danSelected,
      deselectedIcon: danDeselected,
    },
    {
      name: "english",
      code: "en",
      selectedIcon: engSelected,
      deselectedIcon: engDeselected,
    },
  ];

  useEffect(() => {
    let language = LocalStorage.getUiLanguage();
    if (language === undefined) {
      language = languages[1];
    }
    setLanguage(language);
  }, []);

  function capitalize(str) {
    return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
  }

  function onChange({ name, code }) {
    setLanguage({ name: name, code: code });
    // console.log("logging: ",{name: name, code: code})
    LocalStorage.setUiLanguage({ name: name, code: code });
    strings.setLanguage(code);

  }

  return (
    <div>
      {language &&
        languages.map((lang) => (
          <s.Container htmlFor={lang.name}>
            <s.Icon
              src={
                language.name.toLowerCase() === lang.name
                  ? lang.selectedIcon
                  : lang.deselectedIcon
              }
            />
            {capitalize(lang.name)}
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
