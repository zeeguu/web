import { Link } from "react-router-dom";
import strings from "../i18n/definitions";
import { useState, useEffect } from "react";
import { MAX_EXERCISE_TO_DO_NOTIFICATION } from "../exercises/ExerciseConstants";

export default function StudentSpecificSidebarOptions({
  SidebarLink,
  user,
  api,
}) {
  const is_teacher = user.is_teacher === "true" || user.is_teacher === true;
  const [hasExercisesToDo, setHasExercisesToDo] = useState();

  useEffect(() => {
    if (!user["totalExercises"])
      api.getUserBookmarksToStudy(2, (bookmarks) => {
        setHasExercisesToDo(bookmarks.length);
      });
  });

  return (
    <>
      <SidebarLink text={strings.articles} to="/articles" />

      <SidebarLink text={strings.words} to="/words" />

      <SidebarLink
        text={strings.exercises}
        to="/exercises"
        hasNotification={hasExercisesToDo > 0 ? true : false}
        notificationText={
          user["totalExercises"]
            ? user["totalExercises"] > 99
              ? "99+"
              : user["totalExercises"]
            : ""
        }
      />

      <br />

      <SidebarLink text={strings.history} to="/history" />

      <SidebarLink text={strings.userDashboard} to="/user_dashboard" />

      <br />

      {is_teacher && (
        <SidebarLink text={strings.teacherSite} to="/teacher/classes" />
      )}

      <SidebarLink text={strings.settings} to="/account_settings" />

      <Link
        className="navigationLink"
        to="/"
        onClick={() => {
          user.logoutMethod();
        }}
      >
        <small>{strings.logout}</small>
      </Link>
    </>
  );
}
