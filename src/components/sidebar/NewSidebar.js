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
import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";
import ChromeReaderModeRoundedIcon from "@mui/icons-material/ChromeReaderModeRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import BusinessCenterRoundedIcon from "@mui/icons-material/BusinessCenterRounded";
import FeedbackButton from "../FeedbackButton";

export default function NewSidebar() {
  const user = useContext(UserContext);
  const [isOnStudentSide, setIsOnStudentSide] = useState(true);
  const [isTeacher] = useState(user.is_teacher);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const path = useLocation().pathname;
  useEffect(() => {
    setIsOnStudentSide(!path.includes("teacher"));
  }, [path]);

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
            text={"Home"}
          />

          <NavLink
            linkTo={"/exercises"}
            icon={<CategoryRoundedIcon />}
            isCollapsed={isCollapsed}
            text={"Exercises"}
          />

          <NavLink
            linkTo={"/words"}
            icon={<AssignmentRoundedIcon />}
            isCollapsed={isCollapsed}
            text={"Words"}
          />

          <NavLink
            linkTo={"/account_settings/language_settings"}
            icon={<TranslateRoundedIcon />}
            isCollapsed={isCollapsed}
            text={"Language"}
          />

          <NavLink
            linkTo={"/history"}
            icon={<HistoryRoundedIcon />}
            isCollapsed={isCollapsed}
            text={"History"}
          />

          <NavLink
            linkTo={"/user_dashboard"}
            icon={<DonutSmallRoundedIcon />}
            isCollapsed={isCollapsed}
            text={"Statistics"}
          />

          {isTeacher && (
            <NavLink
              linkTo={"/teacher/classes"}
              icon={<BusinessCenterRoundedIcon />}
              isCollapsed={isCollapsed}
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
            text={"My Classrooms"}
          />

          <NavLink
            isOnStudentSide={isOnStudentSide}
            linkTo={"/teacher/texts"}
            icon={<ChromeReaderModeRoundedIcon />}
            isCollapsed={isCollapsed}
            text={"My Texts"}
          />

          <NavLink
            isOnStudentSide={isOnStudentSide}
            linkTo={"/articles"}
            icon={<SchoolRoundedIcon />}
            isCollapsed={isCollapsed}
            text={"Student Site"}
          />
        </>
      )}

      <NavLink
        isOnStudentSide={isOnStudentSide}
        linkTo={"/account_settings/options"}
        icon={<SettingsRoundedIcon />}
        isCollapsed={isCollapsed}
        text={"Settings"}
      />
      <FeedbackButton isCollapsed={isCollapsed} />
    </s.SideBar>
  );
}
