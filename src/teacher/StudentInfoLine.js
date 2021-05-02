import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdHighlightOff } from "react-icons/md/";
import ProgressBar from "./ProgressBar";
import { StyledButton } from "./TeacherButtons.sc";
import DeleteStudentWarning from "./DeleteStudentWarning";
import * as s from "./StudentInfoLine.sc";

export default function StudentInfoLine({ api, cohortID, student }) {
  const [showDeleteStudentWarning, setShowDeleteStudentWarning] = useState(false);

  const exerciseArray = student.exercise_time_list.filter((time) => time !== 0);
  const exerciseCount = exerciseArray.length ? exerciseArray.length : 0;
  const readingList = student.reading_time_list.filter((time) => time !== 0);
  const readingCount = readingList.length ? readingList.length : 0;

  const deleteStudent = () =>{
    //TODO api call to delete student from cohort goes here. - Waiting for endpoint.
    console.log("Should be deleting student "+ student.name + " from the "+ cohortID +" in the api now...")
    setShowDeleteStudentWarning(false)
  }

  //TODO We still need to extract avg text length and level and ecxercise correctness from the api. - Waiting for endpoint.

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
          onClick={() => setShowDeleteStudentWarning(true)}
        >
          <MdHighlightOff size={35} />
        </StyledButton>
      </div>
      {showDeleteStudentWarning && (
        <DeleteStudentWarning 
        studentName={student.name}
        cohortID={cohortID}
        deleteStudent={deleteStudent}
        setShowDeleteStudentWarning={setShowDeleteStudentWarning}
        />
      )}
    </s.StudentInfoLine>
  );
}
