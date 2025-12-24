import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter } from "react-router-dom";

import { SystemLanguagesContext } from "./contexts/SystemLanguagesContext";
import { UserContext } from "./contexts/UserContext";
import { RoutingContext } from "./contexts/RoutingContext";
import { FeedbackContextProvider } from "./contexts/FeedbackContext";
import LocalStorage from "./assorted/LocalStorage";
import { APIContext } from "./contexts/APIContext";
import Zeeguu_API from "./api/Zeeguu_API";
import { ProgressProvider } from "./contexts/ProgressContext";
import useUILanguage from "./assorted/hooks/uiLanguageHook";

import ZeeguuSpeech from "./speech/APIBasedSpeech";
import { SpeechContext } from "./contexts/SpeechContext";
import { API_ENDPOINT, APP_DOMAIN } from "./appConstants";

import { getSharedSession, removeSharedUserInfo, saveSharedUserInfo } from "./utils/cookies/userInfo";

import MainAppRouter from "./MainAppRouter";
import { ToastContainer } from "react-toastify";
import useExtensionCommunication from "./hooks/useExtensionCommunication";
import { setUser } from "@sentry/react";
import SessionStorage from "./assorted/SessionStorage";
import useRedirectLink from "./hooks/useRedirectLink";
import useLocationTracker from "./hooks/useLocationTracker";
import LoadingAnimation from "./components/LoadingAnimation";

// Wrapper component to use location tracker inside Router context
function LocationTrackingWrapper({ children }) {
  useLocationTracker();
  return children;
}

function App() {
  const [api] = useState(new Zeeguu_API(API_ENDPOINT));

  useUILanguage();

  const [userDetails, setUserDetails] = useState();
  const [userPreferences, setUserPreferences] = useState();

  const [isExtensionAvailable] = useExtensionCommunication();
  const [zeeguuSpeech, setZeeguuSpeech] = useState(false);
  let { handleRedirectLinkOrGoTo } = useRedirectLink();

  const [systemLanguages, setSystemLanguages] = useState();

  useEffect(() => {
    api.getSystemLanguages((languages) => {
      setSystemLanguages(languages);
    });
  }, [api]);

  // Alphabetically sorted variant of systemLanguages for dropdowns
  const sortedSystemLanguages = useMemo(() => {
    if (!systemLanguages) return null;

    return {
      learnable_languages: [...systemLanguages.learnable_languages].sort((a, b) =>
        a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1,
      ),
      native_languages: [...systemLanguages.native_languages].sort((a, b) =>
        a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1,
      ),
    };
  }, [systemLanguages]);

  useEffect(() => {
    if (userDetails && userDetails.learned_language) {
      setZeeguuSpeech(new ZeeguuSpeech(api, userDetails.learned_language));
    }
    // eslint-disable-next-line
  }, [userDetails]);

  useEffect(() => {
    console.log("Got the API URL:" + API_ENDPOINT);
    console.log("Got the Domain URL:" + APP_DOMAIN);
    console.log("Extension ID: " + import.meta.env.VITE_EXTENSION_ID);
    // when creating the app component we also load the
    // user details from the server; this also ensures that
    // we get the latest feature flags for this user and save
    // them in the LocalStorage

    api.session = getSharedSession();
    console.log("Session from cookies: " + api.session);

    // Only validate if there is a session in cookies.
    if (api.session !== undefined) {
      console.log("Validating session...");
      api.isValidSession(
        () => {
          console.log("valid sesison... getting user details...");
          api.getUserDetails((userDetails) => {
            LocalStorage.setUserInfo(userDetails);
            api.getUserPreferences((userPreferences) => {
              LocalStorage.setUserPreferences(userPreferences);

              setZeeguuSpeech(new ZeeguuSpeech(api, userDetails.learned_language));
              setUserDetails(userDetails);
              setUserPreferences(userPreferences);
            });
          });
        },
        () => {
          console.log("Session validation FAILED - logging out");
          logout();
        },
      );
    } else {
      console.log("No session found in cookies");
    }

    //logs out user on zeeguu.org if they log out of the extension
    const interval = setInterval(() => {
      if (!getSharedSession()) {
        setUserDetails({});
        setUserPreferences({});
      }
    }, 1000);
    return () => clearInterval(interval);

    // eslint-disable-next-line
  }, []);

  function logout() {
    LocalStorage.deleteUserInfo();
    LocalStorage.deleteUserPreferences();
    setUserDetails({});
    setUserPreferences({});

    removeSharedUserInfo();
  }

  function handleSuccessfulLogIn(userInfo, sessionId, redirectToArticle = true) {
    console.log("HANDLE SUCCESSFUL SIGN IN");
    api.session = sessionId;
    LocalStorage.setUserInfo(userInfo);

    // TODO: Should this be moved to Settings.loadUsrePreferences?
    api.getUserPreferences((preferences) => {
      SessionStorage.setAudioExercisesEnabled(
        preferences["audio_exercises"] === undefined || preferences["audio_exercises"] === "true",
      );
    });

    // Save shared user info for extension/web communication
    saveSharedUserInfo(userInfo, api.session);
    let newUserValue = {
      session: api.session,
      name: userInfo.name,
      learned_language: userInfo.learned_language,
      native_language: userInfo.native_language,
      is_teacher: userInfo.is_teacher,
      is_student: userInfo.is_student,
    };

    console.log("setting new user value: ");
    console.log(JSON.stringify(newUserValue));
    setUser(newUserValue);

    // If a redirect link exists, uses it to redirect the user,
    // otherwise, uses the location from the function argument.
    // For the future consider taking the redirection out of this function alltogether.
    if (redirectToArticle) handleRedirectLinkOrGoTo("/articles");
  }

  //Setting up the routing context to be able to use the cancel-button in EditText correctly
  const [returnPath, setReturnPath] = useState("");

  if (userDetails === undefined) {
    return <LoadingAnimation />;
  }


  return (
    <SystemLanguagesContext.Provider value={{ systemLanguages, sortedSystemLanguages }}>
      <SpeechContext.Provider value={zeeguuSpeech}>
        <BrowserRouter>
          <LocationTrackingWrapper>
            <RoutingContext.Provider value={{ returnPath, setReturnPath }}>
              <UserContext.Provider
                value={{
                  userDetails,
                  setUserDetails,
                  userPreferences,
                  setUserPreferences,
                  session: getSharedSession(),
                  logoutMethod: logout,
                }}
              >
                <ProgressProvider>
                  <APIContext.Provider value={api}>
                    <FeedbackContextProvider>
                      {/* Routing*/}

                      <MainAppRouter
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
                    </FeedbackContextProvider>
                  </APIContext.Provider>
                </ProgressProvider>
              </UserContext.Provider>
            </RoutingContext.Provider>
          </LocationTrackingWrapper>
        </BrowserRouter>
      </SpeechContext.Provider>
    </SystemLanguagesContext.Provider>
  );
}

export default App;
