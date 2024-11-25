import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { APIContext } from "../../contexts/APIContext";
import { ExerciseCountContext } from "../../exercises/ExerciseCountContext";
import { userHasNotExercisedToday } from "../../exercises/utils/daysSinceLastExercise";
import { MAX_EXERCISE_TO_DO_NOTIFICATION } from "../../exercises/ExerciseConstants";
import NotificationIcon from "../NotificationIcon";
import NavOption from "./NavOption";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import DonutSmallRoundedIcon from "@mui/icons-material/DonutSmallRounded";
import BusinessCenterRoundedIcon from "@mui/icons-material/BusinessCenterRounded";

export default function SidebarOptions_Student({
  isCollapsed,
  currentPath,
  isTeacher,
}) {
  const api = useContext(APIContext);
  const exerciseNotification = useContext(ExerciseCountContext);
  const [hasExerciseNotification, setHasExerciseNotification] = useState(false);
  const [totalExercisesInPipeline, setTotalExercisesInPipeline] = useState();
  const path = useLocation().pathname;

  useEffect(() => {
    if (userHasNotExercisedToday() && path !== "/exercises")
      api.getUserBookmarksToStudy(1, (scheduledBookmaks) => {
        exerciseNotification.setHasExercises(scheduledBookmaks.length > 0);
        exerciseNotification.updateReactState();
      });
    else {
      exerciseNotification.setHasExercises(false);
      exerciseNotification.updateReactState();
    }
  }, [path]);

  useEffect(() => {
    exerciseNotification.setHasExercisesHook = setHasExerciseNotification;
    exerciseNotification.setExerciseCounterHook = setTotalExercisesInPipeline;
    exerciseNotification.updateReactState();
  }, []);
  return (
    <>
      <NavOption
        linkTo={"/articles"}
        icon={<HomeRoundedIcon />}
        isCollapsed={isCollapsed}
        text={"Home"}
        currentPath={currentPath}
      />

      <NavOption
        linkTo={"/exercises"}
        icon={<FitnessCenterRoundedIcon />}
        isCollapsed={isCollapsed}
        text={"Exercises"}
        currentPath={currentPath}
        notification={
          hasExerciseNotification && (
            <NotificationIcon
              text={
                totalExercisesInPipeline
                  ? totalExercisesInPipeline > MAX_EXERCISE_TO_DO_NOTIFICATION
                    ? MAX_EXERCISE_TO_DO_NOTIFICATION + "+"
                    : totalExercisesInPipeline
                  : ""
              }
            />
          )
        }
      />

      <NavOption
        linkTo={"/words"}
        icon={<TranslateRoundedIcon />}
        isCollapsed={isCollapsed}
        text={"Words"}
        currentPath={currentPath}
      />

      <NavOption
        linkTo={"/history"}
        icon={<HistoryRoundedIcon />}
        isCollapsed={isCollapsed}
        text={"History"}
        currentPath={currentPath}
      />

      <NavOption
        linkTo={"/user_dashboard"}
        icon={<DonutSmallRoundedIcon />}
        isCollapsed={isCollapsed}
        text={"Statistics"}
        currentPath={currentPath}
      />

      {isTeacher && (
        <NavOption
          linkTo={"/teacher/classes"}
          icon={<BusinessCenterRoundedIcon />}
          isCollapsed={isCollapsed}
          text={"Teacher Site"}
          currentPath={currentPath}
        />
      )}
    </>
  );
}
