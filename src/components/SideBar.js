import { useContext, useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "../UserContext";
import strings from "../i18n/definitions";
import StudentSpecificSidebarOptions from "./StudentSpecificSidebarOptions";
import TeacherSpecificSidebarOptions from "./TeacherSpecificSidebarOptions";
import { setColors } from "../components/colors";
import * as s from "./SideBar.sc";
import { Icon } from "@mui/material";

export default function SideBar(props) {
  const user = useContext(UserContext);
  const api = props.api;
  const [initialSidebarState, setInitialSidebarState] = useState(true);
  const [isOnStudentSide, setIsOnStudentSide] = useState(true);

  //deducting whether we are on student or teacher side for colouring
  const path = useLocation().pathname;
  useEffect(() => {
    //in Settings the side is determined by whether the user is a student or a teacher
    if (path.includes("account")) {
      setIsOnStudentSide(!user.is_teacher);
    } else {
      setIsOnStudentSide(!path.includes("teacher"));
    }
    // eslint-disable-next-line
  }, [path]);

  const defaultPage = user.is_teacher ? "/teacher/classes" : "articles";

  const { light_color, dark_color } = setColors(isOnStudentSide);

  function SidebarLink({ text, to, icon }) {
    // if path starts with to, then we are on that page
    const active = path.startsWith(to);
    const fontWeight = active ? "700" : "500";

    return (
      <div className="navigationLink">
        <Link to={to} onClick={resetSidebarToDefault}>
          {icon}
          <small style={{ fontWeight: fontWeight }}>{text}</small>
        </Link>
      </div>
    );
  }

  function toggleSidebar(e) {
    e.preventDefault();
    setInitialSidebarState(!initialSidebarState);
  }

  function resetSidebarToDefault(e) {
    setInitialSidebarState(true);
  }

  let sidebarContent = useMemo(
    () => (
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
        <s.Sidebar>
          {isOnStudentSide && (
            <StudentSpecificSidebarOptions
              SidebarLink={SidebarLink}
              user={user}
              api={api}
            />
          )}
        </s.Sidebar>

        {!isOnStudentSide && (
          <TeacherSpecificSidebarOptions
            SidebarLink={SidebarLink}
            user={user}
            setIsOnStudentSide={setIsOnStudentSide}
          />
        )}
      </>
    ),
    [
      defaultPage,
      isOnStudentSide,
      user,
      SidebarLink,
      api,
      isOnStudentSide,
      user,
      setIsOnStudentSide,
    ]
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
