import { Fragment, useState, useEffect, useContext } from "react";
import strings from "../../i18n/definitions";
import * as s from "../styledComponents/TitleInput.sc";
import { APIContext } from "../../contexts/APIContext";

export function LanguageSelector(props) {
  const api = useContext(APIContext);
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    api.getSystemLanguages((data) => {
      console.log("System languages response:", data);
      if (data && data.learnable_languages) {
        console.log("Setting languages to:", data.learnable_languages);
        setLanguages(data.learnable_languages);
      } else {
        console.error("No learnable_languages in response:", data);
      }
    });
    //eslint-disable-next-line
  }, []);

  console.log("LanguageSelector render - languages:", languages);
  console.log("LanguageSelector render - props.value:", props.value);

  return (
    <Fragment>
      <s.LabeledInputFields>
        <div className="input-container" style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'flex-end' }}>
          <label htmlFor="language_code">{props.children}</label>
          <select
            id="language_code"
            name="language_code"
            value={props.value || "default"}
            onChange={(e) => {
              console.log("Select onChange called with:", e.target.value);
              props.onChange(e.target.value);
            }}
            disabled={languages.length === 0}
            style={{
              padding: '0.5rem',
              borderRadius: '5px',
              border: '1px solid #ccc',
              fontSize: '1rem',
              minWidth: '200px',
              cursor: 'pointer'
            }}
          >
            <option value="default">
              {strings.chooseLanguage}
            </option>
            {languages.map((language) => (
              <option key={language.code} value={language.code}>
                {strings[language.name.toLowerCase()] || language.name}
              </option>
            ))}
          </select>
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
