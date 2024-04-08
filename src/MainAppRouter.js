import { Route, Switch, useHistory } from "react-router-dom";
import LandingPage from "./landingPage/LandingPage";
import ExtensionInstalled from "./pages/ExtensionInstalled";
import InstallExtension from "./pages/InstallExtension";
import SelectInterests from "./pages/SelectInterests";
import ResetPassword from "./pages/ResetPassword";
import NoSidebarRouter from "./NoSidebarRouter";
import React, { useState } from "react";
import SignIn from "./pages/SignIn";
import CreateAccount from "./pages/CreateAccount";
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
import { isSupportedBrowser } from "./utils/misc/browserDetection";

export default function MainAppRouter({ api, setUser, hasExtension }) {
  const [redirectLink, setRedirectLink] = useState(null);
  const history = useHistory();

  function handleSuccessfulSignIn(userInfo) {
    LocalStorage.setSession(api.session);
    LocalStorage.setUserInfo(userInfo);
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

    if (redirectLink !== null) {
      window.location.href = redirectLink;
    } else if (
      window.location.href.indexOf("create_account") > -1 &&
      !hasExtension &&
      isSupportedBrowser()
    ) {
      history.push("/select_interests");
    } else {
      console.log("history");
      console.log(history);
      console.log("pushing the /articles...");
      history.push("/articles");
    }
  }

  return (
    <Switch>
      <Route
        path="/login"
        render={() => (
          <SignIn
            api={api}
            signInAndRedirect={handleSuccessfulSignIn}
            setRedirectLink={setRedirectLink}
          />
        )}
      />
      <Route
        path="/create_account"
        render={() => (
          <CreateAccount api={api} signInAndRedirect={handleSuccessfulSignIn} />
        )}
      />

      <Route path="/" exact render={() => <LandingPage />} />

      <Route
        path="/extension_installed"
        render={() => <ExtensionInstalled api={api} />}
      />

      <Route
        path="/select_interests"
        render={() => <SelectInterests hasExtension={hasExtension} api={api} />}
      />

      <Route path="/install_extension" render={() => <InstallExtension />} />

      <Route path="/reset_pass" render={() => <ResetPassword api={api} />} />

      <Route path="/render" render={() => <NoSidebarRouter api={api} />} />

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
