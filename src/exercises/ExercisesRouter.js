import { Switch, useHistory } from "react-router-dom";
import { PrivateRoute } from "../PrivateRoute";
import ExerciseSession from "./ExerciseSession";
import * as s from "../components/ColumnWidth.sc";
import { WEB_READER } from "../reader/ArticleReader";
import { useContext } from "react";
import { APIContext } from "../contexts/APIContext";

export default function ExercisesRouter() {
  const api = useContext(APIContext);
  const history = useHistory();

  const backToReadingAction = () => {
    history.push("/articles");
    api.logUserActivity(api.BACK_TO_READING, "", "", WEB_READER);
  };

  const keepExercisingAction = () => {
    window.location.reload(false);
    api.logUserActivity(api.KEEP_EXERCISING, "", "", WEB_READER);
  };

  const toScheduledExercises = () => {
    history.push("/exercises");
    api.logUserActivity(api.TO_SCHEDULED_EXERCISES, "", "", WEB_READER);
  };

  return (
    <s.NarrowColumn>
      <Switch>
        <PrivateRoute
          path="/exercises/summary"
          component={ExerciseSession}
          backButtonAction={backToReadingAction}
          keepExercisingAction={keepExercisingAction}
          toScheduledExercises={toScheduledExercises}
          source={WEB_READER}
        />
        <PrivateRoute
          path="/exercises/no-words"
          component={ExerciseSession}
          backButtonAction={backToReadingAction}
          keepExercisingAction={keepExercisingAction}
          toScheduledExercises={toScheduledExercises}
          source={WEB_READER}
        />
        <PrivateRoute
          path="/exercises/:exerciseType/:bookmarkId"
          component={ExerciseSession}
          backButtonAction={backToReadingAction}
          keepExercisingAction={keepExercisingAction}
          toScheduledExercises={toScheduledExercises}
          source={WEB_READER}
        />
        <PrivateRoute
          path="/exercises"
          component={ExerciseSession}
          backButtonAction={backToReadingAction}
          keepExercisingAction={keepExercisingAction}
          toScheduledExercises={toScheduledExercises}
          source={WEB_READER}
        />
      </Switch>
    </s.NarrowColumn>
  );
}
