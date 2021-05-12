import React from "react";
import * as s from "./StudentInfoLine.sc";

export default function StudentInfoLineHeader() {
  return (
    <s.StudentInfoLine>
      <div className="wrapper" id="header">
        <div className="sideline-header">
          <div className="text-box" id="header">
            <p className="student-name-header"><br/>STRINGS <br/>Student name</p>
          </div>
          <p className="progress-bar" id="header"><br/>STRINGS<br/>Reading/Exercise time</p>
          <div className="number-display-wrapper" id="header">
            <p className="number-display-header">
            STRINGS <br/>average <br /> text length 
            </p>
            <p className="number-display-header">
            STRINGS <br/>average <br /> text level
            </p>
            <p className="number-display-header">
            STRINGS <br/> exercises correct <br/> on 1st attempt <br />
            </p>
          </div>
        </div>
      </div>
    </s.StudentInfoLine>
  );
}
