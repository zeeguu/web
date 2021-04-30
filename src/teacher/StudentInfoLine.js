import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdHighlightOff } from "react-icons/md/";
import ProgressBar from "./ProgressBar";
import { PopupButtonWrapper, StyledButton } from "./TeacherButtons.sc";
import { StyledDialog } from "./StyledDialog.sc";
import * as s from "./StudentInfoLine.sc";

export default function StudentInfoLine({ api, cohortID, student }) {
  const [isOpen, setIsOpen] = useState(false);

  const exerciseArray = student.exercise_time_list.filter((time) => time !== 0);
  const exerciseCount = exerciseArray.length ? exerciseArray.length : 0;
  const readingList = student.reading_time_list.filter((time) => time !== 0);
  const readingCount = readingList.length ? readingList.length : 0;

  return (
    <s.StudentInfoLine>
      <div className="wrapper">
        <Link
          to={`/teacher/classes/viewStudent/${student.id}/class/${cohortID}`}
        >
          <div className="sideline">
            <div className="text-box">
              <div className="student-name">{student.name}</div>
              <div className="activity-count">
                {readingCount} texts read STRINGS
              </div>
              <div className="activity-count">
                {exerciseCount} exercise sessions completed STRINGS
              </div>
            </div>

            <div className="progress-bar">
              <ProgressBar api={api} student={student} />
            </div>
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
            <p>
              Do you wish to delete <b>{student.name}</b> from the class?
            </p>
          </div>
          <PopupButtonWrapper>
            <StyledButton secondary>Delete STRINGS</StyledButton>
            <StyledButton primary onClick={() => setIsOpen(false)}>
              Cancel STRINGS
            </StyledButton>
          </PopupButtonWrapper>
        </StyledDialog>
      )}
    </s.StudentInfoLine>
  );
}
