import { TABS_IDS, TOP_TABS } from "../ConstantsUserDashboard";
import * as s from "../userDashboard_Styled/UserDashboard.sc";

export default function UserDashboardTabs({
  activeTab,
  handleActiveTabChange,
}) {
  const tabs = [
    { id: TABS_IDS.PROGRESS_ITEMS, title: TOP_TABS.PROGRESS_ITEMS},
    { id: TABS_IDS.BAR_GRAPH, title: TOP_TABS.BAR_GRAPH },
    { id: TABS_IDS.LINE_GRAPH, title: TOP_TABS.LINE_GRAPH },
  ];

  const TabList = ({ children }) => {
    return <s.UserDashBoardTabs>{children}</s.UserDashBoardTabs>;
  };

  const Tab = ({ id, title, handleActiveTabChange, isActive }) => {
    return (
      <div>
        <s.UserDashBoardTab
          onClick={() => handleActiveTabChange(id)}
          isActive={isActive}
        >
          {title}
        </s.UserDashBoardTab>
      </div>
    );
  };

  return (
    <TabList>
      {tabs.map((tab) => (
        <Tab
          key={tab.id}
          id={tab.id}
          title={tab.title}
          handleActiveTabChange={handleActiveTabChange}
          isActive={activeTab === tab.id}
        />
      ))}
    </TabList>
  );
}