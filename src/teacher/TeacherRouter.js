import { PrivateRoute } from "../PrivateRoute";
import strings from "../i18n/definitions";

import * as s from "../components/NarrowColumn.sc";
import * as sc from "../components/TopTabs.sc";
import ArticlesRouter from "../articles/_ArticlesRouter";
import TeacherClasses from "../teacher/TeacherClasses";
import { Switch } from "react-router";

export default function TeacherRouter({ api }) {
  return (
    <>
      {/* Rendering top menu first, then routing to corresponding page */}
      <s.NarrowColumn>
        <sc.TopTabs>
          <h1>The teacher side of things is being built...</h1>
        </sc.TopTabs>
        <Switch>
          <PrivateRoute
            path="/teacher_classes"
            exact
            api={api}
            component={TeacherClasses}
          />
          <PrivateRoute
            path="/teacher_texts"
            api={api}
            component={TeacherClasses}
          />
          <PrivateRoute
            path="/teacher_tutorials"
            api={api}
            component={TeacherClasses}
          />
          <PrivateRoute path="/articles" api={api} component={ArticlesRouter} />
        </Switch>
      </s.NarrowColumn>
    </>
  );
}
