import React from "react";
import { useState } from "react";
import * as s from "./NewSidebar.sc";
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

export default function NewSidebar() {
  const [state, setState] = useState(false);

  console.log(`State:`);
  console.log(state);
  return (
    <s.SideBar role="navigation" aria-label="Sidebar Navigation">
      <s.NavOption onClick={() => setState(!state)}>
        {/* <Link to="/"> */}
        <s.Logotype>Zeeguu </s.Logotype>
        {/* </Link> */}
      </s.NavOption>
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

      <NavLink linkTo={"/"}>
        <SchoolRoundedIcon />
        Student Site
      </NavLink>

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
