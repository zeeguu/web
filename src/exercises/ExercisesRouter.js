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
      <Switch>
        <PrivateRoute
          path="/exercises/forArticle/:articleID"
          api={api}
          component={ExercisesForArticle}
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
