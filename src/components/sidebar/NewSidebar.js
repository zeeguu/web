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
  const [isCollapsed, setIsCollapsed] = useState(false);

  const path = useLocation().pathname;
  useEffect(() => {
    setIsOnStudentSide(!path.includes("teacher"));
  }, [path]);

  console.log(`State:`);
  console.log(state);
  return (
    <s.SideBar
      isCollapsed={isCollapsed}
      isOnStudentSide={isOnStudentSide}
      role="navigation"
      aria-label="Sidebar Navigation"
    >
      <s.LogoLink onClick={() => setIsCollapsed(!isCollapsed)}>
        {/* <Link to=""> */}
        <s.Logotype>Zeeguu </s.Logotype>
        {/* </Link> */}
      </s.LogoLink>
      {isOnStudentSide && (
        <>
          <NavLink
            linkTo={"/articles"}
            icon={<HomeRoundedIcon />}
            isCollapsed={isCollapsed}
            title={"Home"}
            text={"Home"}
          />

          <NavLink
            linkTo={"/exercises"}
            icon={<CategoryRoundedIcon />}
            isCollapsed={isCollapsed}
            title={"Exercises"}
            text={"Exercises"}
          />

          <NavLink
            linkTo={"/words"}
            icon={<AssignmentRoundedIcon />}
            isCollapsed={isCollapsed}
            title={"Words"}
            text={"Words"}
          />

          <NavLink
            linkTo={"/account_settings/language_settings"}
            icon={<TranslateRoundedIcon />}
            isCollapsed={isCollapsed}
            title={"Language"}
            text={"Language"}
          />

          <NavLink
            linkTo={"/history"}
            icon={<HistoryRoundedIcon />}
            isCollapsed={isCollapsed}
            title={"History"}
            text={"History"}
          />

          <NavLink
            linkTo={"/user_dashboard"}
            icon={<DonutSmallRoundedIcon />}
            isCollapsed={isCollapsed}
            title={"Statistics"}
            text={"Statistics"}
          />

          {isTeacher && (
            <NavLink
              linkTo={"/teacher/classes"}
              icon={<BusinessCenterRoundedIcon />}
              isCollapsed={isCollapsed}
              title={"Teacher Site"}
              text={"Teacher Site"}
            />
          )}
        </>
      )}

      {!isOnStudentSide && (
        <>
          <NavLink
            isOnStudentSide={isOnStudentSide}
            linkTo={"/teacher/classes"}
            icon={<GroupsRoundedIcon />}
            isCollapsed={isCollapsed}
            title={"My Classrooms"}
            text={"My Classrooms"}
          />

          <NavLink
            isOnStudentSide={isOnStudentSide}
            linkTo={"/teacher/texts"}
            icon={<ChromeReaderModeRoundedIcon />}
            isCollapsed={isCollapsed}
            title={"My Texts"}
            text={"My Texts"}
          />

          <NavLink
            isOnStudentSide={isOnStudentSide}
            linkTo={"/articles"}
            icon={<SchoolRoundedIcon />}
            isCollapsed={isCollapsed}
            title={"Student Site"}
            text={"Student Site"}
          />
        </>
      )}

      <NavLink
        isOnStudentSide={isOnStudentSide}
        linkTo={"/account_settings/options"}
        icon={<SettingsRoundedIcon />}
        isCollapsed={isCollapsed}
        title={"Settings"}
        text={"Settings"}
      />

      <NavLink
        linkTo={"/articles"}
        icon={<FeedbackRoundedIcon />}
        isCollapsed={isCollapsed}
        title={"Give Feedback"}
        text={"Give Feedback"}
      />
    </s.SideBar>
  );
}
