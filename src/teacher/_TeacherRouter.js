import { PrivateRoute } from "../PrivateRoute";
import ArticlesRouter from "../articles/_ArticlesRouter";
import ViewClass from "./ViewClass";
import CohortsRouter from "./_CohortsRouter";
import AllTexts from "./AllTexts";
import { Switch } from "react-router";
import Tutorials from "./Tutorials";

export default function TeacherRouter({ api }) {
  return (
    <>
      <Switch>
        <PrivateRoute
          path="/teacher/classes"
          api={api}
          component={CohortsRouter}
        />
        <PrivateRoute path="/teacher/texts" api={api} component={AllTexts} />
        <PrivateRoute
          path="/teacher/tutorials"
          api={api}
          component={Tutorials}
        />
        <PrivateRoute path="/articles" api={api} component={ArticlesRouter} />
      </Switch>
    </>
  );
}
