import React, { useEffect, useState } from "react";
import strings from "../i18n/definitions";
import { Link } from "react-router-dom";
import { MdHighlightOff } from "react-icons/md/";
import StudentActivityBar from "./StudentActivityBar";
import { StyledButton } from "./TeacherButtons.sc";
import DeleteStudentWarning from "./DeleteStudentWarning";
import * as s from "./StudentInfoLine.sc";
import LocalStorage from "../assorted/LocalStorage";
import { StyledTooltip } from "./StyledTooltip.sc";

//localize everything on this page
//STRINGS

export default function StudentInfoLine({
  api,
  cohortID,
  student,
  setForceUpdate,
  isFirst,
}) {
  const [showDeleteStudentWarning, setShowDeleteStudentWarning] =
    useState(false);
  const selectedTimePeriod = LocalStorage.selectedTimePeriod();
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    api.getStudentActivityOverview(
      student.id,
      selectedTimePeriod,
      cohortID,
      (studentActivityData) => {
        setActivity(studentActivityData);
      },
      (error) => console.log(error)
    );
    // eslint-disable-next-line
  }, [selectedTimePeriod]);

  const removeStudentFromCohort = () => {
    api.removeStudentFromCohort(student.id, (res) => {
      setForceUpdate((prev) => prev + 1);
      setShowDeleteStudentWarning(false);
    });
  };

  if (activity === null) {
    return <p>Loading data for {student.name}...</p>;
  }

  return (
    <s.StudentInfoLine isFirst={isFirst}>
      <div className="wrapper">
        <Link
          to={`/teacher/classes/viewStudent/${student.id}/class/${cohortID}`}
        >
          <div className="sideline">
            <div className="text-box">
              {isFirst && (
                <p className="head-title" id="student">
                  {strings.studentName}
                </p>
              )}
              <div className="left-line">
                <div className="name-activity-wrapper">
                  <div className="student-name">
                    {student.name.length > 20
                      ? student.name.substring(0, 20) + "..."
                      : student.name}
                  </div>
                  <div className="student-email">{student.email}</div>
                  <div className="activity-count">
                    {activity.number_of_texts} {strings.textsRead}
                  </div>
                  <div className="activity-count">
                    {activity.number_of_exercises} {strings.exercisesCompleted}
                  </div>
                </div>
              </div>
            </div>
            <div className="title-progress-bar-wrapper">
              <div className="progress-bar-wrapper">
                {isFirst && (
                  <p className="head-title" id="reading-exercise-time">
                    {strings.readingExerciseTime}
                  </p>
                )}
                <StudentActivityBar isFirst={isFirst} student={student} />
              </div>
            </div>

            <div className="number-display-wrapper">
              <div className="title-circle-wrapper">
                {isFirst && (
                  <p className="head-title" id="length-level-correctness">
                    {strings.text} <br /> {strings.lengthOnText}
                  </p>
                )}
                <StyledTooltip label={strings.textLengthExplanation}>
                  <div className="number-display">
                    {activity.average_text_length}
                  </div>
                </StyledTooltip>
              </div>

              <div className="title-circle-wrapper">
                {isFirst && (
                  <p className="head-title" id="length-level-correctness">
                    {strings.avgText}
                    <br />
                    {strings.difficultyLowerCase}
                  </p>
                )}
                <StyledTooltip label={strings.difficultyExplanation}>
                  <div className="number-display">
                    {activity.average_text_difficulty/10}
                  </div>
                </StyledTooltip>
              </div>

              <div className="title-circle-wrapper">
                {isFirst && (
                  <p className="head-title" id="length-level-correctness">
                    {strings.exercisesCorrectness}
                  </p>
                )}
                <StyledTooltip label={strings.exercisesExplaination}>
                  <div className="number-display">
                    {Math.round(activity.correct_on_1st_try * 100) + "%"}
                  </div>
                </StyledTooltip>
              </div>
            </div>
          </div>
        </Link>
        <StyledButton
          isFirst={isFirst}
          icon
          deleteastudent
          style={{ marginTop: "15px", marginLeft: "10px" }}
          onClick={() => setShowDeleteStudentWarning(true)}
        >
          <MdHighlightOff size={35} />
        </StyledButton>
      </div>
      {showDeleteStudentWarning && (
        <DeleteStudentWarning
          studentName={student.name}
          cohortID={cohortID}
          removeStudent={removeStudentFromCohort}
          setShowDeleteStudentWarning={setShowDeleteStudentWarning}
        />
      )}
    </s.StudentInfoLine>
  );
}
