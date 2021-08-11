import React from "react";
import strings from "../i18n/definitions";
import { LabeledTextField } from "./LabeledInputFields";
import * as s from "./CohortFormInputFields.sc";

export const CohortNameTextField = ({ value, onChange }) => {
  return (
    <s.StyledCohortFormInputFields>
      <LabeledTextField
        value={value}
        onChange={onChange}
        name="cohort_name"
        placeholder="eg. 'B-level 2021'"
      >
        {value.length <= 20 ? (
          strings.chooseClassName
        ) : (
          <p className="class-name-warning">{strings.classnameTooLong}</p>
        )}
      </LabeledTextField>
    </s.StyledCohortFormInputFields>
  );
};

export const InviteCodeTextField = ({ value, onChange }) => {
  return (
    <s.StyledCohortFormInputFields>
      <LabeledTextField
        value={value}
        onChange={onChange}
        name="invite_code"
        placeholder="eg. 'L34n!ng'"
      >
        {value.length <= 20 ? (
          strings.createInviteCode
        ) : (
          <p className="class-name-warning">{strings.invitecodeTooLong}</p>
        )}
      </LabeledTextField>
    </s.StyledCohortFormInputFields>
  );
};
