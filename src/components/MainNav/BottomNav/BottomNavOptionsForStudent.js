import { useLocation } from "react-router-dom/cjs/react-router-dom";
import NotificationIcon from "../../NotificationIcon";
import BottomNavOption from "./BottomNavOption";
import NavigationOptions from "../navigationOptions";
import { useContext } from "react";
import { ExercisesCounterContext } from "../../../exercises/ExercisesCounterContext";

import Feature from "../../../features/Feature";

export default function BottomNavOptionsForStudent() {
  const path = useLocation().pathname;
  const { hasExerciseNotification, totalExercisesInPipeline } = useContext(ExercisesCounterContext);

  return (
    <>
      <BottomNavOption {...NavigationOptions.articles} currentPath={path} />
      <BottomNavOption
        {...NavigationOptions.exercises}
        currentPath={path}
        notification={
          hasExerciseNotification && <NotificationIcon position={"top-absolute"} text={totalExercisesInPipeline} />
        }
      />
      {Feature.is_enabled("daily_audio") && <BottomNavOption {...NavigationOptions.dailyAudio} currentPath={path} />}
      <BottomNavOption {...NavigationOptions.words} currentPath={path} />
    </>
  );
}
