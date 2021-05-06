import React from "react";
import { StyledDialog } from "./StyledDialog.sc";
import { PopupButtonWrapper, StyledButton } from "./TeacherButtons.sc";

const HowToAddStudentsInfo = ({ setShowAddStudentInfo, inviteCode }) => {
  return (
    <StyledDialog
    onDismiss={() => setShowAddStudentInfo(false)}
    aria-label="How to add student information"
    max_width="525px"
    >
      <div className="centered">  
      <h1>Add Students STRINGS</h1>
      <p>Share this code with your students to invite them to the class:</p>
      <p className="bold-blue">{inviteCode}</p>
      <p>Students will not appear in the class until they have signed up for Zeeguu and used the invite code. STRINGS</p>
      </div>
      <PopupButtonWrapper>
        <StyledButton primary onClick={() => setShowAddStudentInfo(false)}>
          Go to class STRINGS
        </StyledButton>
      </PopupButtonWrapper>
    </StyledDialog>
  );
};
export default HowToAddStudentsInfo;