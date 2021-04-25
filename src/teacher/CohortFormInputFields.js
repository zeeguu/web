import React from "react";
import { LabeledTextField } from "./LabeledInputFields";

export const CohortNameTextField = ({ value, onChange }) => {
  return (
    <LabeledTextField
      value={value}
      onChange={onChange}
      name="cohort_name"
      placeholder="eg. 'B-level 2021'"
    >
      Choose the class name STRINGS
    </LabeledTextField>
  );
};

export const InviteCodeTextField = ({ value, onChange }) => {
  return (
    <LabeledTextField
      value={value}
      onChange={onChange}
      name="invite_code"
      placeholder="eg. 'L34n1ng4u'"
    >
      Create any invite code you like (max. 20 characters)STRINGS
    </LabeledTextField>
  );
};