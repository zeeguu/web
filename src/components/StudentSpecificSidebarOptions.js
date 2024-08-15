import strings from "../i18n/definitions";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { MAX_EXERCISE_TO_DO_NOTIFICATION } from "../exercises/ExerciseConstants";
import { ExerciseCountContext } from "../exercises/ExerciseCountContext";
import { Tooltip } from "@mui/material";

export default function StudentSpecificSidebarOptions({ SidebarLink, user }) {
  const is_teacher = user.is_teacher === "true" || user.is_teacher === true;
  const exerciseNotification = useContext(ExerciseCountContext);
  const [hasExerciseNotification, setHasExerciseNotification] = useState(false);
  const [totalExercisesInPipeline, setTotalExercisesInPipeline] = useState();

  useEffect(() => {
    exerciseNotification.setHasExercisesHook = setHasExerciseNotification;
    exerciseNotification.setExerciseCounterHook = setTotalExercisesInPipeline;
    exerciseNotification.updateReactState();
  }, []);
  return (
    <>
      <SidebarLink text={strings.articles} to="/articles" />

      <SidebarLink text={strings.words} to="/words" />

      <SidebarLink
        text={strings.exercises}
        to="/exercises"
        hasNotification={hasExerciseNotification}
        notificationTextActive={
          totalExercisesInPipeline
            ? totalExercisesInPipeline > MAX_EXERCISE_TO_DO_NOTIFICATION
              ? MAX_EXERCISE_TO_DO_NOTIFICATION + "+"
              : totalExercisesInPipeline
            : ""
        }
        notificationTextInactive={""}
      />

      <br />

      <SidebarLink text={strings.history} to="/history" />

      <SidebarLink text={strings.userDashboard} to="/user_dashboard" />

      <br />

      {is_teacher && (
        <SidebarLink text={strings.teacherSite} to="/teacher/classes" />
      )}
      <div className="SettingsLogoutContainer">
        <div className="SettingsLogoutHolder">
          <Tooltip title="Settings">
            <a href="/account_settings/options">
              <img
                className="navigationIcon"
                src="static/icons/options_v2.png"
              ></img>
            </a>
          </Tooltip>
          <Tooltip title="Logout">
            <Link
              to="/"
              onClick={() => {
                user.logoutMethod();
              }}
            >
              <img
                className="navigationIcon"
                src="static/icons/logout_v2.png"
              ></img>
            </Link>
          </Tooltip>
        </div>
      </div>
    </>
  );
}
