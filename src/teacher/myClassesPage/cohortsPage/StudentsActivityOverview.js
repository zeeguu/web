import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LocalStorage from "../../../assorted/LocalStorage";
import { transformStudents } from "./teacherApiHelpers";
import NoStudents from "./NoStudents";
import ClassTabs from "./ClassTabs";
import * as s from "../../../components/ColumnWidth.sc";
import LoadingAnimation from "../../../components/LoadingAnimation";
import StudentsActivityOverviewContent from "./StudentsActivityOverviewContent";
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

  const hasStudents = students.length > 0;
  const studentsSection = hasStudents ? (
    <StudentsActivityOverviewContent
      cohortID={cohortID}
      students={students}
      setForceUpdate={setForceUpdate}
      removeStudentFromCohort={removeStudentFromCohort}
    />
  ) : (
    <NoStudents inviteCode={cohort.inv_code} />
  );

  return (
    <>
      <s.NarrowColumn>
        <div>
          <ClassTabs
            cohortID={cohortID}
            cohort={cohort}
            studentCount={students.length}
            onClassChanged={setForceUpdate}
          />
          {studentsSection}
        </div>
      </s.NarrowColumn>
    </>
  );
}
