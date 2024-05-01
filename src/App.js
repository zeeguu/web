import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch } from "react-router-dom";

import { UserContext } from "./contexts/UserContext";
import { RoutingContext } from "./contexts/RoutingContext";
import LocalStorage from "./assorted/LocalStorage";
import { APIContext } from "./contexts/APIContext";
import Zeeguu_API from "./api/Zeeguu_API";

import useUILanguage from "./assorted/hooks/uiLanguageHook";
import { checkExtensionInstalled } from "./utils/extension/extensionCommunication";

import ZeeguuSpeech from "./speech/APIBasedSpeech";
import { SpeechContext } from "./contexts/SpeechContext";

import {
  getSessionFromCookies,
  removeUserInfoFromCookies,
} from "./utils/cookies/userInfo";

import MainAppRouter from "./MainAppRouter";
import { ToastContainer } from "react-toastify";
import useExtensionCommunication from "./hooks/useExtensionCommunication";

function App() {
  let api = new Zeeguu_API(process.env.REACT_APP_API_URL);

  let userDict = {};

  if (getSessionFromCookies()) {
    userDict = {
      session: getSessionFromCookies(),
      ...LocalStorage.userInfo(),
    };
    api.session = getSessionFromCookies();
  }

  useUILanguage();

  const [userData, setUserData] = useState(userDict);
  const [isExtensionAvailable] = useExtensionCommunication();
  const [zeeguuSpeech, setZeeguuSpeech] = useState(false);

  useEffect(() => {
    if (Object.keys(userData).length !== 0) {
      setZeeguuSpeech(new ZeeguuSpeech(api, userData.learned_language));
    }
  }, [userData]);

  useEffect(() => {
    console.log("Got the API URL:" + process.env.REACT_APP_API_URL);
    console.log("Extension ID: " + process.env.REACT_APP_EXTENSION_ID);
    // when creating the app component we also load the
    // user details from the server; this also ensures that
    // we get the latest feature flags for this user and save
    // them in the LocalStorage
    if (getSessionFromCookies()) {
      console.log("getting user details...");
      api.getUserDetails((data) => {
        LocalStorage.setUserInfo(data);
      });
      api.getUserPreferences((preferences) => {
        LocalStorage.setUserPreferences(preferences);
      });
    }

    //logs out user on zeeguu.org if they log out of the extension

    const interval = setInterval(() => {
      if (!getSessionFromCookies()) {
        setUserData({});
      }
    }, 1000);
    return () => clearInterval(interval);

    // eslint-disable-next-line
  }, []);

  function logout() {
    LocalStorage.deleteUserInfo();
    LocalStorage.deleteUserPreferences();
    setUserData({});

    removeUserInfoFromCookies();
  }

  //Setting up the routing context to be able to use the cancel-button in EditText correctly
  const [returnPath, setReturnPath] = useState("");

  return (
    <SpeechContext.Provider value={zeeguuSpeech}>
      <BrowserRouter>
        <RoutingContext.Provider value={{ returnPath, setReturnPath }}>
          <UserContext.Provider value={{ ...userData, logoutMethod: logout }}>
            <APIContext.Provider value={api}>
              {/* Routing*/}
              <MainAppRouter
                api={api}
                setUser={setUserData}
                hasExtension={isExtensionAvailable}
              />

              <ToastContainer
                position="bottom-right"
                autoClose={2000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
            </APIContext.Provider>
          </UserContext.Provider>
        </RoutingContext.Provider>
      </BrowserRouter>
    </SpeechContext.Provider>
  );
}

export default App;
