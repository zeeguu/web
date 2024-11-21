import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { APIContext } from "../../contexts/APIContext";
import { UserContext } from "../../contexts/UserContext";
import { ExerciseCountContext } from "../../exercises/ExerciseCountContext";
import { userHasNotExercisedToday } from "../../exercises/utils/daysSinceLastExercise";
import SidebarOptions_Student from "./SidebarOptions_Student";
import SidebarOptions_Teacher from "./SidebarOptions_Teacher";
import NotificationIcon from "../NotificationIcon";
import * as s from "./NewSidebar.sc";
import NavOption from "./NavOption";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import FeedbackButton from "../FeedbackButton";
import DoubleArrowRight from "@mui/icons-material/KeyboardDoubleArrowRightOutlined";
import DoubleArrowLeft from "@mui/icons-material/KeyboardDoubleArrowLeftOutlined";
import { MAX_EXERCISE_TO_DO_NOTIFICATION } from "../../exercises/ExerciseConstants";

export default function NewSidebar({ isCollapsed, setIsCollapsed }) {
  const user = useContext(UserContext);
  const api = useContext(APIContext);
  const exerciseNotification = useContext(ExerciseCountContext);
  const [hasExerciseNotification, setHasExerciseNotification] = useState(false);
  const [totalExercisesInPipeline, setTotalExercisesInPipeline] = useState();

  const [isOnStudentSide, setIsOnStudentSide] = useState(true);
  const [isTeacher] = useState(user.is_teacher);

  const path = useLocation().pathname;
  const defaultPage = user.is_teacher ? "/teacher/classes" : "articles";

  useEffect(() => {
    setIsOnStudentSide(!path.includes("teacher"));
  }, [path]);

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

  console.log("Print Notification:");
  console.log(exerciseNotification);

  console.log("Print Exercise Pipeline:");
  console.log(totalExercisesInPipeline);

  return (
    <s.SideBar
      isCollapsed={isCollapsed}
      isOnStudentSide={isOnStudentSide}
      role="navigation"
      aria-label="Sidebar Navigation"
    >
      {hasExerciseNotification && (
        <NotificationIcon
          text={
            totalExercisesInPipeline
              ? totalExercisesInPipeline > MAX_EXERCISE_TO_DO_NOTIFICATION
                ? MAX_EXERCISE_TO_DO_NOTIFICATION + "+"
                : totalExercisesInPipeline
              : ""
          }
        />
      )}

      <NavOption
        className={"logo"}
        linkTo={defaultPage}
        icon={<img src="../static/images/zeeguuWhiteLogo.svg"></img>}
        isCollapsed={isCollapsed}
        text={"Zeeguu"}
      />

      {isOnStudentSide && (
        <SidebarOptions_Student
          isCollapsed={isCollapsed}
          currentPath={path}
          isOnStudentSide={isOnStudentSide}
          isTeacher={isTeacher}
        />
      )}

      {!isOnStudentSide && (
        <SidebarOptions_Teacher
          isCollapsed={isCollapsed}
          currentPath={path}
          isOnStudentSide={isOnStudentSide}
        />
      )}

      <s.BottomSection
        isCollapsed={isCollapsed}
        isOnStudentSide={isOnStudentSide}
      >
        <NavOption
          isOnStudentSide={isOnStudentSide}
          linkTo={"/account_settings"}
          icon={<SettingsRoundedIcon />}
          isCollapsed={isCollapsed}
          text={"Settings"}
          currentPath={path}
        />

        <FeedbackButton isCollapsed={isCollapsed} />

        <NavOption
          icon={isCollapsed ? <DoubleArrowRight /> : <DoubleArrowLeft />}
          isCollapsed={isCollapsed}
          text={isCollapsed ? "Expand" : "Collapse"}
          isButton={true}
          onClick={() => setIsCollapsed(!isCollapsed)}
        />
      </s.BottomSection>
    </s.SideBar>
  );
}
