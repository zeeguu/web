import { useParams, Link } from "react-router-dom";
import StudentInfoLine from "./StudentInfoLine";
import * as s from "../components/ColumnWidth.sc";
import * as sc from "../components/TopTabs.sc";
import { StyledButton, TopButton } from "./TeacherButtons.sc";
import React from "react";

export default function StudentsActivityOverview() {
  const cohortID = useParams().cohortID;
  //TODO We need a way to turn a cohortID into a cohort.name - maybe an api-call: api.getCohortName(cohortID){//returns the name of the cohort that has the cohortID}
  const studentID = "StudentName(HARDCODED)";
  return (
    <React.Fragment>
      <s.WideColumn>
        <sc.TopTabs>
          <h1>{cohortID}</h1>
        </sc.TopTabs>
        <div>
          <br />
          <br />
          <TopButton>
            <Link to="/teacher/texts/AddTextOptions">
              <StyledButton primary>STRINGSAdd text</StyledButton>
            </Link>
            <StyledButton primary>STRINGAdd student</StyledButton>
          </TopButton>
          <br />
          <br />
          <StudentInfoLine cohortID={cohortID} studentID={studentID}/>
          <StudentInfoLine cohortID={cohortID} studentID={studentID}/>
          <br />
          <br />
          ("Add student" and "X" will open a popup.)
        </div>
      </s.WideColumn>
    </React.Fragment>
  );
}
