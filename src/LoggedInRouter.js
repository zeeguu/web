import SideBar from "./components/SideBar";
import { PrivateRoute } from "./PrivateRoute";
import ArticlesRouter from "./articles/_ArticlesRouter";
import WordsRouter from "./words/_WordsRouter";
import ExercisesRouter from "./exercises/ExercisesRouter";
import TeacherRouter from "./teacher/_TeacherRouter";
import Settings from "./pages/Settings";
import ArticleReader from "./reader/ArticleReader";

export default function LoggedInRouter({ api, setUser }) {
  return (
    <>
      <SideBar>
        <PrivateRoute path="/articles" api={api} component={ArticlesRouter} />
        <PrivateRoute path="/exercises" api={api} component={ExercisesRouter} />
        <PrivateRoute path="/words" api={api} component={WordsRouter} />
        <PrivateRoute path="/teacher" api={api} component={TeacherRouter}/>

        <PrivateRoute
          path="/account_settings"
          api={api}
          setUser={setUser}
          component={Settings}
        />

        <PrivateRoute
          path="/read/article"
          api={api}
          component={ArticleReader}
        />
      </SideBar>
    </>
  );
}
