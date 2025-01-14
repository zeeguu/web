import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";

import ExerciseNotifications from "./exercises/ExerciseNotification";
import { ExerciseCountContext } from "./exercises/ExerciseCountContext";
import { UserContext } from "./contexts/UserContext";
import { RoutingContext } from "./contexts/RoutingContext";
import LocalStorage from "./assorted/LocalStorage";
import { APIContext } from "./contexts/APIContext";
import Zeeguu_API from "./api/Zeeguu_API";

import useUILanguage from "./assorted/hooks/uiLanguageHook";

import ZeeguuSpeech from "./speech/APIBasedSpeech";
import { SpeechContext } from "./contexts/SpeechContext";
import { API_ENDPOINT, APP_DOMAIN } from "./appConstants";

import {
  getSessionFromCookies,
  removeUserInfoFromCookies,
  saveUserInfoIntoCookies,
} from "./utils/cookies/userInfo";

import MainAppRouter from "./MainAppRouter";
import { ToastContainer } from "react-toastify";
import useExtensionCommunication from "./hooks/useExtensionCommunication";
import { setUser } from "@sentry/react";
import SessionStorage from "./assorted/SessionStorage";
import useRedirectLink from "./hooks/useRedirectLink";
import LoadingAnimation from "./components/LoadingAnimation";
import { userHasNotExercisedToday } from "./exercises/utils/daysSinceLastExercise";

import { MainNavContext } from "./contexts/MainNavContext";

function App() {
  const [api] = useState(new Zeeguu_API(API_ENDPOINT));

  const [exerciseNotification] = useState(new ExerciseNotifications());

  useUILanguage();

  const [userData, setUserData] = useState();
  const [isExtensionAvailable] = useExtensionCommunication();
  const [zeeguuSpeech, setZeeguuSpeech] = useState(false);
  let { handleRedirectLinkOrGoTo } = useRedirectLink();

  useEffect(() => {
    if (userData && userData.learned_language) {
      setZeeguuSpeech(new ZeeguuSpeech(api, userData.learned_language));
    }
  }, [userData]);

  useEffect(() => {
    console.log("Got the API URL:" + API_ENDPOINT);
    console.log("Got the Domain URL:" + APP_DOMAIN);
    console.log("Extension ID: " + process.env.REACT_APP_EXTENSION_ID);
    // when creating the app component we also load the
    // user details from the server; this also ensures that
    // we get the latest feature flags for this user and save
    // them in the LocalStorage

    api.session = getSessionFromCookies();
    console.log("Session: " + api.session);

    // Only validate if there is a session in cookies.
    if (api.session !== undefined)
      api.isValidSession(
        () => {
          console.log("valid sesison... getting user details...");
          api.getUserDetails((data) => {
            LocalStorage.setUserInfo(data);
            api.getUserPreferences((preferences) => {
              LocalStorage.setUserPreferences(preferences);

              let userDict = {
                session: getSessionFromCookies(),
                ...LocalStorage.userInfo(),
              };
              console.log("Session: " + api.session);

              if (userHasNotExercisedToday())
                api.getUserBookmarksToStudy(1, (scheduledBookmaks) => {
                  exerciseNotification.setHasExercises(
                    scheduledBookmaks.length > 0,
                  );
                  exerciseNotification.updateReactState();
                });
              else {
                exerciseNotification.setHasExercises(false);
                exerciseNotification.updateReactState();
              }
              setZeeguuSpeech(new ZeeguuSpeech(api, userDict.learned_language));
              setUserData(userDict);
            });
          });
        },
        () => {
          console.log("no valid session");
          logout();
        },
      );

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

  function handleSuccessfulLogIn(userInfo, sessionId) {
    console.log("HANDLE SUCCESSFUL SIGN IN");
    api.session = sessionId;
    console.log("Session: " + api.session);
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

    /* If a redirect link exists, uses it to redirect the user,
        otherwise, uses the location from the function argument. */
    handleRedirectLinkOrGoTo("/articles");
  }

  //Setting up the routing context to be able to use the cancel-button in EditText correctly
  const [returnPath, setReturnPath] = useState("");

  //Setting up the main nav context
  const [mainNav, setMainNav] = useState({ isOnStudentSide: true });

  if (userData === undefined) {
    return <LoadingAnimation />;
  }

  return (
    <SpeechContext.Provider value={zeeguuSpeech}>
      <BrowserRouter>
        <RoutingContext.Provider value={{ returnPath, setReturnPath }}>
          <UserContext.Provider value={{ ...userData, logoutMethod: logout }}>
            <ExerciseCountContext.Provider value={exerciseNotification}>
              <APIContext.Provider value={api}>
                <MainNavContext.Provider value={{ mainNav, setMainNav }}>
                  {/* Routing*/}
                  <MainAppRouter
                    api={api}
                    setUser={setUserData}
                    hasExtension={isExtensionAvailable}
                    handleSuccessfulLogIn={handleSuccessfulLogIn}
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
                </MainNavContext.Provider>
              </APIContext.Provider>
            </ExerciseCountContext.Provider>
          </UserContext.Provider>
        </RoutingContext.Provider>
      </BrowserRouter>
    </SpeechContext.Provider>
  );
}

export default App;
