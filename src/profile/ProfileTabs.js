import { Link } from "react-router-dom";
import * as s from "./ProfileTabs.sc";
import React from "react";
import { useScrollActiveIntoView } from "../hooks/useScrollActiveIntoView";

// Every tab is a page of its own (see profileTabRoutes), so the tabs are links:
// they survive a reload and can be opened in a new tab. They replace the
// history entry instead of adding one, so back (or a swipe) leaves the profile
// rather than stepping through the tabs under an unchanged header.
export function ProfileTabs({ tabs, activeTab, onTabClick, children }) {
  const setTabRef = useScrollActiveIntoView(activeTab);

  return (
    <s.TabsSection>
      <s.TabBar>
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            to={tab.link}
            replace
            ref={setTabRef(tab.key)}
            className={activeTab === tab.key ? "active" : ""}
            onClick={onTabClick}
          >
            {tab.label}
          </Link>
        ))}
      </s.TabBar>
      <s.TabContent>{children}</s.TabContent>
    </s.TabsSection>
  );
}
