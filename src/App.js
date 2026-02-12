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

import { getSharedSession, removeSharedUserInfo, saveSharedUserInfo, initializeSession } from "./utils/cookies/userInfo";
import { Capacitor } from "@capacitor/core";

import MainAppRouter from "./MainAppRouter";
import { ToastContainer } from "react-toastify";
import useExtensionCommunication from "./hooks/useExtensionCommunication";
import { setUser } from "@sentry/react";
import SessionStorage from "./assorted/SessionStorage";
import useRedirectLink from "./hooks/useRedirectLink";
import useLocationTracker from "./hooks/useLocationTracker";
import useDeepLinkHandler from "./hooks/useDeepLinkHandler";
import LoadingAnimation from "./components/LoadingAnimation";

// Helper to detect if we're in a Capacitor native app
const isCapacitor = () => {
  const platform = Capacitor.getPlatform();
  return platform === "ios" || platform === "android";
};

// Generate a UUID v4
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Wrapper component to use location tracker inside Router context
function LocationTrackingWrapper({ children }) {
  useLocationTracker();
  useDeepLinkHandler();
  return children;
}

function App() {
  const [api] = useState(new Zeeguu_API(API_ENDPOINT));

  useUILanguage();

  const [userDetails, setUserDetails] = useState();
  const [userPreferences, setUserPreferences] = useState();
  const [sessionInitialized, setSessionInitialized] = useState(false);

  const [isExtensionAvailable] = useExtensionCommunication();
  const [zeeguuSpeech, setZeeguuSpeech] = useState(false);
  let { handleRedirectLinkOrGoTo } = useRedirectLink();

  const [systemLanguages, setSystemLanguages] = useState();

  // Initialize session from native storage (for Capacitor) before doing anything else
  useEffect(() => {
    initializeSession().then(() => {
      setSessionInitialized(true);
    });
  }, []);

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

  // Poll for audio lesson generation progress when status is "generating"
  useEffect(() => {
    if (userDetails?.daily_audio_status !== "generating") return;

    const pollInterval = setInterval(() => {
      api.getAudioLessonGenerationProgress(
        (progress) => {
          if (!progress || progress.status === "done") {
            // Generation finished - update status
            setUserDetails((prev) => ({ ...prev, daily_audio_status: "ready" }));
          } else if (progress.status === "error") {
            // Generation failed - reset to available
            setUserDetails((prev) => ({ ...prev, daily_audio_status: null }));
          }
          // Otherwise keep polling
        },
        () => {
          // API error - check if lesson exists
          api.getTodaysLesson(
            (data) => {
              if (data?.lesson_id) {
                setUserDetails((prev) => ({
                  ...prev,
                  daily_audio_status: data.is_completed ? "completed" : "ready",
                }));
              }
            },
            () => {},
          );
        },
      );
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [userDetails?.daily_audio_status, api]);

  useEffect(() => {
    // Wait for session to be initialized (especially important for Capacitor)
    if (!sessionInitialized) return;

    console.log("Got the API URL:" + API_ENDPOINT);
    console.log("Got the Domain URL:" + APP_DOMAIN);
    console.log("Extension ID: " + import.meta.env.VITE_EXTENSION_ID);
    // when creating the app component we also load the
    // user details from the server; this also ensures that
    // we get the latest feature flags for this user and save
    // them in the LocalStorage

    api.session = getSharedSession();

    // Only validate if there is a session.
    if (api.session !== undefined && api.session !== null) {
      api.isValidSession(
        () => {
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
          logout();
        },
      );
    } else {
      // No session - user is not logged in
      // On mobile (Capacitor), try to restore anonymous session if credentials exist
      if (isCapacitor()) {
        tryRestoreAnonymousSession();
      } else {
        setUserDetails({});
        setUserPreferences({});
      }
    }

    // Try to restore an existing anonymous session (returning user)
    function tryRestoreAnonymousSession() {
      const anonCredentials = LocalStorage.getAnonCredentials();

      if (anonCredentials) {
        // Try to log in with existing anonymous credentials
        console.log("Found anonymous credentials, attempting login...");
        api.logInAnon(
          anonCredentials.uuid,
          anonCredentials.password,
          (session) => {
            console.log("Anonymous login successful");
            api.session = session;
            saveSharedUserInfo({ name: "Guest", native_language: "en" }, session);
            loadUserDetailsAfterLogin();
          },
          (error) => {
            // Login failed - credentials might be invalid
            console.log("Anonymous login failed, clearing credentials...", error);
            LocalStorage.clearAnonCredentials();
            // Let them go through welcome flow again
            setUserDetails({});
            setUserPreferences({});
          },
        );
      } else {
        // No stored credentials - new user, will go through welcome flow
        // (welcome -> login or language_preferences -> anonymous account)
        setUserDetails({});
        setUserPreferences({});
      }
    }

    function loadUserDetailsAfterLogin() {
      api.getUserDetails((userDetails) => {
        LocalStorage.setUserInfo(userDetails);
        api.getUserPreferences((userPreferences) => {
          LocalStorage.setUserPreferences(userPreferences);
          setZeeguuSpeech(new ZeeguuSpeech(api, userDetails.learned_language));
          setUserDetails(userDetails);
          setUserPreferences(userPreferences);
        });
      });
    }

    // Log out user on zeeguu.org if they log out of the extension
    const interval = setInterval(() => {
      if (!getSharedSession()) {
        setUserDetails({});
        setUserPreferences({});
      }
    }, 1000);
    return () => clearInterval(interval);

    // eslint-disable-next-line
  }, [sessionInitialized]);

  function logout() {
    LocalStorage.deleteUserInfo();
    LocalStorage.deleteUserPreferences();
    LocalStorage.clearAnonCredentials(); // Clear anonymous credentials on logout
    setUserDetails({});
    setUserPreferences({});

    removeSharedUserInfo();
  }

  function handleSuccessfulLogIn(userInfo, sessionId, redirectToArticle = true) {
    console.log("HANDLE SUCCESSFUL SIGN IN");
    api.session = sessionId;
    LocalStorage.setUserInfo(userInfo);
    LocalStorage.clearAnonCredentials(); // Clear anonymous credentials on real login

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

  // Wait for session initialization and user details loading
  if (!sessionInitialized || userDetails === undefined) {
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
                <APIContext.Provider value={api}>
                  <ProgressProvider>
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
                  </ProgressProvider>
                </APIContext.Provider>
              </UserContext.Provider>
            </RoutingContext.Provider>
          </LocationTrackingWrapper>
        </BrowserRouter>
      </SpeechContext.Provider>
    </SystemLanguagesContext.Provider>
  );
}

export default App;
