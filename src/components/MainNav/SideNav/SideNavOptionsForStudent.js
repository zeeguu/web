import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";

import NavOption from "../NavOption";
import NavigationOptions from "../navigationOptions";
import NotificationIcon from "../../NotificationIcon";
import { ExercisesCounterContext } from "../../../exercises/ExercisesCounterContext";
import Feature from "../../../features/Feature";

export default function SideNavOptionsForStudent({ screenWidth }) {
  const { userDetails } = useContext(UserContext);
  const { hasExerciseNotification, totalExercisesInPipeline } = useContext(ExercisesCounterContext);

  const path = useLocation().pathname;

  return (
    <>
      <NavOption {...NavigationOptions.articles} currentPath={path} screenWidth={screenWidth} />

      <NavOption
        {...NavigationOptions.exercises}
        currentPath={path}
        screenWidth={screenWidth}
        notification={
          hasExerciseNotification && <NotificationIcon position={"top-absolute"} text={totalExercisesInPipeline} />
        }
      />

      {Feature.is_enabled("daily_audio") && (
        <NavOption {...NavigationOptions.dailyAudio} currentPath={path} screenWidth={screenWidth} />
      )}

      <NavOption {...NavigationOptions.words} currentPath={path} screenWidth={screenWidth} />

      <NavOption {...NavigationOptions.history} currentPath={path} screenWidth={screenWidth} />

      <NavOption {...NavigationOptions.statistics} currentPath={path} screenWidth={screenWidth} />

      {userDetails.is_teacher && (
        <NavOption {...NavigationOptions.teacherSite} currentPath={path} screenWidth={screenWidth} />
      )}
    </>
  );
}
