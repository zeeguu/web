import strings from "../i18n/definitions";
import { Switch, useParams } from "react-router";
import { PrivateRoute } from "../PrivateRoute";
import * as s from "../components/NarrowColumn.sc";
import TopTabs from "../components/TopTabs";
import ReadingInsights from "./ReadingInsights";
import ExercisesInsights from "./ExercisesInsights";

export default function ActivityInsightsRouter({ api }) {
    const cohortID = useParams().cohortID
    const studentID = useParams().studentID

  return (
    <Switch>
      <s.NarrowColumn>
        <TopTabs
          title="Learning Activities"
          tabsAndLinks={{
            Reading:
              "/teacher/classes/viewStudent/:studentID/class/:cohortID/reading",
            [strings.exercises]:
              "/teacher/classes/viewStudent/:studentID/class/:cohortID/exercises",
            BackToClassroom: "/teacher/classes/viewClass/"+cohortID,
          }}
        />
        
        <PrivateRoute
          path="/teacher/classes/viewStudent/:studentID/class/:cohortID/reading"
          api={api}
          component={ReadingInsights}
        />

        <PrivateRoute
          path="/teacher/classes/viewStudent/:studentID/class/:cohortID/exercises"
          api={api}
          component={ExercisesInsights}
        />
      </s.NarrowColumn>
    </Switch>
  );
}
