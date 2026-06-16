import { lazy, Suspense } from "react";
import { PrivateRoute } from "./PrivateRoute";
import WordsRouter from "./words/_WordsRouter";
import ExercisesRouter from "./exercises/ExercisesRouter";
import Settings from "./pages/Settings/Pages/Settings";
import React from "react";
import ReadingHistory from "./words/WordHistory";
import StandAloneReader from "./reader/StandAloneReader";
import LoadingAnimation from "./components/LoadingAnimation";

// Lazy load separate parts of the app
const LazyTeacherRouter = lazy(() => import("./teacher/_routing/_TeacherRouter"));

// Wrapper components to handle Suspense (required for react-router v5)
const TeacherRouter = (props) => (
  <Suspense fallback={<LoadingAnimation />}>
    <LazyTeacherRouter {...props} />
  </Suspense>
);

export default function NoSidebarRouter({ setUser }) {
  return (
    <>
      <PrivateRoute path="/render/exercises" component={ExercisesRouter} />

      <PrivateRoute path="/render/words" component={WordsRouter} />

      <PrivateRoute path="/render/history" component={ReadingHistory} />

      <PrivateRoute path="/teacher" component={TeacherRouter} />

      <PrivateRoute path="/render/account_settings" setUser={setUser} component={Settings} />

      <PrivateRoute path="/render/read/article" component={StandAloneReader} />
    </>
  );
}
