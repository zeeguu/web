import { useContext, useState, useEffect, useMemo, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "../UserContext";
import StudentSpecificSidebarOptions from "./StudentSpecificSidebarOptions";
import TeacherSpecificSidebarOptions from "./TeacherSpecificSidebarOptions";
import { setColors } from "./colors";
import * as s from "./SideBar.sc";

export default function SideBar(props) {
  const user = useContext(UserContext);
  const api = props.api;
  const path = useLocation().pathname;
  const defaultPage = user.is_teacher ? "/teacher/classes" : "articles";

  const [initialSidebarState, setInitialSidebarState] = useState(true);
  const [isOnStudentSide, setIsOnStudentSide] = useState(true);

  const { light_color, dark_color } = setColors(isOnStudentSide);

  //deducting whether we are on student or teacher side for colouring
  useEffect(() => {
    //in Settings the side is determined by whether the user is a student or a teacher
    if (path.includes("account")) {
      setIsOnStudentSide(!user.is_teacher);
    } else {
      setIsOnStudentSide(!path.includes("teacher"));
    }
    // eslint-disable-next-line
  }, [path]);

  const SidebarLink = useCallback(({ text, to, icon }) => {
    const active = path.startsWith(to);
    const fontWeight = active ? "700" : "500";

    return (
      <div className="navigationLink">
        <Link to={to}>
          {icon}
          <small style={{ fontWeight: fontWeight }}>{text}</small>
        </Link>
      </div>
    );
  }, []);

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
        <div
          style={{ cursor: window.innerWidth > 768 && "default" }}
          className="arrowHolder"
        >
          <span
            className={`arrow ${
              window.innerWidth < 768 && initialSidebarState
                ? "toggleArrow"
                : ""
            }`}
            onClick={() => setInitialSidebarState(!initialSidebarState)}
          >
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
      initialSidebarState,
    ]
  );

  return (
    <s.SideBarInitial light={light_color} dark={dark_color}>
      <s.SidebarContainer
        light={light_color}
        dark={dark_color}
        style={{
          left: window.innerWidth < 768 && initialSidebarState ? 0 : "-230px",
        }}
      >
        {sidebarContent}
      </s.SidebarContainer>
      <s.MainContentInitial id="scrollHolder">
        <s.MainContent>{props.children}</s.MainContent>
      </s.MainContentInitial>
    </s.SideBarInitial>
  );
}
