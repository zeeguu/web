import { TOP_TABS } from "../ConstantsUserDashboard";
import * as s from "../userDashboard_Styled/UserDashboard.sc";

export default function UserDashboardTabs({
  activeTab,
  handleActiveTabChange,
}) {
  const tabs = [
    { id: 1, title: TOP_TABS.BAR_GRAPH },
    { id: 2, title: TOP_TABS.LINE_GRAPH },
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
