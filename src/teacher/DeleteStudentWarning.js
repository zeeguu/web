import React from "react";
import { StyledButton, PopupButtonWrapper } from "./TeacherButtons.sc";
import { StyledDialog } from "./StyledDialog.sc";

const DeleteStudentWarning = ({
  studentName,
  setShowDeleteStudentWarning,
  deleteStudent,
}) => {
  return (
    <StyledDialog
      aria-label="Delete student warning"
      onDismiss={() => setShowDeleteStudentWarning(false)}
      max_width="625px"
    >
      <div className="centered">
        <h1>Danger zone!</h1>
        <p>
          Do you wish to delete <b>{studentName}</b> from the class?
        </p>
      </div>
      <PopupButtonWrapper>
        <StyledButton secondary onClick={deleteStudent}>Delete STRINGS</StyledButton>
        <StyledButton primary onClick={() => setShowDeleteStudentWarning(false)}>
          Cancel STRINGS
        </StyledButton>
      </PopupButtonWrapper>
    </StyledDialog>
  );
};
export default DeleteStudentWarning;
