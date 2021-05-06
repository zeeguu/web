import React, { Fragment } from "react";
import StudentInfoLine from "./StudentInfoLine";
import StudentInfoLineHeader from "./StudentInfoLineHeader";
import TimeSelector from "./TimeSelector";
import LoadingAnimation from "../components/LoadingAnimation";

export default function StudentsActivityOverviewContent({
  api,
  cohortID,
  students,
  setForceUpdate
}) {
  if (students === null) {
    return <LoadingAnimation />;
  }

  const customText =
    "This is the overview of the students' activities for the last";

  return (
    <Fragment>
      <TimeSelector setForceUpdate={setForceUpdate} customText={customText} />
      <StudentInfoLineHeader />
      {students.map(student => (
        <StudentInfoLine
          key={student.id}
          api={api}
          cohortID={cohortID}
          student={student}
        />
      ))}
    </Fragment>
  );
}
