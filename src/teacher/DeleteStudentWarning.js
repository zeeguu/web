import React from "react";
import strings from "../i18n/definitions";
import { StyledButton, PopupButtonWrapper } from "./TeacherButtons.sc";
import { StyledDialog } from "./StyledDialog.sc";

const DeleteStudentWarning = ({
  studentName,
  setShowDeleteStudentWarning,
  removeStudent,
}) => {
  return (
    <StyledDialog
      aria-label="Delete student warning"
      onDismiss={() => setShowDeleteStudentWarning(false)}
      max_width="625px"
    >
      <div className="centered">
        <h1>{strings.dangerzone}</h1>
        <p>
          {strings.wishToDeleteStudent} <b>{studentName}</b>{" "}
          {strings.fromTheClass}
        </p>
        <p>{strings.howStudentsRejoinClass}</p>
      </div>
      <PopupButtonWrapper>
        <StyledButton secondary onClick={removeStudent}>
          {strings.remove}
        </StyledButton>
        <StyledButton
          primary
          onClick={() => setShowDeleteStudentWarning(false)}
        >
          {strings.cancel}
        </StyledButton>
      </PopupButtonWrapper>
    </StyledDialog>
  );
};
export default DeleteStudentWarning;
