import strings from "../i18n/definitions";
import { Switch, useParams } from "react-router";
import { PrivateRoute } from "../PrivateRoute";
import * as s from "../components/ColumnWidth.sc";
import TopTabs from "../components/TopTabs";
import StudentReadingInsights from "./StudentReadingInsights";
import StudentExercisesInsights from "./StudentExercisesInsights";

export default function ActivityInsightsRouter({ api }) {
  const cohortID = useParams().cohortID;
  const studentID = "HARDCODED";

  return (
    <Switch>
      <s.NarrowColumn>
        <TopTabs
          title="STRINGS Learning Activities"
          tabsAndLinks={{
            STRINGSReading: "/teacher/classes/viewStudent/" + studentID + "/class/" + cohortID,
            [strings.exercises]: "/teacher/classes/viewStudent/" + studentID + "/class/" + cohortID + "/exercises",
            STRINGSBackToClassroom: "/teacher/classes/viewClass/" + cohortID,
          }}
        />
        <PrivateRoute
          path="/teacher/classes/viewStudent/:studentID/class/:cohortID"
          exact
          api={api}
          component={StudentReadingInsights}
        />

        <PrivateRoute
          path="/teacher/classes/viewStudent/:studentID/class/:cohortID/exercises"
          api={api}
          component={StudentExercisesInsights}
        />
      </s.NarrowColumn>
    </Switch>
  );
}
