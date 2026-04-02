import { lazy, Suspense } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import LandingPage from "./landingPage/LandingPage";
import ExtensionInstalled from "./pages/onboarding/ExtensionInstalled";
import InstallExtension from "./pages/onboarding/InstallExtension";
import SelectInterests from "./pages/onboarding/SelectInterests";
import VerifyEmail from "./pages/onboarding/VerifyEmail";
import ExcludeWords from "./pages/onboarding/ExcludeWords";
import ResetPassword from "./pages/ResetPassword";
import NoSidebarRouter from "./NoSidebarRouter";
import LogIn from "./pages/LogIn";
import CreateAccount from "./pages/onboarding/CreateAccount";
import LanguagePreferences from "./pages/onboarding/LanguagePreferences";
import Welcome from "./pages/onboarding/Welcome";
import InviteCode from "./pages/onboarding/InviteCode";
import ArticlesRouter from "./articles/_ArticlesRouter";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import HowToDeleteAccount from "./pages/HowToDeleteAccount";
import ExercisesRouter from "./exercises/ExercisesRouter";
import WordsRouter from "./words/_WordsRouter";
import TranslateRouter from "./translate/_TranslateRouter";
import ReadingHistory from "./words/WordHistory";
import ActivityRouter from "./activity/_ActivityRouter";
import MyArticlesRouter from "./myArticles/_MyArticlesRouter";
import ArticleReader from "./reader/ArticleReader";
import SharedArticleHandler from "./reader/SharedArticleHandler";
import LoadingAnimation from "./components/LoadingAnimation";
import { getSharedSession } from "./utils/cookies/userInfo";
import LocalStorage from "./assorted/LocalStorage";
import { Capacitor } from "@capacitor/core";
import useAnonymousUpgrade from "./hooks/useAnonymousUpgrade";
import UpgradeAccountModal from "./components/UpgradeAccountModal";

// Lazy load separate parts of the app
const LazyTeacherRouter = lazy(() => import("./teacher/_routing/_TeacherRouter"));

// Wrapper components to handle Suspense (required for react-router v5)
const TeacherRouter = (props) => (
  <Suspense fallback={<LoadingAnimation />}>
    <LazyTeacherRouter {...props} />
  </Suspense>
);
import { PrivateRouteWithLayout } from "./PrivateRouteWithLayout";
import { PrivateRoute } from "./PrivateRoute";
import DeleteAccount from "./pages/DeleteAccount/DeleteAccount";
import SettingsRouter from "./pages/Settings/_SettingsRouter";
import ProfileRouter from "./profile/_ProfileRouter";
import ExercisesForArticle from "./exercises/ExercisesForArticle";
import { WEB_READER } from "./reader/ArticleReader";
import VideoPlayer from "./videos/VideoPlayer";
import DailyAudioRouter from "./dailyAudio/_DailyAudioRouter";
import IndividualExercise from "./pages/IndividualExercise";
import Swiper from "./swiper/Swiper";
import KeyboardTest from "./pages/KeyboardTest";
import Feature from "./features/Feature";

// Helper to detect if we're in a Capacitor native app
const isCapacitor = () => {
  const platform = Capacitor.getPlatform();
  return platform === 'ios' || platform === 'android';
};

// Component to handle mobile app homepage redirect
function HomePage() {
  // Check if user is logged in first
  const session = getSharedSession();
  if (session) {
    // User is logged in - redirect to articles (or last visited page)
    const lastVisitedPage = LocalStorage.getLastVisitedPage();
    const redirectTo = lastVisitedPage || "/articles";
    return <Redirect to={redirectTo} />;
  }

  // Not logged in - show appropriate page
  if (isCapacitor()) {
    // Mobile app: go to welcome page (ask if they have an account)
    return <Redirect to="/welcome" />;
  }
  // Web: show full landing page
  return <LandingPage />;
}

export default function MainAppRouter({ hasExtension, handleSuccessfulLogIn }) {
  const {
    shouldShowUpgrade,
    triggerReason,
    bookmarkCount,
    dismissUpgrade,
  } = useAnonymousUpgrade();

  return (
    <>
      <UpgradeAccountModal
        open={shouldShowUpgrade}
        onClose={dismissUpgrade}
        triggerReason={triggerReason}
        bookmarkCount={bookmarkCount}
      />
      <Switch>
      <Route path="/log_in" render={() => <LogIn handleSuccessfulLogIn={handleSuccessfulLogIn} />} />
      <Route path="/account_details" render={() => <CreateAccount handleSuccessfulLogIn={handleSuccessfulLogIn} />} />

      <Route path="/create_account" component={InviteCode} />

      <Route path="/invite_code" component={InviteCode} />
      <Route path="/language_preferences" component={LanguagePreferences} />
      <Route path="/welcome" component={Welcome} />


      <Route path="/" exact component={HomePage} />
      <Route path="/extension_installed" component={ExtensionInstalled} />
      <Route path="/install_extension" component={InstallExtension} />
      <Route path="/reset_pass" component={ResetPassword} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/howto/delete_account" component={HowToDeleteAccount} />
      <Route path="/render" component={NoSidebarRouter} />

      <PrivateRoute path="/account_deletion" component={DeleteAccount} />

      <PrivateRoute path="/verify_email" component={VerifyEmail} />

      <PrivateRoute path="/select_interests" hasExtension={hasExtension} component={SelectInterests} />

      <PrivateRoute path="/exclude_words" hasExtension={hasExtension} component={ExcludeWords} />

      <PrivateRouteWithLayout path="/articles" component={ArticlesRouter} />
      <PrivateRouteWithLayout path="/swiper" component={Swiper} />
      <PrivateRoute path="/watch/video" component={VideoPlayer} />
      <PrivateRouteWithLayout path="/exercises" component={ExercisesRouter} />
      <PrivateRouteWithLayout path="/daily-audio" component={DailyAudioRouter} />
      <PrivateRouteWithLayout path="/translate" component={TranslateRouter} />
      <PrivateRouteWithLayout path="/my-articles" component={MyArticlesRouter} />
      <PrivateRouteWithLayout path="/words" component={WordsRouter} />
      <PrivateRouteWithLayout path="/history" component={ReadingHistory} />
      <PrivateRouteWithLayout path="/activity-history" component={ActivityRouter} />
      <PrivateRouteWithLayout path="/account_settings" component={SettingsRouter} />
      {/* Only include profile router if gamification is enabled */}
      {Feature.has_gamification() ? (
        <PrivateRouteWithLayout path="/profile" component={ProfileRouter} />
      ) : (
        <Route path="/profile" component={NotFound} />
      )}
      <PrivateRouteWithLayout path="/teacher" component={TeacherRouter} />
      <PrivateRouteWithLayout path="/shared-article" component={SharedArticleHandler} />
      <PrivateRouteWithLayout path="/read/article" component={ArticleReader} />
      <Redirect from="/user_dashboard" to="/activity-history/statistics" />
      <PrivateRouteWithLayout path="/search" component={ArticlesRouter} />
      <PrivateRouteWithLayout
        path="/articleWordReview/:articleID"
        component={ExercisesForArticle}
        source={WEB_READER}
      />
      <PrivateRouteWithLayout path="/exercise/:exerciseType/:bookmarkId" component={IndividualExercise} />
      <PrivateRouteWithLayout path="/exercise-test/:exerciseType/:bookmarkId" component={IndividualExercise} />
      <PrivateRouteWithLayout
        path="/exercise-test/:exerciseType/:word/:translation/:context/:tokenized"
        component={IndividualExercise}
      />
      <PrivateRouteWithLayout
        path="/exercise-test/:exerciseType/:word/:translation/:context"
        component={IndividualExercise}
      />
      <PrivateRouteWithLayout path="/exercise-test" component={IndividualExercise} />
      <Route path="/keyboard-test" component={KeyboardTest} />
      <Route path="*" component={NotFound} />
    </Switch>
    </>
  );
}
