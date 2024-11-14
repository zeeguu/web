import React, { useState } from "react";
import * as s from "./NewSidebar.sc";
import { Link } from "react-router-dom/cjs/react-router-dom";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import DonutSmallRoundedIcon from "@mui/icons-material/DonutSmallRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import FeedbackRoundedIcon from "@mui/icons-material/FeedbackRounded";
import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";

export default function NewSidebar(props) {
  const { children: appContent } = props;
  const [state, setState] = useState(false);

  //Checking for rerenders
  console.log(`State:`);
  console.log(state);
  return (
    <>
      <s.Content id="scrollHolde" className="content">
        <s.SideBar role="navigation" aria-label="Sidebar Navigation">
          <s.NavOption onClick={() => setState(!state)}>
            {/* <Link to="/"> */}
            <s.Logotype>Zeeguu </s.Logotype>
            {/* </Link> */}
          </s.NavOption>
          <s.NavOption>
            <Link to="/">
              <HomeRoundedIcon />
              Home
            </Link>
          </s.NavOption>
          <s.NavOption>
            <Link to="/exercises">
              <CategoryRoundedIcon />
              Exercises
            </Link>
          </s.NavOption>
          <s.NavOption>
            <Link to="/words">
              <AssignmentRoundedIcon />
              Words
            </Link>
          </s.NavOption>
          <s.NavOption>
            <Link to="/history">
              <HistoryRoundedIcon />
              History
            </Link>
          </s.NavOption>
          <s.NavOption>
            <Link to="/user_dashboard">
              <DonutSmallRoundedIcon />
              Statistics
            </Link>
          </s.NavOption>
          <s.NavOption>
            <Link to="/">
              <SchoolRoundedIcon />
              Student Site
            </Link>
          </s.NavOption>
          <s.NavOption>
            <Link to="/account_settings/options">
              <SettingsRoundedIcon />
              Settings
            </Link>
          </s.NavOption>
          <s.NavOption>
            <Link to="/">
              <FeedbackRoundedIcon />
              Give Feedback
            </Link>
          </s.NavOption>
          <s.NavOption>
            <Link to="/account_settings/language_settings">
              <TranslateRoundedIcon />
              Language
            </Link>
          </s.NavOption>
        </s.SideBar>
        {appContent}
      </s.Content>
    </>
  );
}
