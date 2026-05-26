import * as s from "./TopTabs.sc";
import { TopTab } from "./TopTab";
import useScrollDirection from "../hooks/useScrollDirection";

// Renders a title and the corresponding tabs links
export default function TopTabs({ title, tabsAndLinks, topicsDropdown, hasBackground = false }) {
  const scrollDirection = useScrollDirection();

  // Handle both object and array formats
  let tabsArray;
  if (Array.isArray(tabsAndLinks)) {
    tabsArray = tabsAndLinks;
  } else {
    tabsArray = Object.entries(tabsAndLinks).map(([text, link]) => ({ text, link }));
  }

  return (
    <s.TopTabsWrapper className={scrollDirection === "down" ? "header--hidden" : ""}>
      <s.TopTabs ref={topicsDropdown?.ref}>
        <div className={`all__tabs${hasBackground ? " all__tabs--with-bg" : ""}`}>
          {tabsArray.map((tab, index) => (
            <div key={tab.link || "dropdown"} style={{ display: "flex", alignItems: "center", gap: "0.8em" }}>
              <TopTab
                text={tab.text}
                link={tab.link}
                action={tab.action}
                isActive={tab.isDropdown ? topicsDropdown?.showDropdown : tab.isActive}
                onClick={tab.onClick}
                isDropdown={tab.isDropdown}
              />
              {!hasBackground && index < tabsArray.length - 1 && <span className="tab-separator">|</span>}
            </div>
          ))}
        </div>

        {/* Topics Dropdown Menu */}
        {topicsDropdown?.showDropdown && (
          <s.TopicsDropdownMenu>
            <s.TopicsDropdownItem
              onClick={() => topicsDropdown.handleTopicMenuClick("/account_settings/interests?fromArticles=1")}
            >
              Topics of Interest
            </s.TopicsDropdownItem>
            <s.TopicsDropdownItem
              onClick={() => topicsDropdown.handleTopicMenuClick("/account_settings/filters?fromArticles=1")}
            >
              Topics to Avoid
            </s.TopicsDropdownItem>
          </s.TopicsDropdownMenu>
        )}
      </s.TopTabs>
    </s.TopTabsWrapper>
  );
}
