import React, { Fragment, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import StudentInfoLine from "./StudentInfoLine";
import StudentInfoLineHeader from "./StudentInfoLineHeader";
import { StyledButton, TopButtonWrapper } from "./TeacherButtons.sc";
import * as s from "../components/ColumnWidth.sc";
import * as sc from "../components/TopTabs.sc";
import HowToAddStudentsInfo from "./HowToAddStudentsInfo";

export default function StudentsActivityOverview({ api }) {
  const cohortID = useParams().cohortID;
  const [cohort, setCohort] = useState("");
  const studentID = "StudentName(HARDCODED)";
  const [showAddStudentsInfo, setShowAddStudentsInfo] = useState(false);

  //Extracting the cohort data for the page title and deleting students from the cohort.
  useEffect(() => {
    api.getCohortsInfo((res) => {
      const currentCohortArray = res.filter((cohort) => cohort.id === cohortID);
      setCohort(currentCohortArray[0]);
    });
    //eslint-disable-next-line
  }, []);

  return (
    <Fragment>
      <s.WidestColumn>
        <sc.TopTabs>
          <h1>{cohort.name}</h1>
        </sc.TopTabs>
        <div>
          <TopButtonWrapper>
            <Link to="/teacher/texts/AddTextOptions">
              <StyledButton secondary>STRINGS Add text</StyledButton>
            </Link>
            <StyledButton
              secondary
              onClick={() => setShowAddStudentsInfo(true)}
            >
              STRINGS Add students
            </StyledButton>
          </TopButtonWrapper>
          <StudentInfoLineHeader/>
          <StudentInfoLine cohortID={cohortID} studentID={studentID} />
          <StudentInfoLine cohortID={cohortID} studentID={studentID} />
        </div>
      </s.WidestColumn>
      {showAddStudentsInfo && (
        <HowToAddStudentsInfo
          setShowAddStudentInfo={setShowAddStudentsInfo}
          inviteCode={cohort.inv_code}
        />
      )}
    </Fragment>
  );
}
