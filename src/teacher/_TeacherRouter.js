import { useState } from "react";
import { Switch } from "react-router";
import { PrivateRoute } from "../PrivateRoute";
import ArticlesRouter from "../articles/_ArticlesRouter";
import CohortsRouter from "./_CohortsRouter";
import Tutorials from "./Tutorials";
import TeacherTextsRouter from "./_TeacherTextsRouter";
import { RoutingContext } from "../contexts/RoutingContext";

export default function TeacherRouter({ api }) {
  //Setting up the routing context to be able to use the cancel-button in EditText correctly
  const [returnPath, setReturnPath] = useState("boo!");
  return (
    <>
      <RoutingContext.Provider value={{ returnPath, setReturnPath }}>
        <Switch>
          <PrivateRoute
            path="/teacher/classes"
            api={api}
            component={CohortsRouter}
          />
          <PrivateRoute
            path="/teacher/texts"
            api={api}
            component={TeacherTextsRouter}
          />
          <PrivateRoute
            path="/teacher/tutorials"
            api={api}
            component={Tutorials}
          />
          <PrivateRoute path="/articles" api={api} component={ArticlesRouter} />
        </Switch>
      </RoutingContext.Provider>
    </>
  );
}
