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

  // eslint-disable-next-line
  const [forceUpdate, setForceUpdate] = useState(0);
  // days; shared with the student pages through LocalStorage
  const [selectedTimePeriod, setSelectedTimePeriod] = useState(() => String(LocalStorage.selectedTimePeriod()));

  function changePeriod(days) {
    LocalStorage.setSelectedTimePeriod(days);
    setSelectedTimePeriod(days);
  }

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
      // cohortID comes from the route, so it is a string; the payload's id is
      // a number. Compare as strings rather than relying on either shape.
      const currentCohortArray = res.filter((cohort) => String(cohort.id) === String(cohortID));
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
      period={selectedTimePeriod}
      onPeriodChange={changePeriod}
      removeStudentFromCohort={removeStudentFromCohort}
    />
  ) : (
    <NoStudents inviteCode={cohort.inv_code} />
  );

  return (
    <>
      <s.WidestColumn>
        <div>
          <ClassTabs
            cohortID={cohortID}
            cohort={cohort}
            studentCount={students.length}
            onClassChanged={setForceUpdate}
          />
          {studentsSection}
        </div>
      </s.WidestColumn>
    </>
  );
}
