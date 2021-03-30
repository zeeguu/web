/* import strings from "../i18n/definitions";
import * as s from "../components/NarrowColumn.sc";
import * as sc from "../components/TopTabs.sc";

export default function CohortsRouter() {
  return (
      <s.NarrowColumn>
        <sc.TopTabs>
          <h1>{strings.login}</h1>
        </sc.TopTabs>
      </s.NarrowColumn>
  );
} */

import { Switch } from "react-router";
import { PrivateRoute } from "../PrivateRoute";
import CohortList from "./CohortList";
import ViewClass from "./ViewClass";
import Dummy from "./Dummy";
import ActivityInsightsRouter from "./_ActivityInsightsRouter";

export default function CohortsRouter({ api }) {
  return (
    <Switch>
      <PrivateRoute
        path="/teacher/classes"
        exact
        api={api}
        component={CohortList}
      />
      <PrivateRoute
        path="/teacher/classes/viewClass/:cohortID"
        api={api}
        component={ViewClass}
      />

      <PrivateRoute
        path="/teacher/classes/viewStudent/:studentID/class/:cohortID"
        api={api}
        component={ActivityInsightsRouter}
      />
    </Switch>
  );
}
