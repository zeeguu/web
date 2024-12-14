import { useEffect, useState } from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import TranslatedWordsGraph from "./userdashboard_Graphs/TranslatedWordsGraph";

import ReadingAndExercisesTimeGraph from "./userdashboard_Graphs/ReadingAndExercisesTimeGraph";
import {
  PERIOD_OPTIONS,
  ACTIVITY_TIME_FORMAT_OPTIONS,
  OPTIONS,
  TABS_IDS,
} from "./ConstantsUserDashboard";
import {
  getLineGraphData,
  calculateCountPerMonth_Words,
  getMapData,
} from "./userdashboard_Graphs/dataFormat/TranslatedWordsDataFormat";
import {
  getBarGraphData,
  calculateCountPerMonth_Activity,
} from "./userdashboard_Graphs/dataFormat/ReadingAndExercisesTimeDataFormat";
import UserDashboardTop from "./userDashboard_Top/UserDashboardTop";
import * as s from "./userDashboard_Styled/UserDashboard.sc";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";
import useCommitmentAndActivity from "../assorted/useCommitmentAndActivity";

export default function UserDashboard({ api }) {
  const { commitmentAndActivityData, lastCommitmentUpdate } =
    useCommitmentAndActivity(api);
  const [activeTab, setActiveTab] = useState(TABS_IDS.BAR_GRAPH);
  const [activeTimeInterval, setActiveTimeInterval] = useState(OPTIONS.WEEK);
  const [activeCustomTimeInterval, setActiveCustomTimeInterval] = useState(
    PERIOD_OPTIONS.WEEK,
  );
  const [activeTimeFormatOption, setActiveTimeFormatOption] = useState(
    ACTIVITY_TIME_FORMAT_OPTIONS.MINUTES,
  );
  const [allWordsData, setAllWordsData] = useState(null);
  const [allWordsDataPerMonths, setAllWordsDataPerMonths] = useState({});
  const [referenceDate, setReferenceDate] = useState(new Date());
  const [dailyExerciseAndReadingTimes, setDailyExerciseAndReadingTimes] =
    useState(null);
  const [monthlyExerciseAndReadingTimes, setMonthlyExerciseAndReadingTimes] =
    useState({});

  function handleChangeReferenceDate(newDate) {
    setReferenceDate(newDate);
    api.logUserActivity(api.USER_DASHBOARD_DATE_CHANGE, "", newDate);
  }

  function handleActiveTabChange(tabId) {
    setActiveTab(tabId);
    api.logUserActivity(api.USER_DASHBOARD_TAB_CHANGE, "", tabId);
  }

  function handleActiveTimeIntervalChange(selected) {
    setActiveTimeInterval(selected);
    api.logUserActivity(api.USER_DASHBOARD_PERIOD_CHANGE, "", selected);

    var period =
      selected === OPTIONS.WEEK || selected === OPTIONS.CUSTOM_WEEK
        ? PERIOD_OPTIONS.WEEK
        : selected === OPTIONS.MONTH || selected === OPTIONS.CUSTOM_MONTH
          ? PERIOD_OPTIONS.MONTH
          : selected === OPTIONS.YEAR || selected === OPTIONS.CUSTOM_YEAR
            ? PERIOD_OPTIONS.YEAR
            : selected === OPTIONS.YEARS
              ? PERIOD_OPTIONS.YEARS
              : PERIOD_OPTIONS.WEEK;

    // if it's last week/month/year/years,
    //set the date to today's date and show time in minutes
    if (
      selected === OPTIONS.WEEK ||
      OPTIONS.MONTH ||
      OPTIONS.YEAR ||
      OPTIONS.YEARS
    ) {
      setReferenceDate(new Date());

      handleActiveTimeFormatChange(ACTIVITY_TIME_FORMAT_OPTIONS.MINUTES);
    }

    handleActiveCustomTimeInterval(period);
  }

  function handleActiveCustomTimeInterval(selected) {
    setActiveCustomTimeInterval(selected);
  }

  function handleActiveTimeFormatChange(selected) {
    setActiveTimeFormatOption(selected);
    api.logUserActivity(api.USER_DASHBOARD_TIME_COUNT_CHANGE, "", selected);
  }

  useEffect(() => {
    setTitle(strings.titleUserDashboard);
    api.logUserActivity(api.USER_DASHBOARD_OPEN);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (lastCommitmentUpdate!== null) {
      api.updateUserCommitment(
        lastCommitmentUpdate,
        commitmentAndActivityData,
      );
    }
  }, [lastCommitmentUpdate, api]);

  useEffect(() => {
    api.getBookmarksCountsByDate((counts) => {
      var formatted = getMapData(counts);

      setAllWordsData(formatted);

      setAllWordsDataPerMonths(calculateCountPerMonth_Words(formatted));
    });

    api.getUserActivityByDay((activitiesArray) => {
      setDailyExerciseAndReadingTimes(activitiesArray);
      setMonthlyExerciseAndReadingTimes(
        calculateCountPerMonth_Activity(activitiesArray),
      );
    });
  }, [activeTab]);

  if (!allWordsData || !dailyExerciseAndReadingTimes) {
    return <LoadingAnimation />;
  }

  return (
    <>
      <UserDashboardTop
        activeTab={activeTab}
        handleActiveTabChange={handleActiveTabChange}
        activeTimeInterval={activeTimeInterval}
        handleActiveTimeIntervalChange={handleActiveTimeIntervalChange}
        handleActiveTimeFormatChange={handleActiveTimeFormatChange}
        activeTimeFormatOption={activeTimeFormatOption}
        referenceDate={referenceDate}
        commitmentAndActivityData={commitmentAndActivityData}
        handleChangeReferenceDate={handleChangeReferenceDate}
      />

      <s.NivoGraphContainer>
        {activeTab === TABS_IDS.BAR_GRAPH ? (
          <ReadingAndExercisesTimeGraph
            data={getBarGraphData(
              dailyExerciseAndReadingTimes,
              monthlyExerciseAndReadingTimes,
              activeCustomTimeInterval,
              referenceDate,
              activeTimeFormatOption,
            )}
            activeCustomTimeInterval={activeCustomTimeInterval}
            activeTimeFormatOption={activeTimeFormatOption}
          />
        ) : activeTab === TABS_IDS.LINE_GRAPH ? (
          <TranslatedWordsGraph
            data={getLineGraphData(
              allWordsData,
              allWordsDataPerMonths,
              activeCustomTimeInterval,
              referenceDate,
            )}
          />
        ) : (
          <></>
        )}
      </s.NivoGraphContainer>
    </>
  );
}
