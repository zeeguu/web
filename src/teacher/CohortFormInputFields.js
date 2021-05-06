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
      {value.length <= 20 ? (
        "Choose the class name (max. 20 characters)STRINGS"
      ) : (
        <p style={{ color: "red" }}>The class name is too long. STRINGS</p>
      )}
    </LabeledTextField>
  );
};

export const InviteCodeTextField = ({ value, onChange }) => {
  return (
    <LabeledTextField
      value={value}
      onChange={onChange}
      name="invite_code"
      placeholder="eg. 'L34n!ng'"
    >
      {value.length <= 20 ? (
        "Create any invite code you like (max. 20 characters)STRINGS"
      ) : (
        <p style={{ color: "red" }}>The invite code is too long. STRINGS</p>
      )}
    </LabeledTextField>
  );
};
