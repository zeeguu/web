import React from "react";
import strings from "../../../i18n/definitions";
import { StyledDialog } from "../../styledComponents/StyledDialog.sc";
import { PopupButtonWrapper, StyledButton } from "../../styledComponents/TeacherButtons.sc";

const HowToAddStudentsInfo = ({ setShowAddStudentInfo, inviteCode }) => {
  return (
    <StyledDialog
      onDismiss={() => setShowAddStudentInfo(false)}
      aria-label="How to add student information"
      max_width="525px"
    >
      <div className="centered">
        <h1>{strings.addStudents}</h1>
        <p>{strings.shareInviteCode}</p>
        <p className="bold-blue">{inviteCode}</p>
        <p>{strings.invitecodeInformation}</p>
      </div>
      <PopupButtonWrapper>
        <StyledButton primary onClick={() => setShowAddStudentInfo(false)}>
          {strings.goToClass}
        </StyledButton>
      </PopupButtonWrapper>
    </StyledDialog>
  );
};
export default HowToAddStudentsInfo;
