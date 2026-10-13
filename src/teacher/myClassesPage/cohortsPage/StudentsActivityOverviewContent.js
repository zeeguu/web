import React, { useState, useEffect } from "react";
import StudentInfoLine from "./StudentInfoLine";
import TimeSelector from "../../sharedComponents/TimeSelector";
import LoadingAnimation from "../../../components/LoadingAnimation";
import strings from "../../../i18n/definitions";
import { CenteredContentContainer } from "../../../components/ColumnWidth.sc";
import { ScrollableTable } from "../../styledComponents/ScrollableTable.sc";
import { likelyDuplicates } from "./duplicateStudents";

const StudentsActivityOverviewContent = ({ cohortID, students, setForceUpdate, removeStudentFromCohort }) => {
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
  const duplicates = likelyDuplicates(students);

  return (
    <CenteredContentContainer>
      <TimeSelector setForceUpdate={setForceUpdate} customText={customText} />
      <ScrollableTable>
        {firstStudent !== null && (
          <StudentInfoLine
            key={firstStudent.id}
            cohortID={cohortID}
            student={firstStudent}
            duplicates={duplicates[firstStudent.id]}
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
              duplicates={duplicates[student.id]}
              removeStudentFromCohort={removeStudentFromCohort}
              isFirst={false}
            />
          ))}
      </ScrollableTable>
    </CenteredContentContainer>
  );
};
export default StudentsActivityOverviewContent;
