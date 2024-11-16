import React from "react";
import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import * as s from "./NewSidebar.sc";
import { Link } from "react-router-dom/cjs/react-router-dom";
import NavLink from "./NavLInk";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import DonutSmallRoundedIcon from "@mui/icons-material/DonutSmallRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import FeedbackRoundedIcon from "@mui/icons-material/FeedbackRounded";
import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";
import ChromeReaderModeRoundedIcon from "@mui/icons-material/ChromeReaderModeRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import BusinessCenterRoundedIcon from "@mui/icons-material/BusinessCenterRounded";

export default function NewSidebar() {
  const user = useContext(UserContext);

  const [state, setState] = useState(false);
  const [isOnStudentSide, setIsOnStudentSide] = useState(true);
  const [isTeacher] = useState(user.is_teacher);

  const path = useLocation().pathname;
  useEffect(() => {
    setIsOnStudentSide(!path.includes("teacher"));
  }, [path]);

  console.log(`State:`);
  console.log(state);
  return (
    <s.SideBar role="navigation" aria-label="Sidebar Navigation">
      <s.LogoLink onClick={() => setState(!state)}>
        <Link to="/">
          <s.Logotype>Zeeguu </s.Logotype>
        </Link>
      </s.LogoLink>
      {isOnStudentSide && (
        <>
          <NavLink linkTo={"/"}>
            <HomeRoundedIcon />
            Home
          </NavLink>

          <NavLink linkTo={"/exercises"}>
            <CategoryRoundedIcon />
            Exercises
          </NavLink>

          <NavLink linkTo={"/words"}>
            <AssignmentRoundedIcon />
            Words
          </NavLink>

          <NavLink linkTo={"/account_settings/language_settings"}>
            <TranslateRoundedIcon />
            Language
          </NavLink>

          <NavLink linkTo={"/history"}>
            <HistoryRoundedIcon />
            History
          </NavLink>

          <NavLink linkTo={"/user_dashboard"}>
            <DonutSmallRoundedIcon />
            Statistics
          </NavLink>

          {isTeacher && (
            <NavLink linkTo={"/teacher/classes"}>
              <BusinessCenterRoundedIcon />
              Teacher Site
            </NavLink>
          )}
        </>
      )}

      {!isOnStudentSide && (
        <>
          <NavLink linkTo={"/teacher/classes"}>
            <GroupsRoundedIcon />
            My Classrooms
          </NavLink>

          <NavLink linkTo={"/teacher/texts"}>
            <ChromeReaderModeRoundedIcon />
            My Texts
          </NavLink>

          <NavLink linkTo={"/articles"}>
            <SchoolRoundedIcon />
            Student Site
          </NavLink>
        </>
      )}
      <NavLink linkTo={"/account_settings/options"}>
        <SettingsRoundedIcon />
        Settings
      </NavLink>

      <NavLink linkTo={"/"}>
        <FeedbackRoundedIcon />
        Give Feedback
      </NavLink>
    </s.SideBar>
  );
}
