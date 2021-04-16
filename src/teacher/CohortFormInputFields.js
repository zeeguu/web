import React, { Fragment } from "react";
import { Listbox, ListboxOption } from "@reach/listbox";
import * as s from "./CohortFormInputFields.sc";

import { TextField } from "@material-ui/core";

export const CohortNameTextfield = ({ value, onChange }) => {
  return (
    <Fragment>
      <s.CohortFormInputFields>
        <div className="input-container">
          <label htmlFor="cohort_name">Choose the class name STRINGS</label>
          <TextField
            className="input-field"
            aria-label="cohort_name"
            value={value}
            onChange={onChange}
            name="cohort_name"
            id="cohort_name"
            placeholder="  ex: 'B-level 2021'"
            fullWidth
            type="text"
            required
          />
        </div>
      </s.CohortFormInputFields>
    </Fragment>
  );
};

export const InviteCodeTextfield = ({ value, onChange }) => {
  return (
    <Fragment>
      <s.CohortFormInputFields>
        <div className="input-container">
          <label htmlFor="invite_code">Choose an invitecode STRINGS</label>
          <TextField
            className="input-field"
            aria-label="invite_code"
            value={value}
            onChange={onChange}
            name="invite_code"
            id="invite_code"
            placeholder="  ex. 'L34n1ng4u'"
            fullWidth
            type="text"
            required
          />
        </div>
      </s.CohortFormInputFields>
    </Fragment>
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
