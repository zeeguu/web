import * as s from "./TopTabs.sc";
import { TopTab } from "./TopTab";
import useScrollDirection from "../hooks/useScrollDirection";

// Renders a title and the corresponding tabs links
export default function TopTabs({ title, tabsAndLinks }) {
  const scrollDirection = useScrollDirection();

  // Handle both object and array formats
  let tabsArray;
  if (Array.isArray(tabsAndLinks)) {
    tabsArray = tabsAndLinks;
  } else {
    tabsArray = Object.entries(tabsAndLinks).map(([text, link]) => ({ text, link }));
  }

  let allTabsButLast = tabsArray.slice(0, -1);
  let lastTab = tabsArray[tabsArray.length - 1];

  return (
    <s.TopTabsWrapper className={scrollDirection === "down" ? "header--hidden" : ""}>
      <s.TopTabs>
        <div className="all__tabs">
          {allTabsButLast.map((tab) => (
            <TopTab
              key={tab.link}
              text={tab.text}
              link={tab.link}
              counter={tab.counter}
              action={tab.action}
              addSeparator={true}
            />
          ))}
          <TopTab text={lastTab.text} link={lastTab.link} counter={lastTab.counter} action={lastTab.action} />
        </div>
      </s.TopTabs>
    </s.TopTabsWrapper>
  );
}