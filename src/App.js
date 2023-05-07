import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import LandingPage from "./landingPage/LandingPage";
import SignIn from "./pages/SignIn";
import { UserContext } from "./UserContext";
import { RoutingContext } from "./contexts/RoutingContext";
import LocalStorage from "./assorted/LocalStorage";
import Zeeguu_API from "./api/Zeeguu_API";
import LoggedInRouter from "./LoggedInRouter";
import CreateAccount from "./pages/CreateAccount";
import ResetPassword from "./pages/ResetPassword";
import useUILanguage from "./assorted/hooks/uiLanguageHook";
import { checkExtensionInstalled } from "./utils/misc/extensionCommunication";
import ExtensionInstalled from "./pages/ExtensionInstalled";
import {
  getUserSession,
  saveUserInfoIntoCookies,
  removeUserInfoFromCookies,
} from "./utils/cookies/userInfo";
import InstallExtension from "./pages/InstallExtension";

function App() {
  let userDict = {};

  // we use the _api to initialize the api state variable
  console.log("Got the API URL:" + process.env.REACT_APP_API_URL);
  console.log("Extension ID: " + process.env.REACT_APP_EXTENSION_ID);
  let _api = new Zeeguu_API(process.env.REACT_APP_API_URL);

  if (getUserSession()) {
    userDict = {
      session: getUserSession(),
      ...LocalStorage.userInfo(),
    };
    _api.session = getUserSession();
  }

  useUILanguage();

  const [api] = useState(_api);

  const [user, setUser] = useState(userDict);
  const [hasExtension, setHasExtension] = useState(false);

  useEffect(() => {
    // when creating the app component we also load the
    // user details from the server; this also ensures that
    // we get the latest feature flags for this user and save
    // them in the LocalStorage
    api.getUserDetails((data) => {
      LocalStorage.setUserInfo(data);
    });

    //logs out user on zeeguu.org if they log out of the extension
    const interval = setInterval(() => {
      if (!getUserSession()) {
        setUser({});
      }
    }, 1000);
    checkExtensionInstalled(setHasExtension);
    return () => clearInterval(interval);
  }, []);

  function handleSuccessfulSignIn(userInfo, history) {
    setUser({
      session: api.session,
      name: userInfo.name,
      learned_language: userInfo.learned_language,
      native_language: userInfo.native_language,
      is_teacher: userInfo.is_teacher,
      is_student: userInfo.is_student,
    });
    LocalStorage.setSession(api.session);
    LocalStorage.setUserInfo(userInfo);

    // Cookies are the mechanism via which we share a login
    // between the extension and the website
    saveUserInfoIntoCookies(userInfo, api.session);

    if (window.location.href.indexOf("create_account") > -1 && !hasExtension) {
      history.push("/install_extension");
    } else {
      userInfo.is_teacher && userInfo.name != "Mircea Lungu"
        ? history.push("/teacher/classes")
        : history.push("/articles");
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
        <UserContext.Provider value={{ ...user, logoutMethod: logout }}>
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

            <LoggedInRouter api={api} user={user} setUser={setUser} />
          </Switch>
        </UserContext.Provider>
      </RoutingContext.Provider>
    </BrowserRouter>
  );
}

export default App;
