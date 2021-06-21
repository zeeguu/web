import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import LandingPage from "./landingPage/LandingPage";
import SignIn from "./pages/SignIn";
import { UserContext } from "./UserContext";

import LocalStorage from "./assorted/LocalStorage";
import Zeeguu_API from "./api/Zeeguu_API";
import LoggedInRouter from "./LoggedInRouter";
import CreateAccount from "./pages/CreateAccount";
import ResetPassword from "./pages/ResetPassword";

import strings from "./i18n/definitions";

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

  const [uiLanguage, setUiLanguage] = useState(LocalStorage.getUiLanguage());

  useEffect(() => {
    const uiLang = LocalStorage.getUiLanguage();
    if (uiLang === undefined) {
      LocalStorage.setUiLanguage({ code: "en" });
    }
    setUiLanguage(uiLang);
  }, []);

  useEffect(() => {
    if (uiLanguage !== undefined) strings.setLanguage(uiLanguage.code);
  }, [uiLanguage]);

  const [api] = useState(_api);

  const [user, setUser] = useState(userDict);

  function handleSuccessfulSignIn(userInfo) {
    setUser({
      session: api.session,
      name: userInfo.name,
      learned_language: userInfo.learned_language,
      native_language: userInfo.native_language,
      is_teacher: userInfo.is_teacher,
    });
    LocalStorage.setSession(api.session);
    LocalStorage.setUserInfo(userInfo);

    // TODO: this is required by the teacher dashboard
    // could be cool to remove it from there and make that
    // one also use the localStorage
    document.cookie = `sessionID=${api.session};`;
  }

  function logout() {
    LocalStorage.deleteUserInfo();
    setUser({});

    // expire cookies, cf. https://stackoverflow.com/a/27374365/1200070
    document.cookie.split(";").forEach(function (c) {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
  }

  return (
    <BrowserRouter>
      <UserContext.Provider value={{ ...user, logoutMethod: logout }}>
        <Switch>
          <Route path="/" exact component={LandingPage} />

          {/* cf: https://ui.dev/react-router-v4-pass-props-to-components/ */}
          <Route
            path="/login"
            render={() => (
              <SignIn
                api={api}
                notifySuccessfulSignIn={handleSuccessfulSignIn}
              />
            )}
          />

          <Route
            path="/create_account"
            render={() => (
              <CreateAccount
                api={api}
                notifySuccessfulSignIn={handleSuccessfulSignIn}
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
    </BrowserRouter>
  );
}

export default App;
