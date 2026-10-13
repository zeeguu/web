import strings from "../../i18n/definitions";
import { Redirect, Route, Switch, useParams } from "react-router";
import { useLocation } from "react-router-dom";
import { PrivateRoute } from "../../PrivateRoute";
import LocalStorage from "../../assorted/LocalStorage";
import StudentTabs from "../myClassesPage/StudentTabs";
import * as s from "../../components/ColumnWidth.sc";
import StudentActivity from "../myClassesPage/activityPage/StudentActivity";
import StudentWords from "../myClassesPage/wordsPage/StudentWords";
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
  const title = path.includes("/words") ? strings.s_words : strings.s_activity;

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

        <PrivateRoute path="/teacher/classes/viewStudent/:studentID/class/:cohortID/words" component={StudentWords} />

        {/* The Reading and Exercises tabs became Activity and Words; old
            links (bookmarks, emails) land on their successors. */}
        <Route
          path="/teacher/classes/viewStudent/:studentID/class/:cohortID/reading"
          render={({ match }) => (
            <Redirect to={`/teacher/classes/viewStudent/${match.params.studentID}/class/${match.params.cohortID}`} />
          )}
        />
        <Route
          path="/teacher/classes/viewStudent/:studentID/class/:cohortID/exercises"
          render={({ match }) => (
            <Redirect
              to={`/teacher/classes/viewStudent/${match.params.studentID}/class/${match.params.cohortID}/words`}
            />
          )}
        />
      </s.WidestColumn>
    </Switch>
  );
}
