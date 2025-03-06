import { PrivateRoute } from "./PrivateRoute";
import WordsRouter from "./words/_WordsRouter";
import ExercisesRouter from "./exercises/ExercisesRouter";
import TeacherRouter from "./teacher/_routing/_TeacherRouter";
import Settings from "./pages/Settings/Settings";
import UserDashboard from "./userDashboard/UserDashboard";
import React from "react";
import ReadingHistory from "./words/WordHistory";
import StandAloneReader from "./reader/StandAloneReader";

export default function NoSidebarRouter({ setUser }) {
  return (
    <>
      <PrivateRoute path="/render/exercises" component={ExercisesRouter} />

      <PrivateRoute path="/render/words" component={WordsRouter} />

      <PrivateRoute path="/render/history" component={ReadingHistory} />

      <PrivateRoute path="/teacher" component={TeacherRouter} />

      <PrivateRoute
        path="/render/account_settings"
        setUser={setUser}
        component={Settings}
      />

      <PrivateRoute path="/render/read/article" component={StandAloneReader} />

      <PrivateRoute path="/user_dashboard" component={UserDashboard} />
    </>
  );
}
