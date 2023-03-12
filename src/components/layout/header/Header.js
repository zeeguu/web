import React from "react";
import * as s from "./Header.sc";
import { useLocation } from "react-router-dom";
import { Menu } from "../../icons/Menu";
import strings from "../../../i18n/definitions";

const pagesPerRoute = {
  "/articles": strings.articles,
  "/words": strings.words,
  "/exercises": strings.exercises,
  "/history": strings.history,
  "/user_dashboard": strings.userDashboard,
  "/teacher/classes": strings.teacherSite,
  "/teacher/texts": strings.myTexts,
  "/account_settings": strings.settings,
  "/account_settings/personalData": strings.settings,
  "/account_settings/class": strings.settings,
  "/account_settings/content": strings.settings,
  "/articles/ownTexts": strings.ownText,
};
export const Header = ({ onMenuClick }) => {
  const path = useLocation().pathname;

  return (
    <s.HeaderContainer>
      <div onClick={onMenuClick}>
        <Menu />
      </div>
      <span>{pagesPerRoute[path] || path}</span>
    </s.HeaderContainer>
  );
};
