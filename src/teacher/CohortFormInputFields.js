import React, { Fragment } from "react";
import { LabeledTextfield } from "./LabeledTextField";
import { Listbox, ListboxOption } from "@reach/listbox";
import * as s from "./CohortFormInputFields.sc";

export const CohortNameTextfield = ({ value, onChange }) => {
  return (
    <LabeledTextfield
      value={value}
      onChange={onChange}
      name="cohort_name"
      placeholder="ex. 'B-level 2021'"
    >
      Choose the class name STRINGS
    </LabeledTextfield>
  );
};

export const InviteCodeTextfield = ({ value, onChange }) => {
  return (
    <LabeledTextfield
      value={value}
      onChange={onChange}
      name="invite_code"
      placeholder="ex. 'L34n1ng4u'"
    >
      Choose an invitecode STRINGS
    </LabeledTextfield>
  );
};

export function LanguageSelector({ value, onChange }) {
  return (
    <Fragment>
      <s.CohortFormInputFields>
        <div className="input-container">
          <label htmlFor="language_id"></label>
          Choose the classroom language STRINGS
          <Listbox
            className="input-field"
            id="language_id"
            aria-labelledby="language_id"
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
      </s.CohortFormInputFields>
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
