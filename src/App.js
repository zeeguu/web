import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import LandingPage from "./landingPage/LandingPage";
import SignIn from "./pages/SignIn";
import { UserContext } from "./UserContext";
import { RoutingContext } from "./contexts/RoutingContext";
import LocalStorage from "./assorted/LocalStorage";
import SessionStorage from "./assorted/SessionStorage";
import Zeeguu_API from "./api/Zeeguu_API";
import LoggedInRouter from "./LoggedInRouter";
import CreateAccount from "./pages/CreateAccount";
import ResetPassword from "./pages/ResetPassword";
import useUILanguage from "./assorted/hooks/uiLanguageHook";
import { checkExtensionInstalled } from "./utils/misc/extensionCommunication";
import ExtensionInstalled from "./pages/ExtensionInstalled";
import NoSidebarRouter from "./NoSidebarRouter.js";
import ZeeguuSpeech from "./speech/ZeeguuSpeech";

import {
  getUserSession,
  saveUserInfoIntoCookies,
  removeUserInfoFromCookies,
} from "./utils/cookies/userInfo";
import InstallExtension from "./pages/InstallExtension";

function App() {
  let userDict = {};

  let api = new Zeeguu_API(process.env.REACT_APP_API_URL);

  if (getUserSession()) {
    userDict = {
      session: getUserSession(),
      ...LocalStorage.userInfo(),
    };
    api.session = getUserSession();
  }

  useUILanguage();

  const [userData, setUserData] = useState(userDict);
  const [hasExtension, setHasExtension] = useState(false);
  const [zeeguuSpeech, setZeeguuSpeech] = useState(null);

  function setUser(dict) {
    setUserData(dict);
    // If the dictionary is not empty (the user data was set)
    // Create the ZeeguuSpeech object
    if (Object.keys(dict).length !== 0)
      setZeeguuSpeech(new ZeeguuSpeech(api, dict.learned_language));
  }

  useEffect(() => {
    // console.log("Running callback!");
    setZeeguuSpeech(new ZeeguuSpeech(api, userData.learned_language));
  }, []);

  useEffect(() => {
    console.log("Got the API URL:" + process.env.REACT_APP_API_URL);
    console.log("Extension ID: " + process.env.REACT_APP_EXTENSION_ID);
    // when creating the app component we also load the
    // user details from the server; this also ensures that
    // we get the latest feature flags for this user and save
    // them in the LocalStorage
    if (getUserSession()) {
      console.log("getting user details...");
      api.getUserDetails((data) => {
        LocalStorage.setUserInfo(data);
      });
    }

    //logs out user on zeeguu.org if they log out of the extension

    const interval = setInterval(() => {
      if (!getUserSession()) {
        // Avoid logging on production.
        // console.log("Unsetting user!");
        setUser({});
      }
    }, 1000);
    checkExtensionInstalled(setHasExtension);
    return () => clearInterval(interval);

    // eslint-disable-next-line
  }, []);

  function handleSuccessfulSignIn(userInfo, history) {
    LocalStorage.setSession(api.session);
    LocalStorage.setUserInfo(userInfo);
    api.getUserPreferences((preferences) => {
      SessionStorage.setAudioExercisesEnabled(
        preferences["audio_exercises"] === undefined ||
          preferences["audio_exercises"] === "true"
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

    if (window.location.href.indexOf("create_account") > -1 && !hasExtension) {
      history.push("/install_extension");
    } else {
      history.push("/articles");
    }
  }

  function logout() {
    LocalStorage.deleteUserInfo();
    setUser({});

    removeUserInfoFromCookies();
  }
  //Setting up the routing context to be able to use the cancel-button in EditText correctly
  const [returnPath, setReturnPath] = useState("");

  return (
    <BrowserRouter>
      <RoutingContext.Provider value={{ returnPath, setReturnPath }}>
        <UserContext.Provider value={{ ...userData, logoutMethod: logout }}>
          <Switch>
            <Route path="/" exact component={LandingPage} />

            {/* cf: https://ui.dev/react-router-v4-pass-props-to-components/ */}
            <Route
              path="/login"
              render={() => (
                <SignIn api={api} signInAndRedirect={handleSuccessfulSignIn} />
              )}
            />

            <Route
              path="/create_account"
              render={() => (
                <CreateAccount
                  api={api}
                  signInAndRedirect={handleSuccessfulSignIn}
                />
              )}
            />

            <Route
              path="/extension_installed"
              render={() => <ExtensionInstalled api={api} />}
            />

            <Route
              path="/install_extension"
              render={() => <InstallExtension />}
            />

            <Route
              path="/reset_pass"
              render={() => <ResetPassword api={api} />}
            />

            <Route
              path="/render"
              render={() => <NoSidebarRouter api={api} />}
            />

            <LoggedInRouter
              api={api}
              speechEngine={zeeguuSpeech}
              setUser={setUser}
            />
          </Switch>
        </UserContext.Provider>
      </RoutingContext.Provider>
    </BrowserRouter>
  );
}

export default App;
