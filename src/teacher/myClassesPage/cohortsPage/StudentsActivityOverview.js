import React, { Fragment, useContext, useEffect, useState } from "react";
import strings from "../../../i18n/definitions";
import { useParams, useHistory } from "react-router-dom";
import LocalStorage from "../../../assorted/LocalStorage";
import { transformStudents } from "./teacherApiHelpers";
import HowToAddStudentsInfo from "./HowToAddStudentsInfo";
import NoStudents from "./NoStudents";
import {
  StyledButton,
  TopButtonWrapper,
} from "../../styledComponents/TeacherButtons.sc";
import * as s from "../../../components/ColumnWidth.sc";
import LoadingAnimation from "../../../components/LoadingAnimation";
import StudentsActivityOverviewContent from "./StudentsActivityOverviewContent";
import { PageTitle } from "../../../components/PageTitle";
import { APIContext } from "../../../contexts/APIContext";

export default function StudentsActivityOverview() {
  const api = useContext(APIContext);
  const cohortID = useParams().cohortID;
  const [cohort, setCohort] = useState("");
  const [students, setStudents] = useState(null);

  // ML: when we'll find the time, we should fix this forceUpdate business...
  // eslint-disable-next-line
  const [forceUpdate, setForceUpdate] = useState(0);
  const selectedTimePeriod = LocalStorage.selectedTimePeriod();
  const [showAddStudentsInfo, setShowAddStudentsInfo] = useState(false);
  const history = useHistory();

  function updateShownStudents() {
    setStudents(null);
    api.getStudents(cohortID, selectedTimePeriod, (res) => {
      const studentWithNeededData = transformStudents(res);
      setStudents(studentWithNeededData);
    });
  }

  //Extracting the cohort data for the page title - for showing "no students" guidance and for deleting students from the cohort.
  useEffect(() => {
    api.getCohortsInfo((res) => {
      const currentCohortArray = res.filter((cohort) => cohort.id === cohortID);
      setCohort(currentCohortArray[0]);
    });
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    setStudents(null);
    updateShownStudents();
    //eslint-disable-next-line
  }, [selectedTimePeriod]);

  const removeStudentFromCohort = (studentID) => {
    api.removeStudentFromCohort(studentID, cohortID, (res) => {
      updateShownStudents();
    });
  };

  if (cohort === "" || students === null) {
    return <LoadingAnimation />;
  }

  return (
    <>
      <PageTitle>Class: {cohort.name}</PageTitle>
      <s.WidestColumn>
        <div>
          <TopButtonWrapper>
            <StyledButton primary onClick={() => setShowAddStudentsInfo(true)}>
              {strings.addStudents}
            </StyledButton>
            <StyledButton
              secondary
              onClick={() => history.push("/teacher/classes")}
            >
              {strings.backToClasses}
            </StyledButton>
          </TopButtonWrapper>
          {students === null ? (
            <LoadingAnimation />
          ) : students.length === 0 ? (
            <NoStudents inviteCode={cohort.inv_code} />
          ) : (
            <StudentsActivityOverviewContent
              cohortID={cohortID}
              students={students}
              setForceUpdate={setForceUpdate}
              removeStudentFromCohort={removeStudentFromCohort}
            />
          )}
        </div>
      </s.WidestColumn>
      {showAddStudentsInfo && (
        <HowToAddStudentsInfo
          setShowAddStudentInfo={setShowAddStudentsInfo}
          inviteCode={cohort.inv_code}
        />
      )}
    </>
  );
}
