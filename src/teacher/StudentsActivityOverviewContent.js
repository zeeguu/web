import React, { useState, useEffect, Fragment } from "react";
import StudentInfoLine from "./StudentInfoLine";
import TimeSelector from "./TimeSelector";
import LoadingAnimation from "../components/LoadingAnimation";
import strings from "../i18n/definitions";

const StudentsActivityOverviewContent = ({
  api,
  cohortID,
  students,
  setForceUpdate,
  removeStudentFromCohort
}) => {
  const [firstStudent, setFirstStudent] = useState(null);
  const [restOfStudents, setRestOfStudents] = useState(null);

  useEffect(() => {
    setFirstStudent(students[0]);
    setRestOfStudents(students.slice(1, students.length));
    //eslint-disable-next-line
  }, [students]);

  if (students === null) {
    return <LoadingAnimation />;
  }

  const customText = [strings.customTextInTimeSelector];

  return (
    <Fragment>
      <TimeSelector setForceUpdate={setForceUpdate} customText={customText} />
      {firstStudent !== null && (
        <StudentInfoLine
          key={firstStudent.id}
          api={api}
          cohortID={cohortID}
          student={firstStudent}
          removeStudentFromCohort={removeStudentFromCohort}
          isFirst={true}
        />
      )}
      {restOfStudents !== null &&
        restOfStudents.map((student) => (
          <StudentInfoLine
            key={student.id}
            api={api}
            cohortID={cohortID}
            student={student}
            removeStudentFromCohort={removeStudentFromCohort}
            isFirst={false}
          />
        ))}
    </Fragment>
  );
};
export default StudentsActivityOverviewContent;
