import { Link, useLocation } from "react-router-dom";
import strings from "../i18n/definitions";
import {
  Home,
  Words,
  Exercises,
  TeacherSite,
  Settings,
  LogOut,
  History,
  Statistics,
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
              color={path.endsWith(sidebarPaths.articles) ? "white" : iconsGray}
              style={{ marginRight: "10px" }}
              width="15px"
              height="15px"
            />
          }
        />

        <SidebarLink
          text={strings.words}
          to={sidebarPaths.words}
          icon={
            <Words
              color={path.endsWith(sidebarPaths.words) ? "white" : iconsGray}
              style={{ marginRight: "10px" }}
              width="15px"
              height="15px"
            />
          }
        />

        <SidebarLink
          text={strings.exercises}
          to={sidebarPaths.exercises}
          icon={
            <Exercises
              color={
                path.endsWith(sidebarPaths.exercises) ? "white" : iconsGray
              }
              style={{ marginRight: "10px" }}
              width="15px"
              height="15px"
            />
          }
        />

        <SidebarLink
          text={strings.history}
          to={sidebarPaths.history}
          icon={
            <History
              color={
                path.endsWith(sidebarPaths.teacherClasses) ? "white" : iconsGray
              }
              style={{ marginRight: "10px" }}
              width="15px"
              height="15px"
            />
          }
        />

        <SidebarLink
          text={strings.userDashboard}
          to={sidebarPaths.user_dashboard}
          icon={
            <Statistics
              color={
                path.endsWith(sidebarPaths.teacherClasses) ? "white" : iconsGray
              }
              style={{ marginRight: "10px" }}
              width="15px"
              height="15px"
            />
          }
        />

        {is_teacher && (
          <SidebarLink
            text={strings.teacherSite}
            to={sidebarPaths.teacherClasses}
            icon={
              <TeacherSite
                color={
                  path.endsWith(sidebarPaths.teacherClasses)
                    ? "white"
                    : iconsGray
                }
                style={{ marginRight: "10px" }}
                width="15px"
                height="15px"
              />
            }
          />
        )}
      </div>
    </>
  );
}
