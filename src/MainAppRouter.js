import { Route, Switch } from "react-router-dom";
import LandingPage from "./landingPage/LandingPage";
import ExtensionInstalled from "./pages/ExtensionInstalled";
import InstallExtension from "./pages/InstallExtension";
import SelectInterests from "./pages/SelectInterests";
import ExcludeWordsStep1 from "./pages/ExcludeWordsStep1";
import ExcludeWordsStep2 from "./pages/ExcludeWordsStep2";
import ResetPassword from "./pages/ResetPassword";
import NoSidebarRouter from "./NoSidebarRouter";
import SignIn from "./pages/SignIn";
import CreateAccount from "./pages/CreateAccount";
import LanguagePreferences from "./pages/LanguagePreferences";
import LocalStorage from "./assorted/LocalStorage";
import SessionStorage from "./assorted/SessionStorage";
import { saveUserInfoIntoCookies } from "./utils/cookies/userInfo";
import ArticlesRouter from "./articles/_ArticlesRouter";
import ExercisesRouter from "./exercises/ExercisesRouter";
import WordsRouter from "./words/_WordsRouter";
import ReadingHistory from "./words/WordHistory";
import TeacherRouter from "./teacher/_routing/_TeacherRouter";
import Settings from "./pages/Settings";
import ArticleReader from "./reader/ArticleReader";
import UserDashboard from "./userDashboard/UserDashboard";
import { PrivateRouteWithSidebar } from "./PrivateRouteWithSidebar";
import { PrivateRoute } from "./PrivateRoute";

export default function MainAppRouter({ api, setUser, hasExtension }) {
  function handleSuccessfulSignIn(userInfo) {
    LocalStorage.setSession(api.session);
    LocalStorage.setUserInfo(userInfo);

    // TODO: Should this be moved to Settings.loadUsrePreferences?
    api.getUserPreferences((preferences) => {
      SessionStorage.setAudioExercisesEnabled(
        preferences["audio_exercises"] === undefined ||
          preferences["audio_exercises"] === "true",
      );
    });

    // Cookies are the mechanism via which we share a login
    // between the extension and the website
    saveUserInfoIntoCookies(userInfo, api.session);
    let newUserValue = {
      session: api.session,
      name: userInfo.name,
      learned_language: userInfo.learned_language,
      native_language: userInfo.native_language,
      is_teacher: userInfo.is_teacher,
      is_student: userInfo.is_student,
    };

    console.log("setting new user value: ");
    console.dir(newUserValue);
    setUser(newUserValue);
  }

  return (
    <Switch>
      <Route
        path="/login"
        render={() => (
          <SignIn api={api} handleSuccessfulSignIn={handleSuccessfulSignIn} />
        )}
      />
      <Route
        path="/create_account"
        render={() => (
          <CreateAccount
            api={api}
            handleSuccessfulSignIn={handleSuccessfulSignIn}
          />
        )}
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
        path="/language_preferences"
        api={api}
        setUser={setUser}
        component={LanguagePreferences}
      />

      <PrivateRoute
        path="/select_interests"
        api={api}
        hasExtension={hasExtension}
        component={SelectInterests}
      />

      <PrivateRoute
        path="/exclude_words_step1"
        api={api}
        hasExtension={hasExtension}
        component={ExcludeWordsStep1}
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
        component={Settings}
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
    </Switch>
  );
}
