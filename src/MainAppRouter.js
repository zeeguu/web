import { Route, Switch } from "react-router-dom";
import LandingPage from "./landingPage/LandingPage";
import ExtensionInstalled from "./pages/onboarding/ExtensionInstalled";
import InstallExtension from "./pages/onboarding/InstallExtension";
import SelectInterests from "./pages/onboarding/SelectInterests";
import ExcludeWordsStep2 from "./pages/onboarding/ExcludeWordsStep2";
import ResetPassword from "./pages/ResetPassword";
import NoSidebarRouter from "./NoSidebarRouter";
import LogIn from "./pages/LogIn";
import CreateAccount from "./pages/onboarding/CreateAccount";
import LanguagePreferences from "./pages/onboarding/LanguagePreferences";
import ArticlesRouter from "./articles/_ArticlesRouter";
import ExercisesRouter from "./exercises/ExercisesRouter";
import WordsRouter from "./words/_WordsRouter";
import ReadingHistory from "./words/WordHistory";
import TeacherRouter from "./teacher/_routing/_TeacherRouter";
import ArticleReader from "./reader/ArticleReader";
import UserDashboard from "./userDashboard/UserDashboard";
import { PrivateRouteWithSidebar } from "./PrivateRouteWithSidebar";
import { PrivateRoute } from "./PrivateRoute";
import DeleteAccount from "./pages/DeleteAccount/DeleteAccount";
import SettingsRouter from "./pages/Settings/_SettingsRouter";

export default function MainAppRouter({
  api,
  setUser,
  hasExtension,
  handleSuccessfulLogIn,
}) {
  return (
    <Switch>
      <Route
        path="/log_in"
        render={() => (
          <LogIn api={api} handleSuccessfulLogIn={handleSuccessfulLogIn} />
        )}
      />

      <Route
        path="/create_account"
        render={() => (
          <CreateAccount
            api={api}
            handleSuccessfulLogIn={handleSuccessfulLogIn}
            setUser={setUser}
          />
        )}
      />

      <Route
        path="/language_preferences"
        render={() => <LanguagePreferences api={api} />}
      />

      <Route path="/" exact render={() => <LandingPage />} />
      <Route
        path="/extension_installed"
        render={() => <ExtensionInstalled api={api} />}
      />
      <Route path="/install_extension" render={() => <InstallExtension />} />
      <Route path="/reset_pass" render={() => <ResetPassword api={api} />} />
      <Route path="/render" render={() => <NoSidebarRouter api={api} />} />

      <PrivateRoute
        path="/account_deletion"
        api={api}
        component={DeleteAccount}
      />

      <PrivateRoute
        path="/select_interests"
        api={api}
        hasExtension={hasExtension}
        component={SelectInterests}
      />

      <PrivateRoute
        path="/exclude_words_step2"
        api={api}
        hasExtension={hasExtension}
        component={ExcludeWordsStep2}
      />

      <PrivateRouteWithSidebar
        path="/articles"
        api={api}
        component={ArticlesRouter}
      />
      <PrivateRouteWithSidebar
        path="/exercises"
        api={api}
        component={ExercisesRouter}
      />
      <PrivateRouteWithSidebar
        path="/words"
        api={api}
        component={WordsRouter}
      />
      <PrivateRouteWithSidebar
        path="/history"
        api={api}
        component={ReadingHistory}
      />
      <PrivateRouteWithSidebar
        path="/account_settings"
        api={api}
        setUser={setUser}
        component={SettingsRouter}
      />
      <PrivateRouteWithSidebar
        path="/teacher"
        api={api}
        component={TeacherRouter}
      />
      <PrivateRouteWithSidebar
        path="/read/article"
        api={api}
        component={ArticleReader}
      />
      <PrivateRouteWithSidebar
        path="/user_dashboard"
        api={api}
        component={UserDashboard}
      />
      <PrivateRouteWithSidebar
        path="/search"
        api={api}
        component={ArticlesRouter}
      />
    </Switch>
  );
}
