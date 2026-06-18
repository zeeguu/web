import * as s from "./TopTabs.sc";
import { TopTab } from "./TopTab";
import useScrollDirection from "../hooks/useScrollDirection";

// Renders a title and the corresponding tabs links
export default function TopTabs({ title, tabsAndLinks, hasBackground = false, isCompact = false }) {
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
      <s.TopTabs>
        <div
          className={`all__tabs${hasBackground ? " all__tabs--with-bg" : ""}${isCompact ? " all__tabs--compact" : ""}`}
        >
          {tabsArray.map((tab, index) => (
            <div key={tab.link} style={{ display: "flex", alignItems: "center", gap: "0.8em" }}>
              <TopTab
                text={tab.text}
                link={tab.link}
                action={tab.action}
                isActive={tab.isActive}
                onClick={tab.onClick}
              />
              {/* Separators only make sense between text labels — never around
                  icon tabs (whose `text` is a JSX element, not a string). */}
              {!hasBackground && typeof tab.text === "string" && index < tabsArray.length - 1 && (
                <span className="tab-separator">|</span>
              )}
            </div>
          ))}
        </div>
      </s.TopTabs>
    </s.TopTabsWrapper>
  );
}
