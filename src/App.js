import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch } from "react-router-dom";

import { UserContext } from "./contexts/UserContext";
import { RoutingContext } from "./contexts/RoutingContext";
import LocalStorage from "./assorted/LocalStorage";
import { APIContext } from "./contexts/APIContext";
import Zeeguu_API from "./api/Zeeguu_API";

import useUILanguage from "./assorted/hooks/uiLanguageHook";
import { checkExtensionInstalled } from "./utils/misc/extensionCommunication";

import ZeeguuSpeech from "./speech/APIBasedSpeech";
import { SpeechContext } from "./contexts/SpeechContext";

import {
  getUserSession,
  removeUserInfoFromCookies,
} from "./utils/cookies/userInfo";

import MainAppRouter from "./MainAppRouter";
import { ToastContainer } from "react-toastify";

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
    if (getUserSession()) {
      console.log("getting user details...");
      api.getUserDetails((data) => {
        LocalStorage.setUserInfo(data);
      });
    }

    //logs out user on zeeguu.org if they log out of the extension

    const interval = setInterval(() => {
      if (!getUserSession()) {
        setUserData({});
      }
    }, 1000);
    checkExtensionInstalled(setHasExtension);
    return () => clearInterval(interval);

    // eslint-disable-next-line
  }, []);

  function logout() {
    LocalStorage.deleteUserInfo();
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
                hasExtension={hasExtension}
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
