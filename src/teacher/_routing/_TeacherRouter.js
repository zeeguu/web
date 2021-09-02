import { Switch } from "react-router";
import { PrivateRoute } from "../../PrivateRoute";
import ArticlesRouter from "../../articles/_ArticlesRouter";
import CohortsRouter from "./_CohortsRouter";
import Tutorials from "../helpPage/Tutorials";
import TeacherTextsRouter from "./_TeacherTextsRouter";

export default function TeacherRouter({ api }) {
  return (
    <Switch>
      <PrivateRoute
        path="/teacher/classes"
        api={api}
        component={CohortsRouter}
      />
      <PrivateRoute
        path="/teacher/texts/"
        api={api}
        component={TeacherTextsRouter}
      />
      <PrivateRoute path="/teacher/tutorials" api={api} component={Tutorials} />
      <PrivateRoute path="/articles" api={api} component={ArticlesRouter} />
    </Switch>
  );
}
