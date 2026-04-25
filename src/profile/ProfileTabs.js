import * as s from "./ProfileTabs.sc";
import React, { useEffect, useRef } from "react";

export function ProfileTabs({ tabs, activeTab, onTabChange, children }) {
  const tabRefs = useRef({});

  useEffect(() => {
    const el = tabRefs.current[activeTab];
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activeTab]);

  const handleTabClick = (tab) => {
    onTabChange(tab.key);
  };

  return (
    <s.TabsSection>
      <s.TabBar>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            ref={(el) => {
              if (el) tabRefs.current[tab.key] = el;
            }}
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
