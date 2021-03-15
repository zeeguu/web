import ArticlesRouter from "./articles/_ArticlesRouter";
import WordsRouter from "./words/_WordsRouter";
import ExercisesRouter from "./exercises/ExercisesRouter";
import Settings from "./pages/Settings";
import { PrivateRoute } from "./PrivateRoute";
import SideBar from "./components/SideBar";
import ArticleReader from "./reader/ArticleReader";

export default function LoggedInRouter({ api, setUser }) {
  return (
    <>
      <SideBar>
        <PrivateRoute path="/articles" api={api} component={ArticlesRouter} />
        <PrivateRoute path="/exercises" api={api} component={ExercisesRouter} />
        <PrivateRoute path="/words" api={api} component={WordsRouter} />

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
