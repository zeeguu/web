import { useContext, useEffect, useState } from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import TranslatedWordsGraph from "./userdashboard_Graphs/TranslatedWordsGraph";
import ReadingAndExercisesTimeGraph from "./userdashboard_Graphs/ReadingAndExercisesTimeGraph";
import ProgressOverview from "./ProgressOverview";
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
import { APIContext } from "../contexts/APIContext";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { ProgressContext } from "../contexts/ProgressContext";
import { getWeeklyTranslatedWordsCount, calculateTotalReadingMinutes, calculateWeeklyReadingMinutes, calculateConsecutivePracticeWeeks } from "../utils/progressTracking/progressHelpers";

export default function UserDashboard() {
  const api = useContext(APIContext);
  const location = useLocation();
  const history = useHistory();
  const { setWeeklyTranslated, setTotalReadingMinutes, setTotalTranslated, setTotalInLearning, setTotalLearned, setWeeksPracticed, setWeeklyPracticed, setWeeklyReadingMinutes } = useContext(ProgressContext);
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
  const [totalInLearning] = useState(null);
  const [totalToLearn] = useState(null);
  const [totalLearned] = useState(null);

  function handleChangeReferenceDate(newDate) {
    setReferenceDate(newDate);
    api.logUserActivity(api.USER_DASHBOARD_DATE_CHANGE, "", newDate);
  }

  function handleActiveTabChange(tabId) {
    setActiveTab(tabId);
    api.logUserActivity(api.USER_DASHBOARD_TAB_CHANGE, "", tabId);
  
    let tabParam = "progress";
    if (tabId === TABS_IDS.LINE_GRAPH) tabParam = "translations";
    else if (tabId === TABS_IDS.BAR_GRAPH) tabParam = "time";
  
    history.replace(`?tab=${tabParam}`);
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
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");
    let newTab;
    if (tabParam === "progress" || !tabParam) {
      newTab = TABS_IDS.PROGRESS_ITEMS;
    } else if (tabParam === "translations") {
      newTab = TABS_IDS.LINE_GRAPH;
    } else if (tabParam === "time") {
      newTab = TABS_IDS.BAR_GRAPH;
    } else {
      newTab = TABS_IDS.PROGRESS_ITEMS;
    }
    setActiveTab(newTab);
  }, [location.search]);

  useEffect(() => {
    setTitle(strings.titleUserDashboard);
    api.logUserActivity(api.USER_DASHBOARD_OPEN);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    api.getBookmarksCountsByDate((counts) => {
      var formatted = getMapData(counts);

      setAllWordsData(formatted);

      setAllWordsDataPerMonths(calculateCountPerMonth_Words(formatted));

      const totalTranslatedWords = counts.reduce((sum, day) => sum + day.count, 0);
      setTotalTranslated(totalTranslatedWords);
      
      const thisWeek = getWeeklyTranslatedWordsCount(counts);
      const weeklyTotal = thisWeek.reduce((sum, day) => sum + day.count, 0);
      setWeeklyTranslated(weeklyTotal);
    });

    api.getUserActivityByDay((activity) => {
      setDailyExerciseAndReadingTimes(activity);

      setMonthlyExerciseAndReadingTimes(
        calculateCountPerMonth_Activity(activity),
      );
      
      setTotalReadingMinutes(calculateTotalReadingMinutes(activity.reading));

      const readingMinsPerWeek = calculateWeeklyReadingMinutes(activity.reading);
      setWeeklyReadingMinutes(readingMinsPerWeek);
      
      const weeksPracticed = calculateConsecutivePracticeWeeks(activity);
      setWeeksPracticed(weeksPracticed);

    });

    api.getAllScheduledBookmarks(false, (bookmarks) => {
      setTotalInLearning(bookmarks.length);
    });

    api.totalLearnedBookmarks((totalLearnedCount) =>{
      setTotalLearned(totalLearnedCount)
    }); 

    api.getPracticedBookmarksCountThisWeek((count) => {
      console.log("this is the count in the dashboard", count);
      setWeeklyPracticed(count);
    });
    // eslint-disable-next-line
  }, [activeTab]);

  if (!allWordsData || !dailyExerciseAndReadingTimes || !totalInLearning || !totalToLearn || totalLearned == null) {
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