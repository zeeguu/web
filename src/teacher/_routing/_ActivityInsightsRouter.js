import strings from "../../i18n/definitions";
import { Switch, useParams } from "react-router";
import { useLocation } from "react-router-dom";
import { PrivateRoute } from "../../PrivateRoute";
import LocalStorage from "../../assorted/LocalStorage";
import StudentTabs from "../myClassesPage/StudentTabs";
import * as s from "../../components/ColumnWidth.sc";
import StudentReadingInsights from "../myClassesPage/readingPage/StudentReadingInsights";
import StudentExercisesInsights from "../myClassesPage/exercisesPage/StudentExercisesInsights";
import StudentActivity from "../myClassesPage/activityPage/StudentActivity";
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
  let title = strings.s_activity;
  if (path.endsWith("/exercises")) title = strings.s_exercises;
  else if (path.endsWith("/reading")) title = strings.s_reading;

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
          cohortName={cohortName}
          title={`${studentName}${title}`}
        />
        <br />
        <PrivateRoute
          path="/teacher/classes/viewStudent/:studentID/class/:cohortID"
          exact
          component={StudentActivity}
        />

        <PrivateRoute
          path="/teacher/classes/viewStudent/:studentID/class/:cohortID/reading"
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
