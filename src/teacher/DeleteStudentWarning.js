import React from "react";
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
        <h1>Danger zone! STRINGS</h1>
        <p>
          Do you wish to remove <b>{studentName}</b> from the class? STRINGS
        </p>
        <p>Students can rejoin the class if you give them the invite code again. STRINGS</p>
      </div>
      <PopupButtonWrapper>
        <StyledButton secondary onClick={removeStudent}>Remove STRINGS</StyledButton>
        <StyledButton primary onClick={() => setShowDeleteStudentWarning(false)}>
          Cancel STRINGS
        </StyledButton>
      </PopupButtonWrapper>
    </StyledDialog>
  );
};
export default DeleteStudentWarning;
