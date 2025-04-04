import { Switch, useHistory } from "react-router-dom";
import { PrivateRoute } from "../PrivateRoute";
import Exercises from "./Exercises";
import * as s from "../components/ColumnWidth.sc";
import { UMR_SOURCE } from "../reader/ArticleReader";
import { useContext } from "react";
import { APIContext } from "../contexts/APIContext";

export default function ExercisesRouter() {
  const api = useContext(APIContext);
  const history = useHistory();

  const backToReadingAction = () => {
    history.push("/articles");
    api.logUserActivity(api.BACK_TO_READING, "", "", UMR_SOURCE);
  };

  const keepExercisingAction = () => {
    window.location.reload(false);
    api.logUserActivity(api.KEEP_EXERCISING, "", "", UMR_SOURCE);
  };

  const toScheduledExercises = () => {
    history.push("/exercises");
    api.logUserActivity(api.TO_SCHEDULED_EXERCISES, "", "", UMR_SOURCE);
  };

  return (
    <s.NarrowColumn>
      <Switch>
        <PrivateRoute
          path="/exercises"
          component={Exercises}
          backButtonAction={backToReadingAction}
          keepExercisingAction={keepExercisingAction}
          toScheduledExercises={toScheduledExercises}
          source={UMR_SOURCE}
        />
      </Switch>
    </s.NarrowColumn>
  );
}
