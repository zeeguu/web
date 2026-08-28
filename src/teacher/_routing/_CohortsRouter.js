import { Switch } from "react-router";
import { PrivateRoute } from "../../PrivateRoute";
import Home from "../myClassesPage/cohortsPage/Home";
import StudentsActivityOverview from "../myClassesPage/cohortsPage/StudentsActivityOverview";
import ClassTexts from "../myClassesPage/cohortsPage/ClassTexts";
import ActivityInsightsRouter from "./_ActivityInsightsRouter";

export default function CohortsRouter() {
  return (
    <Switch>
      <PrivateRoute path="/teacher/classes" exact component={Home} />

      <PrivateRoute
        path="/teacher/classes/viewClass/:cohortID/texts"
        component={ClassTexts}
      />

      <PrivateRoute
        path="/teacher/classes/viewClass/:cohortID"
        component={StudentsActivityOverview}
      />

      <PrivateRoute
        path="/teacher/classes/viewStudent/:studentID/class/:cohortID"
        component={ActivityInsightsRouter}
      />
    </Switch>
  );
}
