import React, { Fragment } from "react";
import { useParams, Link } from "react-router-dom";
import StudentInfoLine from "./StudentInfoLine";
import { StyledButton, TopButtonWrapper } from "./TeacherButtons.sc";
import * as s from "../components/ColumnWidth.sc";
import * as sc from "../components/TopTabs.sc";

export default function StudentsActivityOverview() {
  const cohortID = useParams().cohortID;
  //TODO We need a way to turn a cohortID into a cohort.name - maybe an api-call: api.getCohortName(cohortID){//returns the name of the cohort that has the cohortID}
  const studentID = "StudentName(HARDCODED)";
  return (
    <Fragment>
      <s.WideColumn>
        <sc.TopTabs>
          <h1>{cohortID}</h1>
        </sc.TopTabs>
        <div>
          <br />
          <br />
          <TopButtonWrapper>
            <Link to="/teacher/texts/AddTextOptions">
              <StyledButton primary>STRINGSAdd text</StyledButton>
            </Link>
            <StyledButton primary>STRINGAdd student</StyledButton>
          </TopButtonWrapper>
          <br />
          <br />
          <StudentInfoLine cohortID={cohortID} studentID={studentID} />
          <StudentInfoLine cohortID={cohortID} studentID={studentID} />
          <br />
          <br />
          ("Add student" and "X" will open a popup.)
        </div>
      </s.WideColumn>
    </Fragment>
  );
}
