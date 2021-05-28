import { Fragment, useState, useEffect } from "react";
import { Listbox, ListboxOption } from "@reach/listbox";
import * as s from "./LabeledInputFields.sc";

export function LanguageSelector(props) {
  const [languages, setLanguages] = useState([]);
  useEffect(() => {
    props.api.getSystemLanguages((languages) =>
      setLanguages(languages.learnable_languages)
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
              STRINGSChoose a language...
            </ListboxOption>
            {languages.map((language) => (
              <ListboxOption key={language.code} value={language.code}>
                {language.name}
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
};
