import { Fragment, useState, useEffect, useContext } from "react";
import strings from "../../i18n/definitions";
import { Listbox, ListboxOption } from "@reach/listbox";
import * as s from "../styledComponents/TitleInput.sc";
import { APIContext } from "../../contexts/APIContext";

export function LanguageSelector(props) {
  const api = useContext(APIContext);
  const [languages, setLanguages] = useState([]);
  useEffect(() => {
    api.getSystemLanguages((languages) =>
      setLanguages(languages.learnable_languages),
    );
    //eslint-disable-next-line
  }, []);

  return (
    <Fragment>
      <s.LabeledInputFields>
        <div className="input-container">
          <label htmlFor="language_code"></label>
          {props.children}
          <Listbox
            className="input-field"
            id="language_code"
            aria-labelledby="language_code"
            value={props.value}
            onChange={props.onChange}
          >
            <ListboxOption value="default">
              {strings.chooseLanguage}
            </ListboxOption>
            {languages.map((language) => (
              <ListboxOption key={language.code} value={language.code}>
                {strings[language.name.toLowerCase()]}
              </ListboxOption>
            ))}
          </Listbox>
        </div>
      </s.LabeledInputFields>
    </Fragment>
  );
}

export const languageMap = {
  German: "de",
  Spanish: "es",
  French: "fr",
  Dutch: "nl",
  English: "en",
  Italian: "it",
  Chinese: "zh-CN",
  Danish: "da",
  Turkish: "tr",
  Arabic: "ar",
  Somali: "so",
  Kurdish: "ku",
  Swedish: "sv",
  Russian: "ru",
};
