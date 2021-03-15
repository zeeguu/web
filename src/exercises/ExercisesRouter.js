import { Switch } from "react-router-dom";
import { PrivateRoute } from "../PrivateRoute";
import Exercises from "./Exercises";
import ExercisesForArticle from "./ExercisesForArticle";

export default function ExercisesRouter({ api }) {
  return (
    <Switch>
      <PrivateRoute
        path="/exercises/forArticle/:articleID"
        api={api}
        component={ExercisesForArticle}
      />

      <PrivateRoute path="/exercises" api={api} component={Exercises} />
    </Switch>
  );
}
