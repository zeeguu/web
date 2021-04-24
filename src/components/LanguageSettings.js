import React, { useEffect, useState } from "react";
import danSelected from "./icons/dan-selected.png";
import danDeselected from "./icons/dan-deselected.png";
import engSelected from "./icons/eng-selected.png";
import engDeselected from "./icons/eng-deselected.png";

import strings from "../i18n/definitions";

import styled from "styled-components";

const Option = styled.input`
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
`;

const Icon = styled.img`
  width: 30px;
  height: auto;
  margin-right: 4px;
`;

const Container = styled.label`
  cursor: pointer;
  display: flex;
  align-items: center;
`;

export default ({ useForceUpdate }) => {
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

  // localStorage.setItem("systemLanguage", JSON.stringify(languages[0]));
  const [language, setLanguage] = useState();

  useEffect(() => {
    const language = JSON.parse(localStorage.getItem("systemLanguage"));
    setLanguage(language);
  }, []);

  useEffect(() => {
    if (language) {
      strings.setLanguage(language.code);
      useForceUpdate();
    }
  }, [language]);

  function capitalize(str) {
    return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
  }

  function onChange(lang) {
    setLanguage(lang);
    localStorage.setItem("systemLanguage", JSON.stringify(lang));
  }

  return (
    <div>
      {language &&
        languages.map((lang) => (
          <Container htmlFor={lang.name}>
            <Icon
              src={
                language.name === lang.name
                  ? lang.selectedIcon
                  : lang.deselectedIcon
              }
            />
            {capitalize(lang.name)}
            <Option
              type="radio"
              id={lang.name}
              name={"language"}
              onChange={() => {
                onChange(lang);
              }}
            />
          </Container>
        ))}
    </div>
  );
};
