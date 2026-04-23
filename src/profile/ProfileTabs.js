import * as s from "./ProfileTabs.sc";
import React from "react";

export function ProfileTabs({ tabs, activeTab, onTabChange, children }) {
  return (
    <s.TabsSection>
      <s.TabBar>
        {tabs.map((tab) => (
          <button key={tab.key} className={activeTab === tab.key ? "active" : ""} onClick={() => onTabChange(tab.key)}>
            {tab.label}
          </button>
        ))}
      </s.TabBar>
      <s.TabContent>{children}</s.TabContent>
    </s.TabsSection>
  );
}
