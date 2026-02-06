import { useLocation } from "react-router-dom/cjs/react-router-dom";
import NotificationIcon from "../../NotificationIcon";
import DailyAudioNotificationDot from "../../DailyAudioNotificationDot";
import BottomNavOption from "./BottomNavOption";
import NavigationOptions from "../navigationOptions";
import { useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { ExercisesCounterContext } from "../../../exercises/ExercisesCounterContext";


export default function BottomNavOptionsForStudent() {
  const path = useLocation().pathname;
  const { userDetails } = useContext(UserContext);
  const { hasExerciseNotification, totalExercisesInPipeline } = useContext(ExercisesCounterContext);
  const dailyAudioStatus = userDetails?.daily_audio_status;

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
      <BottomNavOption
        {...NavigationOptions.dailyAudio}
        currentPath={path}
        notification={
          dailyAudioStatus && dailyAudioStatus !== "completed" && (
            <DailyAudioNotificationDot status={dailyAudioStatus} />
          )
        }
      />
      <BottomNavOption {...NavigationOptions.words} currentPath={path} />
    </>
  );
}
