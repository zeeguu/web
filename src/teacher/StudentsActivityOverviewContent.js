import React, { useState, useEffect, Fragment } from "react";
import StudentInfoLine from "./StudentInfoLine";
import TimeSelector from "./TimeSelector";
import LoadingAnimation from "../components/LoadingAnimation";

const StudentsActivityOverviewContent = ({
  api,
  cohortID,
  students,
  setForceUpdate,
}) => {
  const [firstStudent, setFirstStudent] = useState(null);
  const [restOfStudents, setRestOfStudents] = useState(null);

  useEffect(() => {
    setFirstStudent(students[0]);
    setRestOfStudents(students.slice(1, students.length));
    //eslint-disable-next-line
  }, []);

  if (students === null) {
    return <LoadingAnimation />;
  }

  console.log(students);
  console.log("all students above");
  console.log(firstStudent);
  console.log("first student above");
  console.log(restOfStudents);
  console.log("restOfStudents above");

  const customText =
    "STRINGS This is the overview of the students' activities for the last";

  return (
    <Fragment>
      <TimeSelector setForceUpdate={setForceUpdate} customText={customText} />
      {firstStudent !== null && (
        <StudentInfoLine
          key={firstStudent.id}
          api={api}
          cohortID={cohortID}
          student={firstStudent}
          setForceUpdate={setForceUpdate}
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
            setForceUpdate={setForceUpdate}
            isFirst={false}
          />
        ))}
    </Fragment>
  );
};
export default StudentsActivityOverviewContent;
