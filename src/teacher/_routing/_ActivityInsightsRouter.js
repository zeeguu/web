import strings from "../../i18n/definitions";
import { Switch, useParams } from "react-router";
import { useLocation } from "react-router-dom";
import { PrivateRoute } from "../../PrivateRoute";
import LocalStorage from "../../assorted/LocalStorage";
import StudentTabs from "../myClassesPage/StudentTabs";
import { TeacherPageSubtitle } from "../styledComponents/TeacherPageHeading.sc";
import * as s from "../../components/ColumnWidth.sc";
import StudentReadingInsights from "../myClassesPage/readingPage/StudentReadingInsights";
import StudentExercisesInsights from "../myClassesPage/exercisesPage/StudentExercisesInsights";
import { useContext, useEffect, useState } from "react";
import LoadingAnimation from "../../components/LoadingAnimation";
import { APIContext } from "../../contexts/APIContext";

export default function ActivityInsightsRouter() {
  const api = useContext(APIContext);
  const selectedTimePeriod = LocalStorage.selectedTimePeriod(); //this is only needed for the api call
  const cohortID = useParams().cohortID;
  const studentID = useParams().studentID;
  const path = useLocation().pathname;
  const [studentName, setStudentName] = useState("");
  const [cohortName, setCohortName] = useState("");

  const trimName = (name) => {
    const fullName = name.split(" ");
    return fullName[0];
  };
  const isOnExercisePage = path.includes("exercises");

  const title = isOnExercisePage ? strings.s_exercises : strings.s_reading;

  useEffect(() => {
    api.getCohortName(cohortID, (cohort) => setCohortName(cohort.name));
    api.getStudentInfo(
      studentID,
      cohortID,
      selectedTimePeriod,
      (studentInfo) => setStudentName(trimName(studentInfo.name)),
      (error) => console.log(error),
    );
    //eslint-disable-next-line
  }, []);

  if (studentName === "") return <LoadingAnimation />;

  return (
    <Switch>
      <s.WidestColumn>
        <StudentTabs
          studentID={studentID}
          cohortID={cohortID}
          title={`${studentName}${title}`}
        />
        {/* Which class we came from: the back arrow goes there, but only the
            old "Back to <class>" button ever said its name. */}
        <TeacherPageSubtitle>{cohortName}</TeacherPageSubtitle>
        <br />
        <PrivateRoute
          path="/teacher/classes/viewStudent/:studentID/class/:cohortID"
          exact
          component={StudentReadingInsights}
        />

        <PrivateRoute
          path="/teacher/classes/viewStudent/:studentID/class/:cohortID/exercises"
          component={StudentExercisesInsights}
        />
      </s.WidestColumn>
    </Switch>
  );
}
