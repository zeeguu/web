import { Fragment } from "react";
import { Listbox, ListboxOption } from "@reach/listbox";
import * as s from "./LabeledInputFields.sc";

export function LanguageSelector(props) {
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
            {/* <ListboxOption value="zh-CN">Chinese STRINGS</ListboxOption> This language does not work yet*/} 
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
