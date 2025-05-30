import React, { useState, useEffect, useMemo } from "react";
import { BrowserRouter } from "react-router-dom";

import { SystemLanguagesContext } from "./contexts/SystemLanguagesContext";
import { UserContext } from "./contexts/UserContext";
import { RoutingContext } from "./contexts/RoutingContext";
import LocalStorage from "./assorted/LocalStorage";
import { APIContext } from "./contexts/APIContext";
import Zeeguu_API from "./api/Zeeguu_API";

import useUILanguage from "./assorted/hooks/uiLanguageHook";

import ZeeguuSpeech from "./speech/APIBasedSpeech";
import { SpeechContext } from "./contexts/SpeechContext";
import { API_ENDPOINT, APP_DOMAIN } from "./appConstants";

import { getSessionFromCookies, removeUserInfoFromCookies, saveUserInfoIntoCookies } from "./utils/cookies/userInfo";

import MainAppRouter from "./MainAppRouter";
import { ToastContainer } from "react-toastify";
import useExtensionCommunication from "./hooks/useExtensionCommunication";
import { setUser } from "@sentry/react";
import SessionStorage from "./assorted/SessionStorage";
import useRedirectLink from "./hooks/useRedirectLink";
import LoadingAnimation from "./components/LoadingAnimation";
import TopBar from "./components/TopNav/TopBar";
import {getWeeklyTranslatedWordsTopBar, calculateWeeklyReadingMinutes, countConsecutivePracticeWeeks} from "./utils/progressTracking/ProgressOverviewItems";

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

  const [weeklyTranslated, setWeeklyTranslated] = useState(null);
  const [weeklyReadingMinutes, setWeeklyReadingMinutes] = useState(null);
  const [weeksPracticed, setWeeksPracticed] = useState(0);

  useEffect(() => {

    if (!api.session) {
      console.log("Not authenticated yet, skipping API calls");
      return;
    }
    const fetchData = () => {
    api.getBookmarksCountsByDate((counts) => {
      const thisWeek = getWeeklyTranslatedWordsTopBar(counts);
      console.log("thisWeek", thisWeek)
      const weeklyTotal = thisWeek.reduce((sum, day) => sum + day.count, 0);
      console.log("weeklyTotal", weeklyTotal)
      setWeeklyTranslated(weeklyTotal);
    });
  
    api.getUserActivityByDay((activity) => {
      const readingMinsPerWeek = calculateWeeklyReadingMinutes(activity.reading);
      setWeeklyReadingMinutes(readingMinsPerWeek);

      const weeksPracticed = countConsecutivePracticeWeeks(activity);
      setWeeksPracticed(weeksPracticed);
      console.log("weeksPracticed", weeksPracticed);
    });

  };
  fetchData();

  }, [api, api.session, api.logUserActivity, ]);

  console.log("weeklyTranslate", weeklyTranslated )
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
          console.log("no valid session");
          logout();
        },
      );

    //logs out user on zeeguu.org if they log out of the extension
    const interval = setInterval(() => {
      if (!getSessionFromCookies()) {
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

    removeUserInfoFromCookies();
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
          <RoutingContext.Provider value={{ returnPath, setReturnPath }}>
            <UserContext.Provider
              value={{
                userDetails,
                setUserDetails,
                userPreferences,
                setUserPreferences,
                session: getSessionFromCookies(),
                logoutMethod: logout,
              }}
            >
              <APIContext.Provider value={api}>
                {/* Routing*/}
                <TopBar weeklyTranslated={weeklyTranslated} weeklyReadingMinutes={weeklyReadingMinutes} weeksPracticed={weeksPracticed}/>
                <MainAppRouter hasExtension={isExtensionAvailable} handleSuccessfulLogIn={handleSuccessfulLogIn} />
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
    </SystemLanguagesContext.Provider>
  );
}

export default App;
