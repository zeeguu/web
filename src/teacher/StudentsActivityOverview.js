import React, { Fragment, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import StudentInfoLine from "./StudentInfoLine";
import StudentInfoLineHeader from "./StudentInfoLineHeader";
import { StyledButton, TopButtonWrapper } from "./TeacherButtons.sc";
import * as s from "../components/ColumnWidth.sc";
import * as sc from "../components/TopTabs.sc";
import HowToAddStudentsInfo from "./HowToAddStudentsInfo";
import { transformStudents } from "./teacherApiHelpers";
import NoStudents from "./NoStudents";
import TimeSelector from "./TimeSelector";

export default function StudentsActivityOverview({ api }) {
  const cohortID = useParams().cohortID;
  const [cohort, setCohort] = useState("");
  const [students, setStudents] = useState([]);
  const [chosenTimePeriod, setChosenTimePeriod] = useState(30);
  const [showAddStudentsInfo, setShowAddStudentsInfo] = useState(false);

  useEffect(() => {
    api.getStudents(cohortID, chosenTimePeriod, (res) => {
      const studentWithNeededData = transformStudents(res);
      setStudents(studentWithNeededData);
    });
    //eslint-disable-next-line
  }, [chosenTimePeriod]);

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
          {students.length === 0 ? (
            <NoStudents inviteCode={cohort.inv_code} />
          ) : (
            <>
              <TimeSelector
                chosenTimePeriod={chosenTimePeriod}
                setChosenTimePeriod={setChosenTimePeriod}
              />
              <StudentInfoLineHeader />
              {students.map((student) => (
                <StudentInfoLine
                  key={student.id}
                  api={api}
                  cohortID={cohortID}
                  student={student}
                />
              ))}
            </>
          )}
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
