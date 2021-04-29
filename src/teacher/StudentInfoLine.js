import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdHighlightOff } from "react-icons/md/";
import { PopupButtonWrapper, StyledButton } from "./TeacherButtons.sc";
import { StyledDialog } from "./StyledDialog.sc";
import * as s from "./StudentInfoLine.sc";

export default function StudentInfoLine(props) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <s.StudentInfoLine>
      <div className="wrapper">
        <Link
          to={`/teacher/classes/viewStudent/${props.studentID}/class/${props.cohortID}`}
        >
          <div className="sideline">
            <div className="text-box">
              <div className="student-name">Very Long Student Name Here</div>
              <div className="activity-count">x texts read STRINGS</div>
              <div className="activity-count">y exercises completed STRINGS</div>
            </div>
            <div className="progress-bar">PROGRESS-BAR HERE</div>
            <div className="number-display-wrapper">
              <div className="number-display">{/* avg-text-length */}123</div>
              <div className="number-display">{/* avg-text-level */}4.5</div>
              <div className="number-display">
                {/* exercise-correctness */}67%
              </div>
            </div>
          </div>
        </Link>
        <StyledButton
          icon
          style={{ marginTop: "15px", marginLeft: "25px" }}
          onClick={() => setIsOpen(true)}
        >
          <MdHighlightOff size={35} />
        </StyledButton>
      </div>
      {isOpen && (
        <StyledDialog
          aria-label="Delete student warning"
          onDismiss={() => setIsOpen(false)}
          max_width="625px"
        >
          <div className="centered">
            <h1>Danger zone!</h1>
            <p>Do you wish to delete <b>{props.studentID}</b> from the class?</p>
          </div>
            <PopupButtonWrapper>
              <StyledButton secondary>Delete STRINGS</StyledButton>
              <StyledButton primary onClick={()=>setIsOpen(false)}>Cancel STRINGS</StyledButton> 
            </PopupButtonWrapper>
        </StyledDialog>
      )}
    </s.StudentInfoLine>
  );
}
