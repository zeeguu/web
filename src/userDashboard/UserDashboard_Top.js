import {
  OPTIONS,
  PERIOD_OPTIONS,
  ACTIVITY_TIME_FORMAT_OPTIONS,
  TOP_TABS,
  USER_DASHBOARD_TITLES,
  DATE_FORMAT_FOR_DATEPICKER,
} from "./dataFormat/ConstantsUserDashboard";
import DatePicker from "react-datepicker";
import {
  UserDashboardHelperText,
  UserDashboardTile,
  UserDashboardTopContainer,
  UserDashBoardOptionsContainer,
  UserDashBoardTabs,
  UserDashBoardTab,
  UserDatePicker,
} from "./UserDashboard.sc";

import IntervalDropdownList from "./IntervalDropdownList";
import { DropDownList, DropDownOption } from "./DropDownList";

const tabs = [
  { id: 1, title: TOP_TABS.BAR_GRAPH },
  { id: 2, title: TOP_TABS.LINE_GRAPH },
];

const customPeriodOptions = [
  { id: 1, title: PERIOD_OPTIONS.WEEK },
  { id: 2, title: PERIOD_OPTIONS.MONTH },
  { id: 3, title: PERIOD_OPTIONS.YEAR },
  { id: 4, title: PERIOD_OPTIONS.YEARS },
];

const customTimeFormatOptions = [
  { id: 1, title: ACTIVITY_TIME_FORMAT_OPTIONS.MINUTES },
  { id: 2, title: ACTIVITY_TIME_FORMAT_OPTIONS.HOURS },
];

const TabList = ({ children }) => {
  return <UserDashBoardTabs>{children}</UserDashBoardTabs>;
};

const Tab = ({ id, title, handleActiveTabChange, isActive }) => {
  return (
    <UserDashBoardTab
      onClick={() => handleActiveTabChange(id)}
      isActive={isActive}
    >
      {title}
    </UserDashBoardTab>
  );
};

export default function UserDashboard_Top({
  activeTab,
  handleActiveTabChange,
  activeTimeInterval,
  handleActiveTimeIntervalChange,
  activeCustomTimeInterval,
  handleActiveCustomTimeInterval,
  handleActiveTimeFormatChange,
  activeTimeFormatOption,
  referenceDate,
  setReferenceDate,
}) {
  return (
    <UserDashboardTopContainer>
      <UserDashboardTile>
        {" "}
        {USER_DASHBOARD_TITLES.MAIN_TITLE}{" "}
      </UserDashboardTile>

      <div>
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
      </div>

      <div>
        <UserDashboardHelperText>
          <>
            {activeTab === 1
              ? USER_DASHBOARD_TITLES.BAR_GRAPH_TEXT
              : USER_DASHBOARD_TITLES.LINE_GRAPH_TEXT}

            <IntervalDropdownList
              handleActiveTimeIntervalChange={handleActiveTimeIntervalChange}
              activeTimeInterval={activeTimeInterval}
            />

            {(activeTimeInterval === OPTIONS.CUSTOM_WEEK ||
              activeTimeInterval === OPTIONS.CUSTOM_MONTH ||
              activeTimeInterval === OPTIONS.CUSTOM_YEAR) && (
              <>
                {" "}
                <UserDatePicker>
                  <DatePicker
                    dateFormat={DATE_FORMAT_FOR_DATEPICKER}
                    selected={referenceDate}
                    onChange={(date) => setReferenceDate(date)}
                  />
                </UserDatePicker>
              </>
            )}
            <br />
            {activeTab === 1 && (
              <>
                {USER_DASHBOARD_TITLES.TIME_COUNT_IN}
                <DropDownList
                  handleChange={handleActiveTimeFormatChange}
                  stateValue={activeTimeFormatOption}
                  isCustom={true}
                >
                  {customTimeFormatOptions.map((option) => (
                    <DropDownOption
                      key={option.id}
                      id={option.id}
                      title={option.title}
                    />
                  ))}
                </DropDownList>
              </>
            )}
          </>
        </UserDashboardHelperText>
      </div>
    </UserDashboardTopContainer>
  );
}
