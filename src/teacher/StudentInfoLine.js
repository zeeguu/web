import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdHighlightOff } from "react-icons/md/";
import StudentActivityBar from "./StudentActivityBar";
import { StyledButton } from "./TeacherButtons.sc";
import DeleteStudentWarning from "./DeleteStudentWarning";
import * as s from "./StudentInfoLine.sc";
import LocalStorage from "../assorted/LocalStorage";

export default function StudentInfoLine({ api, cohortID, student }) {
  const [showDeleteStudentWarning, setShowDeleteStudentWarning] =
    useState(false);
  const selectedTimePeriod = LocalStorage.selectedTimePeriod();
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    api.getStudentActivityOverview(
      student.id,
      selectedTimePeriod,
      cohortID,
      (res) => {
        console.log("studentAcitivity for " + student.name);
        console.log(res);
        setActivity(res);
      },
      (res) => console.log(res)
    );
    // eslint-disable-next-line
  }, [selectedTimePeriod]);

  const deleteStudent = () => {
    //TODO api call to delete student from cohort goes here. - Waiting for endpoint.
    console.log(
      "Should be deleting student " +
        student.name +
        " from the " +
        cohortID +
        " in the api now..."
    );
    setShowDeleteStudentWarning(false);
  };
  if (activity === null){
    return <p>Cannot find data for {student.name}...</p>
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
                {activity.number_of_texts} texts read STRINGS
              </div>
              <div className="activity-count">
                {activity.exercises_count} exercises completed STRINGS
              </div>
            </div>

            <div className="progress-bar">
              <StudentActivityBar
                student={student}
                readingTime={activity.reading_time}
                exerciseTime={activity.exercise_time_in_sec}
              />
            </div>
            <div className="number-display-wrapper">
              <div className="number-display">
                {activity.average_text_length}
              </div>
              <div className="number-display">
                {activity.average_text_difficulty}
              </div>
              <div className="number-display">
                {activity.correct_on_1st_try * 100 + "%"}
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
