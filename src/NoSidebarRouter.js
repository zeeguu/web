import { PrivateRoute } from "./PrivateRoute";
import ArticlesRouter from "./articles/_ArticlesRouter";
import WordsRouter from "./words/_WordsRouter";
import ExercisesRouter from "./exercises/ExercisesRouter";
import TeacherRouter from "./teacher/_routing/_TeacherRouter";
import Settings from "./pages/Settings/Settings";
import UserDashboard from "./userDashboard/UserDashboard";
import React from "react";
import ReadingHistory from "./words/WordHistory";
import StandAloneReader from "./reader/StandAloneReader";

export default function NoSidebarRouter({ api, setUser }) {
  return (
    <>
      <PrivateRoute
        path="/render/exercises"
        api={api}
        component={ExercisesRouter}
      />
      <PrivateRoute path="/render/words" api={api} component={WordsRouter} />
      <PrivateRoute
        path="/render/history"
        api={api}
        component={ReadingHistory}
      />
      <PrivateRoute path="/teacher" api={api} component={TeacherRouter} />
      <PrivateRoute
        path="/render/account_settings"
        api={api}
        setUser={setUser}
        component={Settings}
      />
      <PrivateRoute
        path="/render/read/article"
        api={api}
        component={StandAloneReader}
      />
      <PrivateRoute
        path="/user_dashboard"
        api={api}
        component={UserDashboard}
      />
    </>
  );
}
