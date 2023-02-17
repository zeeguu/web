import React, { useCallback, useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "../UserContext";
import StudentSpecificSidebarOptions from "./StudentSpecificSidebarOptions";
import TeacherSpecificSidebarOptions from "./TeacherSpecificSidebarOptions";
import { blueDark, iconsGray, setColors, zeeguuSecondOrange } from "./colors";
import * as s from "./SideBar.sc";
import { Header } from "./layout/header/Header";
import { Menu } from "./icons/Menu";

export default function SideBar(props) {
  const user = useContext(UserContext);
  const api = props.api;
  const path = useLocation().pathname;
  const defaultPage = user.is_teacher ? "/teacher/classes" : "articles";

  const [initialSidebarState, setInitialSidebarState] = useState(false);
  const [isOnStudentSide, setIsOnStudentSide] = useState(true);

  const { light_color, dark_color } = setColors(isOnStudentSide);

  //deducting whether we are on student or teacher side for colouring
  useEffect(() => {
    //in Settings the side is determined by whether the user is a student or a teacher
    setIsOnStudentSide(
      path.includes("account") ? !user.is_teacher : !path.includes("teacher")
    );
    // eslint-disable-next-line
  }, [path]);

  const SidebarLink = useCallback(
    ({ text, to, icon }) => {
      const active = path.startsWith(to);

      return (
        <Link to={to}>
          <div
            className="navigationLink"
            style={{
              borderLeft: active ? `2px solid ${zeeguuSecondOrange}` : "",
              backgroundColor: active ? blueDark : "",
            }}
          >
            {icon}
            <span
              style={{
                color: active ? "white" : iconsGray,
              }}
            >
              {text}
            </span>
          </div>
        </Link>
      );
    },
    [path]
  );

  return (
    <s.SideBarInitial light={light_color} dark={dark_color}>
      <Header
        onMenuClick={() => setInitialSidebarState(!initialSidebarState)}
      />
      <s.SidebarContainer
        light={light_color}
        dark={dark_color}
        style={{
          left: initialSidebarState ? 0 : "-100%",
        }}
      >
        <s.SideBarMenuIconContainer
          onClick={() => setInitialSidebarState(false)}
        >
          <Menu color="white" />
        </s.SideBarMenuIconContainer>
        <div className="logo">
          <a href={defaultPage} rel="external">
            <img
              src="/static/images/zeeguuWhiteLogo.svg"
              alt="Zeeguu Logo - The Elephant"
            />
            <span>zeeguu</span>
          </a>
        </div>
        <s.Sidebar>
          {isOnStudentSide && (
            <StudentSpecificSidebarOptions
              SidebarLink={SidebarLink}
              user={user}
              api={api}
              onClick={() => setInitialSidebarState(false)}
            />
          )}
        </s.Sidebar>

        {!isOnStudentSide && (
          <TeacherSpecificSidebarOptions
            SidebarLink={SidebarLink}
            user={user}
            setIsOnStudentSide={setIsOnStudentSide}
            onClick={() => setInitialSidebarState(false)}
          />
        )}
      </s.SidebarContainer>
      <s.MainContentInitial id="scrollHolder">
        <s.MainContent>{props.children}</s.MainContent>
      </s.MainContentInitial>
    </s.SideBarInitial>
  );
}
