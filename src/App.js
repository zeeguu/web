import React, { useState } from "react";
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
import {saveUserInfoIntoCookies, removeUserInfoFromCookies} from './utils/cookies/userInfo'


function App() {
  let userDict = {};

  // we use the _api to initialize the api state variable
  let _api = new Zeeguu_API(process.env.REACT_APP_API_URL);

  if (LocalStorage.hasSession()) {
    userDict = {
      session: localStorage["sessionID"],
      ...LocalStorage.userInfo(),
    };
    _api.session = localStorage["sessionID"];
  }

  useUILanguage();

  const [api] = useState(_api);

  const [user, setUser] = useState(userDict);

  function handleSuccessfulSignIn(userInfo, history) {
    setUser({
      session: api.session,
      name: userInfo.name,
      learned_language: userInfo.learned_language,
      native_language: userInfo.native_language,
      is_teacher: userInfo.is_teacher,
    });
    LocalStorage.setSession(api.session);
    LocalStorage.setUserInfo(userInfo);

    // Cookies are the mechanism via which we share a login
    // between the extension and the website
    saveUserInfoIntoCookies(userInfo, api.session);    

    userInfo.is_teacher
      ? history.push("/teacher/classes")
      : history.push("/articles");
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
