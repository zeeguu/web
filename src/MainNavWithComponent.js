import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { ThemeProvider } from "styled-components";
import { MainNavContext } from "./contexts/MainNavContext";
import { UserContext } from "./contexts/UserContext";
import useScreenWidth from "./hooks/useScreenWidth";
import SideNav from "./components/MainNav/SideNav/SideNav";
import BottomNav from "./components/MainNav/BottomNav/BottomNav";
import { mainNavTheme } from "./components/MainNav/mainNavTheme";
import * as s from "./MainNavWithComponent.sc";
import { ExercisesCounterContext } from "./exercises/ExercisesCounterContext";

import useExercisesCounterNotification from "./hooks/useExercisesCounterNotification";
import useStreakMilestone from "./hooks/useStreakMilestone";
import StreakBanner from "./components/StreakBanner";
import { MOBILE_WIDTH } from "./components/MainNav/screenSize";
import DailyFeedbackBanner from "./components/DailyFeedbackBanner";
import Feature from "./features/Feature";

export default function MainNavWithComponent(props) {
  const { children: appContent } = props;
  const { screenWidth } = useScreenWidth();
  const { userDetails } = useContext(UserContext);

  const {
    hasExerciseNotification,
    totalExercisesInPipeline,
    updateExercisesCounter,
    decrementExerciseCounter,
    incrementExerciseCounter,
    hideExerciseCounter,
  } = useExercisesCounterNotification();

  const path = useLocation().pathname;

  useStreakMilestone();

  //Initial state and setter passed to the value prop of the MainNavContext.Provider
  const [mainNavProperties, setMainNavProperties] = useState({
    isOnStudentSide: true,
  });

  useEffect(() => {
    setMainNavProperties({
      ...mainNavProperties,
      isOnStudentSide: !path.includes("teacher"),
    });
    // eslint-disable-next-line
  }, [path]);

  // Scroll to top when navigating between main sections
  useEffect(() => {
    const scrollHolder = document.getElementById("scrollHolder");
    if (scrollHolder) {
      scrollHolder.scrollTo(0, 0);
    }
  }, [path]);

  return (
    <MainNavContext.Provider
      value={{
        mainNavProperties: mainNavProperties,
        setMainNavProperties: setMainNavProperties,
      }}
    >
      <ExercisesCounterContext.Provider
        value={{
          hasExerciseNotification: hasExerciseNotification,
          totalExercisesInPipeline: totalExercisesInPipeline,
          updateExercisesCounter: updateExercisesCounter,
          decrementExerciseCounter: decrementExerciseCounter,
          incrementExerciseCounter: incrementExerciseCounter,
          hideExerciseCounter: hideExerciseCounter,
        }}
      >
        <ThemeProvider theme={mainNavProperties.isOnStudentSide ? mainNavTheme.student : mainNavTheme.teacher}>
          <s.MainNavWithComponent $screenWidth={screenWidth}>
            <s.NavArea>
              {screenWidth > MOBILE_WIDTH && <SideNav screenWidth={screenWidth} />}
            </s.NavArea>
            <s.AppContent
              // Update the key when the learned_language changes to trigger a re-render
              // of the app content that needs real-time updates. This is a smoother
              // alternative to window.location.reload() when switching the practiced language in navigation.
              key={userDetails.learned_language}
              $screenWidth={screenWidth}
              id="scrollHolder"
            >
              {screenWidth <= MOBILE_WIDTH && <StreakBanner />}
              {screenWidth <= MOBILE_WIDTH && Feature.daily_feedback() && <DailyFeedbackBanner />}
              {appContent}
            </s.AppContent>
            {screenWidth <= MOBILE_WIDTH && <BottomNav />}
          </s.MainNavWithComponent>
        </ThemeProvider>
      </ExercisesCounterContext.Provider>
    </MainNavContext.Provider>
  );
}
