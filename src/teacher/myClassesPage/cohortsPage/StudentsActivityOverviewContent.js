import React, { useState, useEffect } from "react";
import StudentInfoLine from "./StudentInfoLine";
import TimeSelector from "../../sharedComponents/TimeSelector";
import LoadingAnimation from "../../../components/LoadingAnimation";
import strings from "../../../i18n/definitions";
import { CenteredContentContainer } from "../../../components/ColumnWidth.sc";

const StudentsActivityOverviewContent = ({
  cohortID,
  students,
  setForceUpdate,
  removeStudentFromCohort,
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
    <CenteredContentContainer>
      <TimeSelector setForceUpdate={setForceUpdate} customText={customText} />
      {firstStudent !== null && (
        <StudentInfoLine
          key={firstStudent.id}
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
            cohortID={cohortID}
            student={student}
            removeStudentFromCohort={removeStudentFromCohort}
            isFirst={false}
          />
        ))}
    </CenteredContentContainer>
  );
};
export default StudentsActivityOverviewContent;
