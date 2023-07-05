import { Link, useLocation } from "react-router-dom";
import strings from "../i18n/definitions";
import {
  Home,
  Words,
  Exercises,
  TeacherSite,
  Settings,
  LogOut,
} from "./icons/sidebar";
import React from "react";
import { iconsGray } from "./colors";
import * as s from "./SideBar.sc";

const sidebarPaths = {
  articles: "/articles",
  words: "/words",
  exercises: "/exercises",
  history: "/history",
  user_dashboard: "/user_dashboard",
  teacherClasses: "/teacher/classes",
  accountSettings: "/account_settings",
  home: "/",
};

export default function StudentSpecificSidebarOptions({ SidebarLink, user }) {
  const is_teacher = user.is_teacher === "true" || user.is_teacher === true;

  const path = useLocation().pathname;
  return (
    <>
      <div>
        <SidebarLink
          text={strings.articles}
          to={sidebarPaths.articles}
          icon={
            <Home
              color={path.endsWith(sidebarPaths.articles) || iconsGray}
              style={{ marginRight: "10px" }}
            />
          }
        />

        <SidebarLink
          text={strings.words}
          to={sidebarPaths.words}
          icon={
            <Words
              color={path.endsWith(sidebarPaths.words) || iconsGray}
              style={{ marginRight: "10px" }}
            />
          }
        />

        <SidebarLink
          text={strings.exercises}
          to={sidebarPaths.exercises}
          icon={
            <Exercises
              color={path.endsWith(sidebarPaths.exercises) || iconsGray}
              style={{ marginRight: "10px" }}
            />
          }
        />

        <SidebarLink text={strings.history} to={sidebarPaths.history} />

        <SidebarLink
          text={strings.userDashboard}
          to={sidebarPaths.user_dashboard}
        />

        {is_teacher && (
          <SidebarLink
            text={strings.teacherSite}
            to={sidebarPaths.teacherClasses}
            icon={
              <TeacherSite
                color={path.endsWith(sidebarPaths.teacherClasses) || iconsGray}
                style={{ marginRight: "10px" }}
              />
            }
          />
        )}
      </div>

      <s.SettingsWithLogOut>
        <SidebarLink
          text={strings.settings}
          to={sidebarPaths.accountSettings}
          icon={
            <Settings
              color={path.endsWith(sidebarPaths.accountSettings) || iconsGray}
              style={{ marginRight: "10px" }}
            />
          }
        />

        <div className="navigationLink">
          <Link
            to={sidebarPaths.home}
            onClick={() => {
              user.logoutMethod();
            }}
          >
            <LogOut
              color={path.endsWith(sidebarPaths.home) || iconsGray}
              style={{ marginRight: "10px" }}
            />
            <small>{strings.logout}</small>
          </Link>
        </div>
      </s.SettingsWithLogOut>
    </>
  );
}
