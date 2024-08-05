import * as s from "./TopTabs.sc";
import strings from "../i18n/definitions";

import { TopTab } from "./TopTab";

// Renders a title and the corresponding tabs links
export default function TopTabs({ title, tabsAndLinks }) {
  let allTabsButLast = Object.entries(tabsAndLinks).slice(0, -1);
  let lastTab = Object.entries(tabsAndLinks).pop();

  return (
    <div>
      <s.TopTabs>
        <br />
        <br />

        <div className="all__tabs">
          {allTabsButLast.map((tabAndLink) => (
            <TopTab
              key={tabAndLink[1]}
              text={tabAndLink[0]}
              link={tabAndLink[1]}
              addSeparator={true}
            />
          ))}
          <TopTab
            text={lastTab[0]}
            link={lastTab[1]}
            hasNotification={lastTab[0] === strings.forYou}
            notificationText={"New!"}
          />
        </div>
      </s.TopTabs>
    </div>
  );
}
