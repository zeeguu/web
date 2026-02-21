import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { MainNavContext } from "./contexts/MainNavContext";
import { UserContext } from "./contexts/UserContext";
import useScreenWidth from "./hooks/useScreenWidth";
import MainNav from "./components/MainNav/MainNav";
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
        <s.MainNavWithComponent $screenWidth={screenWidth}>
          <MainNav screenWidth={screenWidth} />
          <s.AppContent
            // Update the key when the learned_language changes to trigger a re-render
            // of the app content that needs real-time updates. This is a smoother
            // alternative to window.location.reload() when switching the practiced language in navigation.
            key={userDetails.learned_language}
            $currentPath={path}
            $screenWidth={screenWidth}
            id="scrollHolder"
          >
            {screenWidth <= MOBILE_WIDTH && <StreakBanner />}
            {screenWidth <= MOBILE_WIDTH && Feature.daily_feedback() && <DailyFeedbackBanner />}
            {appContent}
          </s.AppContent>
        </s.MainNavWithComponent>
      </ExercisesCounterContext.Provider>
    </MainNavContext.Provider>
  );
}
