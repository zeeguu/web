import { Switch } from "react-router";
import { PrivateRoute } from "../PrivateRoute";
import Home from "./Home";
import StudentsActivityOverview from "./StudentsActivityOverview";
import ActivityInsightsRouter from "./_ActivityInsightsRouter";

export default function CohortsRouter({ api }) {
  return (
    <Switch>
      <PrivateRoute path="/teacher/classes" exact api={api} component={Home} />
      <PrivateRoute
        path="/teacher/classes/viewClass/:cohortID"
        api={api}
        component={StudentsActivityOverview}
      />

      <PrivateRoute
        path="/teacher/classes/viewStudent/:studentID/class/:cohortID"
        api={api}
        component={ActivityInsightsRouter}
      />
    </Switch>
  );
}
