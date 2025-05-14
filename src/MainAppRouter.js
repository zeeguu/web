import { Route, Switch } from "react-router-dom";
import LandingPage from "./landingPage/LandingPage";
import ExtensionInstalled from "./pages/onboarding/ExtensionInstalled";
import InstallExtension from "./pages/onboarding/InstallExtension";
import SelectInterests from "./pages/onboarding/SelectInterests";
import ExcludeWords from "./pages/onboarding/ExcludeWords";
import ResetPassword from "./pages/ResetPassword";
import NoSidebarRouter from "./NoSidebarRouter";
import LogIn from "./pages/LogIn";
import CreateAccount from "./pages/onboarding/CreateAccount";
import LanguagePreferences from "./pages/onboarding/LanguagePreferences";
import ArticlesRouter from "./articles/_ArticlesRouter";
import NotFound from "./pages/NotFound";
import ExercisesRouter from "./exercises/ExercisesRouter";
import WordsRouter from "./words/_WordsRouter";
import ReadingHistory from "./words/WordHistory";
import TeacherRouter from "./teacher/_routing/_TeacherRouter";
import ArticleReader from "./reader/ArticleReader";
import UserDashboard from "./userDashboard/UserDashboard";
import { PrivateRouteWithMainNav } from "./PrivateRouteWithMainNav";
import { PrivateRoute } from "./PrivateRoute";
import DeleteAccount from "./pages/DeleteAccount/DeleteAccount";
import SettingsRouter from "./pages/Settings/_SettingsRouter";
import ExercisesForArticle from "./exercises/ExercisesForArticle";
import { WEB_READER } from "./reader/ArticleReader";
import VideoPlayer from "./videos/VideoPlayer";

export default function MainAppRouter({ hasExtension, handleSuccessfulLogIn }) {
  return (
    <Switch>
      <Route path="/log_in" render={() => <LogIn handleSuccessfulLogIn={handleSuccessfulLogIn} />} />
      <Route path="/account_details" render={() => <CreateAccount handleSuccessfulLogIn={handleSuccessfulLogIn} />} />

      <Route path="/create_account" component={LanguagePreferences} />

      <Route path="/language_preferences" component={LanguagePreferences} />

      <Route path="/" exact component={LandingPage} />
      <Route path="/extension_installed" component={ExtensionInstalled} />
      <Route path="/install_extension" component={InstallExtension} />
      <Route path="/reset_pass" component={ResetPassword} />
      <Route path="/render" component={NoSidebarRouter} />

      <PrivateRoute path="/account_deletion" component={DeleteAccount} />

      <PrivateRoute path="/select_interests" hasExtension={hasExtension} component={SelectInterests} />

      <PrivateRoute path="/exclude_words" hasExtension={hasExtension} component={ExcludeWords} />

      <PrivateRouteWithMainNav path="/articles" component={ArticlesRouter} />
      <PrivateRoute path="/watch/video" component={VideoPlayer} />
      <PrivateRouteWithMainNav path="/exercises" component={ExercisesRouter} />
      <PrivateRouteWithMainNav path="/words" component={WordsRouter} />
      <PrivateRouteWithMainNav path="/history" component={ReadingHistory} />
      <PrivateRouteWithMainNav path="/account_settings" component={SettingsRouter} />
      <PrivateRouteWithMainNav path="/teacher" component={TeacherRouter} />
      <PrivateRouteWithMainNav path="/read/article" component={ArticleReader} />
      <PrivateRouteWithMainNav path="/user_dashboard" component={UserDashboard} />
      <PrivateRouteWithMainNav path="/search" component={ArticlesRouter} />
      <PrivateRouteWithMainNav
        path="/articleWordReview/:articleID"
        component={ExercisesForArticle}
        source={WEB_READER}
      />
      <Route path="*" component={NotFound} />
    </Switch>
  );
}
