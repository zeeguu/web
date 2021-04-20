import {Fragment} from "react";
import { Listbox, ListboxOption } from "@reach/listbox";
import * as s from "./LabeledInputFields.sc";

export function LanguageSelector({ value, onChange }) {
    return (
      <Fragment>
        <s.LabeledInputFields>
          <div className="input-container">
            <label htmlFor="language_code"></label>
            Choose the classroom language STRINGS
            <Listbox
              className="input-field"
              id="language_code"
              aria-labelledby="language_code"
              value={value}
              onChange={onChange}
            >
              <ListboxOption value="zh-CN">Chinese STRINGS</ListboxOption>
              <ListboxOption value="da">Danish STRINGS</ListboxOption>
              <ListboxOption value="nl">Dutch STRINGS</ListboxOption>
              <ListboxOption value="en">English STRINGS</ListboxOption>
              <ListboxOption value="fr">French STRINGS</ListboxOption>
              <ListboxOption value="de">German STRINGS</ListboxOption>
              <ListboxOption value="it">Italian STRINGS</ListboxOption>
              <ListboxOption value="es">Spanish STRINGS</ListboxOption>
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