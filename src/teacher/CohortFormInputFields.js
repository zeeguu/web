import React, { Fragment } from "react";
import { Listbox, ListboxOption } from "@reach/listbox";
import "@reach/listbox/styles.css";

import { TextField } from "@material-ui/core";

export const CohortNameTextfield = ({ value, onChange }) => {
  return (
    <Fragment>
      <label htmlFor="cohort_name">Choose the class name STRINGS</label>
      <TextField
        value={value}
        onChange={onChange}
        name="cohort_name"
        id="cohort_name"
        placeholder="  ex: 'B-level 2021'"
        fullWidth
        type="text"
        required
        style={{
          border: "solid 2px #4492b3",
          borderRadius: 5,
          marginTop: 10,
          marginBottom: 10,
        }}
      />
    </Fragment>
  );
};

export const InviteCodeTextfield = ({ value, onChange }) => {
  return (
    <Fragment>
      <label htmlFor="invite_code">Choose an invitecode STRINGS</label>
      <TextField
        value={value}
        onChange={onChange}
        name="invite_code"
        id="invite_code"
        placeholder="  ex. 'L34n1ng4u'"
        fullWidth
        type="text"
        required
        style={{
          border: "solid 2px #4492b3",
          borderRadius: 5,
          marginTop: 10,
          marginBottom: 10,
        }}
      />
    </Fragment>
  );
};

export function LanguageSelector({ value, onChange }) {
  return (
    <Fragment>
      <label htmlFor="language_id"></label>
        Choose the classroom language STRINGS
      <Listbox
        id="language_id"
        style={{
          border: "solid 2px #4492b3",
          borderRadius: 5,
          marginTop: 10,
          marginBottom: 10,
          minWidth: "99%",
        }}
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
