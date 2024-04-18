import { Switch, useHistory } from "react-router-dom";
import { PrivateRoute } from "../PrivateRoute";
import Exercises from "./Exercises";
import ExercisesForArticle from "./ExercisesForArticle";
import * as s from "../components/ColumnWidth.sc";
import { UMR_SOURCE } from "../reader/ArticleReader";

export default function ExercisesRouter({ api, user, setUser }) {
  const history = useHistory();

  const backToReadingAction = () => {
    history.push("/articles");
    api.logReaderActivity(api.BACK_TO_READING, "", "", UMR_SOURCE);
  };

  const keepExercisingAction = () => {
    window.location.reload(false);
    api.logReaderActivity(api.KEEP_EXERCISING, "", "", UMR_SOURCE);
  };

  return (
    <s.NarrowColumn>
      <Switch>
        <PrivateRoute
          path="/exercises/forArticle/:articleID"
          api={api}
          component={ExercisesForArticle}
          source={UMR_SOURCE}
        />

        <PrivateRoute
          path="/render/exercises/forArticle/:articleID"
          api={api}
          component={ExercisesForArticle}
          source={UMR_SOURCE}
        />

        <PrivateRoute
          path="/exercises"
          api={api}
          component={Exercises}
          setUser={setUser}
          user={user}
          backButtonAction={backToReadingAction}
          keepExercisingAction={keepExercisingAction}
          source={UMR_SOURCE}
        />
      </Switch>
    </s.NarrowColumn>
  );
}
