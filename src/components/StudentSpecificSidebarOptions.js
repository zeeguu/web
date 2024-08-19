import strings from "../i18n/definitions";
import { useContext, useEffect, useState } from "react";
import { MAX_EXERCISE_TO_DO_NOTIFICATION } from "../exercises/ExerciseConstants";
import { ExerciseCountContext } from "../exercises/ExerciseCountContext";

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
    </>
  );
}
