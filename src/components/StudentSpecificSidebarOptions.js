import { Link } from "react-router-dom";
import strings from "../i18n/definitions";
import { NUMBER_OF_BOOKMARKS_TO_PRACTICE } from "../exercises/exerciseSequenceTypes";
import { useState, useEffect } from "react";

export default function StudentSpecificSidebarOptions({
  SidebarLink,
  user,
  api,
}) {
  const is_teacher = user.is_teacher === "true" || user.is_teacher === true;
  const [exerciseToDoCount, setExerciseToDoCount] = useState();

  useEffect(() => {
    api.getUserBookmarksToStudy(
      NUMBER_OF_BOOKMARKS_TO_PRACTICE,
      (bookmarks) => {
        setExerciseToDoCount(bookmarks.length);
      },
    );
  });

  console.log("Bookmarks found: " + exerciseToDoCount);

  return (
    <>
      <SidebarLink text={strings.articles} to="/articles" />

      <SidebarLink text={strings.words} to="/words" />

      <SidebarLink
        text={strings.exercises}
        to="/exercises"
        hasNotification={exerciseToDoCount > 0 ? true : false}
        notificationText={exerciseToDoCount > 9 ? "9+" : exerciseToDoCount}
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
