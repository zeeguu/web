import { lazy, Suspense } from "react";
import { PrivateRoute } from "./PrivateRoute";
import WordsRouter from "./words/_WordsRouter";
import ExercisesRouter from "./exercises/ExercisesRouter";
import Settings from "./pages/Settings/Settings";
import React from "react";
import ReadingHistory from "./words/WordHistory";
import StandAloneReader from "./reader/StandAloneReader";
import LoadingAnimation from "./components/LoadingAnimation";

// Lazy load separate parts of the app
const TeacherRouter = lazy(() => import("./teacher/_routing/_TeacherRouter"));
const UserDashboard = lazy(() => import("./userDashboard/UserDashboard"));

export default function NoSidebarRouter({ setUser }) {
  return (
    <>
      <PrivateRoute path="/render/exercises" component={ExercisesRouter} />

      <PrivateRoute path="/render/words" component={WordsRouter} />

      <PrivateRoute path="/render/history" component={ReadingHistory} />

      <Suspense fallback={<LoadingAnimation />}>
        <PrivateRoute path="/teacher" component={TeacherRouter} />
      </Suspense>

      <PrivateRoute
        path="/render/account_settings"
        setUser={setUser}
        component={Settings}
      />

      <PrivateRoute path="/render/read/article" component={StandAloneReader} />

      <Suspense fallback={<LoadingAnimation />}>
        <PrivateRoute path="/user_dashboard" component={UserDashboard} />
      </Suspense>
    </>
  );
}
