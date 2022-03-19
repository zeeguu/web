import { Switch, useHistory } from "react-router-dom";
import { PrivateRoute } from "../PrivateRoute";
import Exercises from "./Exercises";
import ExercisesForArticle from "./ExercisesForArticle";

import strings from "../i18n/definitions";

import * as s from "../components/ColumnWidth.sc";
import * as sc from "../components/TopTabs.sc";

export default function ExercisesRouter({ api }) {
  const history = useHistory();

  const backToReadingAction = () => {
    history.push("/articles");
  };

  const keepExercisingAction = () => {
    window.location.reload(false);
  };

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
          backToReadingAction={backToReadingAction}
          keepExercisingAction={keepExercisingAction}
        />

        <PrivateRoute
          path="/exercises"
          api={api}
          component={Exercises}
          backToReadingAction={backToReadingAction}
          keepExercisingAction={keepExercisingAction}
        />
      </Switch>
    </s.NarrowColumn>
  );
}
