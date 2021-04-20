import React from "react";
import { LabeledTextField } from "./LabeledInputFields";

export const CohortNameTextfield = ({ value, onChange }) => {
  return (
    <LabeledTextField
      value={value}
      onChange={onChange}
      name="cohort_name"
      placeholder="ex. 'B-level 2021'"
    >
      Choose the class name STRINGS
    </LabeledTextField>
  );
};

export const InviteCodeTextfield = ({ value, onChange }) => {
  return (
    <LabeledTextField
      value={value}
      onChange={onChange}
      name="invite_code"
      placeholder="ex. 'L34n1ng4u'"
    >
      Choose an invitecode STRINGS
    </LabeledTextField>
  );
};