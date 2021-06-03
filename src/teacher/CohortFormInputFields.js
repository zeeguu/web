import React from "react";
import strings from "../i18n/definitions";
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
        strings.chooseClassName
      ) : (
        <p style={{ color: "red" }}>{strings.classnameTooLong}</p>
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
        strings.createInviteCode
      ) : (
        <p style={{ color: "red" }}>{strings.invitecodeTooLong}</p>
      )}
    </LabeledTextField>
  );
};
