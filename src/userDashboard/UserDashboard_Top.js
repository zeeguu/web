import {
  OPTIONS,
  PERIOD_OPTIONS,
  ACTIVITY_TIME_FORMAT_OPTIONS,
  TOP_TABS,
  USER_DASHBOARD_TITLES,
} from "./dataFormat/ConstantsUserDashboard";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import {
  UserDashboardHelperText,
  UserDashboardTile,
  UserDashboardTopContainer,
  UserDashBoardOptionsContainer,
  UserDashBoardTabs,
  UserDashBoardTab,
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
            {activeTab === 1 ? "Activity data for " : "Translated Words for "}

            <IntervalDropdownList
              handleActiveTimeIntervalChange={handleActiveTimeIntervalChange}
              activeTimeInterval={activeTimeInterval}
            />

            {activeTimeInterval === OPTIONS.CUSTOM && <>up until date</>}
            <br />
            {activeTab === 1 && (
              <>
                Time count shown in
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

      <UserDashBoardOptionsContainer>
        {activeTimeInterval === OPTIONS.CUSTOM && (
          <>
            <DropDownList
              handleChange={handleActiveCustomTimeInterval}
              stateValue={activeCustomTimeInterval}
              isCustom={true}
            >
              {customPeriodOptions.map((option) => (
                <DropDownOption
                  key={option.id}
                  id={option.id}
                  title={option.title}
                />
              ))}
            </DropDownList>

            {activeTab == 1 && (
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
            )}

            <DatePicker
              dateFormat="dd/MM/yyyy"
              selected={referenceDate}
              onChange={(date) => setReferenceDate(date)}
            />
          </>
        )}
      </UserDashBoardOptionsContainer>
    </UserDashboardTopContainer>
  );
}
