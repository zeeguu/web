import React, { useEffect, useState } from "react";
import danSelected from "./icons/dan-selected.png";
import danDeselected from "./icons/dan-deselected.png";
import engSelected from "./icons/eng-selected.png";
import engDeselected from "./icons/eng-deselected.png";

import strings from "../i18n/definitions";
import * as s from './LanguageSettings.sc'

export default function LanguageSettings ({ updateApp }) {
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

  const [language, setLanguage] = useState();

  useEffect(() => {
    const language = JSON.parse(localStorage.getItem("systemLanguage"));
    setLanguage(language);
  }, []);

  useEffect(() => {
    if (language !== undefined) {
      strings.setLanguage(language.code);
      // console.log(language,"===", languages[0], "is", language.name.toLowerCase() === languages[0].name)
      updateApp();
    }
  }, [language]);

  function capitalize(str) {
    return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
  }

  function onChange({name, code}) {
    setLanguage({name: name, code: code});
    // console.log("logging: ",{name: name, code: code})
    console.log("logging: ",JSON.stringify({name: name, code: code}))
    localStorage.setItem("systemLanguage", JSON.stringify({name: name, code: code}));
    const item = JSON.parse(localStorage.getItem('systemLanguage'));
    console.log("THIS ONE!:",item)

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
};