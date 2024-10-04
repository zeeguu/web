import { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import StudentSpecificSidebarOptions from "./StudentSpecificSidebarOptions";
import TeacherSpecificSidebarOptions from "./TeacherSpecificSidebarOptions";
import { setColors } from "./colors";
import * as s from "./SideBar.sc";
import { APIContext } from "../contexts/APIContext";
import { ExerciseCountContext } from "../exercises/ExerciseCountContext";
import NotificationIcon from "./NotificationIcon";
import SettingsIcon from "@mui/icons-material/Settings";
import { userHasNotExercisedToday } from "../exercises/utils/daysSinceLastExercise";
import { Tooltip } from "@mui/material";

export default function SideBar(props) {
  const user = useContext(UserContext);
  const api = useContext(APIContext);
  const [initialSidebarState, setInitialSidebarState] = useState(true);
  const [isOnStudentSide, setIsOnStudentSide] = useState(true);
  const exerciseNotification = useContext(ExerciseCountContext);

  //deducting whether we are on student or teacher side for colouring
  const path = useLocation().pathname;
  useEffect(() => {
    setIsOnStudentSide(!path.includes("teacher"));

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

  const defaultPage = user.is_teacher ? "/teacher/classes" : "articles";

  const { light_color, dark_color } = setColors(isOnStudentSide);

  function SidebarLink({
    text,
    to,
    hasNotification,
    notificationTextActive,
    notificationTextInactive,
  }) {
    // if path starts with to, then we are on that page
    const active = path.startsWith(to);
    const fontWeight = active ? "700" : "500";

    return (
      <Link className="navigationLink" to={to} onClick={resetSidebarToDefault}>
        <small style={{ fontWeight: fontWeight }}>{text}</small>
        {hasNotification && (
          <NotificationIcon
            text={active ? notificationTextActive : notificationTextInactive}
          ></NotificationIcon>
        )}
      </Link>
    );
  }

  function toggleSidebar(e) {
    e.preventDefault();
    setInitialSidebarState(!initialSidebarState);
  }

  function resetSidebarToDefault() {
    setInitialSidebarState(true);
  }

  let sidebarContent = (
    <>
      <div className="logo">
        <a href={defaultPage} rel="external">
          <img
            src="/static/images/zeeguuWhiteLogo.svg"
            alt="Zeeguu Logo - The Elephant"
          />
        </a>
      </div>
      <div className="arrowHolder">
        <span className="toggleArrow" onClick={toggleSidebar}>
          ▲
        </span>
      </div>

      {isOnStudentSide && (
        <StudentSpecificSidebarOptions SidebarLink={SidebarLink} user={user} />
      )}

      {!isOnStudentSide && (
        <TeacherSpecificSidebarOptions
          SidebarLink={SidebarLink}
          user={user}
          setIsOnStudentSide={setIsOnStudentSide}
        />
      )}
      <div className="SettingsLogoutContainer">
        <div className="SettingsLogoutHolder">
          <Tooltip title="Settings">
            <a href="/account_settings/options">
              <SettingsIcon
                fontSize="large"
                className="navigationIcon"
                sx={{ color: "white" }}
              />
            </a>
          </Tooltip>
        </div>
      </div>
    </>
  );

  if (!initialSidebarState) {
    return (
      <s.SideBarToggled light={light_color} dark={dark_color}>
        {sidebarContent}
        <s.MainContentToggled id="scrollHolder">
          {props.children}
        </s.MainContentToggled>
      </s.SideBarToggled>
    );
  }

  return (
    <s.SideBarInitial light={light_color} dark={dark_color}>
      {sidebarContent}
      <s.MainContentInitial id="scrollHolder">
        {props.children}
      </s.MainContentInitial>
    </s.SideBarInitial>
  );
}
