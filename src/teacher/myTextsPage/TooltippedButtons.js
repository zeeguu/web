import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import strings from "../../i18n/definitions";
import { StyledButton } from "../styledComponents/TeacherButtons.sc";
import { StyledTooltip } from "../styledComponents/StyledTooltip.sc";

export const ViewAsStudentButton = ({ articleID, disabled, isNew }) => {
  const text = isNew
    ? strings.saveTextBeforeViewAsStudent
    : strings.saveChangesBeforeViewAsStudent;

  return (
    <Fragment>
      {disabled ? (
        <StyledTooltip label={text}>
          <Link to={`/teacher/texts/editText/${articleID}/studentView`}>
            <StyledButton secondary disabled={disabled}>
              {strings.viewAsStudent}
            </StyledButton>
          </Link>
        </StyledTooltip>
      ) : (
        <Link to={`/teacher/texts/editText/${articleID}/studentView`}>
          <StyledButton secondary disabled={disabled}>
            {strings.viewAsStudent}
          </StyledButton>
        </Link>
      )}
    </Fragment>
  );
};

export const ShareWithClassesButton = ({ onclick, disabled, isNew }) => {
  const text = isNew
    ? strings.textMustBeSavedBeforeSharing
    : strings.changesMustBeSavedBeforeSharing;

  return (
    <Fragment>
      {disabled ? (
        <StyledTooltip label={text}>
          <StyledButton secondary onClick={onclick} disabled={disabled}>
            {strings.addToClass}
          </StyledButton>
        </StyledTooltip>
      ) : (
        <StyledButton secondary onClick={onclick} disabled={disabled}>
          {strings.addToClass}
        </StyledButton>
      )}
    </Fragment>
  );
};
