import { Switch } from "react-router-dom";
import { PrivateRoute } from "../PrivateRoute";
import Exercises from "./Exercises";
import ExercisesForArticle from "./ExercisesForArticle";

import strings from "../i18n/definitions";

import * as s from "../components/NarrowColumn.sc";
import * as sc from "../components/TopTabs.sc";

export default function ExercisesRouter({ api }) {
  return (
    <s.NarrowColumn>
      <sc.TopTabs>
        <h1>{strings.exercises}</h1>
      </sc.TopTabs>

      <Switch>
        <PrivateRoute
          path="/exercises/forArticle/:articleID"
          api={api}
          component={ExercisesForArticle}
        />

        <PrivateRoute path="/exercises" api={api} component={Exercises} />
      </Switch>
    </s.NarrowColumn>
  );
}
