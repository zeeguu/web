import React from "react";
import strings from "../i18n/definitions";
import * as s from "./StudentInfoLine.sc";

export default function StudentInfoLineHeader() {
  return (
    <s.StudentInfoLine>
      <div className="wrapper" id="header">
        <div className="sideline-header">
          <div className="text-box" id="header">
            <p className="student-name-header">
              <br />
              {strings.studentName}
            </p>
          </div>
          <p className="progress-bar" id="header">
            <br />
            {strings.readingExerciseTime}
          </p>
          <div className="number-display-wrapper" id="header">
            <p className="number-display-header">
              <br />
              {strings.text} <br /> {strings.lengthOnText}
            </p>
            <p className="number-display-header">
              <br />
              {strings.levelOfText}
              {"-"} <br /> {strings.textLevel}
            </p>
            <p className="number-display-header">
              <br /> {strings.exercisesCorrect}
              <br /> {strings.onFirstAttempt} <br />
            </p>
          </div>
        </div>
      </div>
    </s.StudentInfoLine>
  );
}
