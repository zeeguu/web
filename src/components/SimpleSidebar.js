import React, { useState, useEffect, useContext } from "react";
import {
  Sidebar,
  FlexContainer,
  MainContent,
  NavLink,
  MenuText,
} from "./SimpleSidebar.sc";
import StudentSpecificSidebarOptions from "./StudentSpecificSidebarOptions";
import { UserContext } from "../UserContext";
import { Link, useLocation } from "react-router-dom";

function SimpleSidebar(props) {
  const user = useContext(UserContext);
  const api = props.api;
  const path = useLocation().pathname;

  function SidebarLink({ text, to, icon }) {
    // if path starts with to, then we are on that page
    const active = path.startsWith(to);
    const fontWeight = active ? "600" : "400";
    const iconClass = active ? "selectedIcon" : "icon";

    return (
      <NavLink className={"navigationLink" + (active ? " active" : "")}>
        <Link to={to}>
          {icon && <img className={iconClass} src={"/static/icons/" + icon} />}
          <MenuText style={{ fontWeight: fontWeight }}>{text}</MenuText>
        </Link>
      </NavLink>
    );
  }

  let sidebarContent = (
    <>
      <div className="logo">
        <a href={"articles"} rel="external">
          <img
            className="logo"
            src="/static/images/zeeguuLogo.svg"
            alt="Zeeguu Logo - The Elephant"
          />
        </a>
      </div>

      <StudentSpecificSidebarOptions
        SidebarLink={SidebarLink}
        user={user}
        api={api}
      />
    </>
  );

  return (
    <FlexContainer>
      {/* Render element1 if isVisible is true */}

      <Sidebar>{sidebarContent}</Sidebar>

      <MainContent>{props.children}</MainContent>
    </FlexContainer>
  );
}

export default SimpleSidebar;
