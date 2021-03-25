import { PrivateRoute } from "../PrivateRoute";
import ArticlesRouter from "../articles/_ArticlesRouter";
import TeacherClasses from "../teacher/TeacherClasses";
import TeacherTexts from "../teacher/TeacherTexts";
import { Switch } from "react-router";
import TeacherTutorials from "./TeacherTutorials";

export default function TeacherRouter({ api }) {
  return (
    <>
      <Switch>
        <PrivateRoute
          path="/teacher/classes"
          exact
          api={api}
          component={TeacherClasses}
        />
        <PrivateRoute
          path="/teacher/texts"
          api={api}
          component={TeacherTexts}
        />
        <PrivateRoute
          path="/teacher/tutorials"
          api={api}
          component={TeacherTutorials}
        />
        <PrivateRoute path="/articles" api={api} component={ArticlesRouter} />
      </Switch>
    </>
  );
}
