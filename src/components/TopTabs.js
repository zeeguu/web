import * as s from "./TopTabs.sc";
import { TopTab } from "./TopTab";
import CustomizeFeed from "../articles/CustomizeFeed";

// Renders a title and the corresponding tabs links
export default function TopTabs({ title, tabsAndLinks }) {
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
    <div>
      <s.TopTabs>
          <br/>
          <div className="all__tabs">
          {allTabsButLast.map((tab) => (
            <TopTab
              key={tab.link}
              text={tab.text}
              link={tab.link}
              counter={tab.counter}
              addSeparator={true}
            />
          ))}
          <TopTab text={lastTab.text} link={lastTab.link} counter={lastTab.counter} />
        </div>
          <div className="customize">
              <CustomizeFeed currentMode={"swipe"}/>
          </div>
      </s.TopTabs>
    </div>
  );
}