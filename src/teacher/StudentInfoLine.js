import React, { useEffect, useState } from "react";
import strings from "../i18n/definitions";
import { Link } from "react-router-dom";
import { MdHighlightOff } from "react-icons/md/";
import StudentActivityBar from "./StudentActivityBar";
import { StyledButton } from "./TeacherButtons.sc";
import DeleteStudentWarning from "./DeleteStudentWarning";
import * as s from "./StudentInfoLine.sc";
import LocalStorage from "../assorted/LocalStorage";

//localize everything on this page 
//STRINGS

export default function StudentInfoLine({
  api,
  cohortID,
  student,
  setForceUpdate,
  isFirst
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
        console.log("Activity:")
        console.log(studentActivityData)
        setActivity(studentActivityData);
      },
      (res) => console.log(res)
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
      <div className="wrapper" >
        <Link
          to={`/teacher/classes/viewStudent/${student.id}/class/${cohortID}`}
        >

          <div className="sideline">

            <div className="text-box">
              {isFirst && <p className="head-title">Student name</p>
              }
              <div className="left-line">
                <div className="name-activity-wrapper">
                  <div className="student-name">{student.name}</div>
                  <div className="student-email">{student.email}</div>
                  <div className="activity-count">
                    {activity.number_of_texts} {strings.textsRead}
                  </div>
                  <div className="activity-count">
                    {activity.practiced_words_count} {strings.exercisesCompleted}
                  </div>
                </div>
              </div>
            </div>

            <div classname="title-progress-bar-wrapper">
              <div className="progress-bar-wrapper">
                {isFirst && <p className="head-title">Reading/Exercise time</p>
                }
                <StudentActivityBar isFirst={isFirst} student={student} />
              </div>
            </div>

            <div className="number-display-wrapper">

              <div className="title-circle-wrapper">
                {isFirst && <p className="head-title">Text <br /> length</p>
                }
                <div className="number-display">
                  {activity.average_text_length}
                </div>
              </div>

              <div className="title-circle-wrapper">
                {isFirst && <p className="head-title">Avg text difficulty</p>
                }
                <div className="number-display">
                  {activity.average_text_difficulty}
                </div>
              </div>

              <div className="title-circle-wrapper">
                {isFirst && <p className="head-title">Exercises correctness</p>
                }
                <div className="number-display">
                  {activity.correct_on_1st_try * 100 + "%"}
                </div>
              </div>
            </div>
          </div>

        </Link>
        <StyledButton
          isFirst={isFirst}
          icon
          style={{ marginTop: "15px", marginLeft: "25px" }}
          onClick={() => setShowDeleteStudentWarning(true)}
        >
          <MdHighlightOff size={35} />
        </StyledButton>
      </div>
      {
        showDeleteStudentWarning && (
          <DeleteStudentWarning
            studentName={student.name}
            cohortID={cohortID}
            removeStudent={removeStudentFromCohort}
            setShowDeleteStudentWarning={setShowDeleteStudentWarning}
          />
        )
      }
    </s.StudentInfoLine >
  );
}
