import React from "react";
import strings from "../../../i18n/definitions";
import { Error } from "../../sharedComponents/Error";
import { TitleInput } from "../../sharedComponents/TitleInput";

export const CohortNameTextField = ({ value, onChange }) => {
  return (
    <TitleInput
      value={value}
      onChange={onChange}
      name="cohort_name"
      placeholder="eg. 'B-level 2021'"
    >
      {value.length <= 20 ? (
        strings.chooseClassName
      ) : (
        <Error message={strings.classnameTooLong} />
      )}
    </TitleInput>
  );
};

export const InviteCodeTextField = ({ value, onChange }) => {
  return (
    <TitleInput
      value={value}
      onChange={onChange}
      name="invite_code"
      placeholder="eg. 'L34n!ng'"
    >
      {value.length <= 20 ? (
        strings.createInviteCode
      ) : (
        <Error message={strings.invitecodeTooLong} />
      )}
    </TitleInput>
  );
};
