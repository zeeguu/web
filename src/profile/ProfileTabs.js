import * as s from "./ProfileTabs.sc";
import React from "react";
import { useScrollActiveIntoView } from "../hooks/useScrollActiveIntoView";

export function ProfileTabs({ tabs, activeTab, onTabChange, children }) {
  const setTabRef = useScrollActiveIntoView(activeTab);

  const handleTabClick = (tab) => {
    onTabChange(tab.key);
  };

  return (
    <s.TabsSection>
      <s.TabBar>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            ref={setTabRef(tab.key)}
            className={activeTab === tab.key ? "active" : ""}
            onClick={() => handleTabClick(tab)}
          >
            {tab.label}
          </button>
        ))}
      </s.TabBar>
      <s.TabContent>{children}</s.TabContent>
    </s.TabsSection>
  );
}
