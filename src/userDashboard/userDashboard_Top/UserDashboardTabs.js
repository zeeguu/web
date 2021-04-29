import { TOP_TABS } from "../dataFormat/ConstantsUserDashboard";
import { UserDashBoardTab, UserDashBoardTabs } from "../UserDashboard.sc";

export default function UserDashboardTabs({
  activeTab,
  handleActiveTabChange,
}) {
  const tabs = [
    { id: 1, title: TOP_TABS.BAR_GRAPH },
    { id: 2, title: TOP_TABS.LINE_GRAPH },
  ];

  const TabList = ({ children }) => {
    return <UserDashBoardTabs>{children}</UserDashBoardTabs>;
  };

  const Tab = ({ id, title, handleActiveTabChange, isActive }) => {
    return (
      <div>
        <UserDashBoardTab
          onClick={() => handleActiveTabChange(id)}
          isActive={isActive}
        >
          {title}
        </UserDashBoardTab>
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
