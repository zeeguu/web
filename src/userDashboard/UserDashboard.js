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
import {getWeeklyTranslatedWordsCount, calculateTotalReadingMinutes, calculateWeeklyReadingMinutes, countConsecutivePracticeWeeks} from "../utils/progressTracking/ProgressOverviewItems"
import UserDashboardTop from "./userDashboard_Top/UserDashboardTop";
import * as s from "./userDashboard_Styled/UserDashboard.sc";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";
import { APIContext } from "../contexts/APIContext";

export default function UserDashboard() {
  const api = useContext(APIContext);
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
  const [totalInLearning, setTotalInLearning] = useState(null); //maybe I do not need this one.
  const [totalLearned, setTotalLearned] = useState(null);
  const [weeklyTranslated, setWeeklyTranslated] = useState(null);
  const [totalTranslated, setTotalTranslated] = useState(null);
  const [totalReadingMinutes, setTotalReadingMinutes] = useState(null);
  const [weeklyReadingMinutes, setWeeklyReadingMinutes] = useState(null);
  const [weeksPracticed, setWeeksPracticed] = useState(0);

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
    api.getBookmarksCountsByDate((counts) => {
      var formatted = getMapData(counts);

      setAllWordsData(formatted);

      setAllWordsDataPerMonths(calculateCountPerMonth_Words(formatted));

      const thisWeek = getWeeklyTranslatedWordsCount(formatted);
      const thisWeekTotal = thisWeek.reduce((sum, day) => sum + day.count, 0);
      setWeeklyTranslated(thisWeekTotal);

      const totalTranslatedWOrds = Array.from(formatted.values()).reduce((sum, count) => sum + count, 0);
      setTotalTranslated(totalTranslatedWOrds);
    });

    api.getUserActivityByDay((activity) => {
      setDailyExerciseAndReadingTimes(activity);

      setMonthlyExerciseAndReadingTimes(
        calculateCountPerMonth_Activity(activity),
      );

      setWeeksPracticed(countConsecutivePracticeWeeks(activity));

      setTotalReadingMinutes(calculateTotalReadingMinutes(activity.reading));
      setWeeklyReadingMinutes(calculateWeeklyReadingMinutes(activity.reading));
    });

    api.getBookmarksCountByLevel((count) => {
      console.log("THIS IS THE GETBOOKMARKSCOUNTBYLEVEL result:", count);
      setTotalInLearning(count);
    });


    api.totalLearnedBookmarks((totalLearnedCount) => {
      setTotalLearned(totalLearnedCount);
    });

    // eslint-disable-next-line
  }, [activeTab]);

  if (!allWordsData || !dailyExerciseAndReadingTimes || totalLearned == null || weeklyTranslated == null || totalTranslated == null || totalReadingMinutes == null || weeklyReadingMinutes == null) { //|| totalInLearning==null ||  add this when functions work
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
        
        {activeTab === TABS_IDS.PROGRESS_ITEMS && (
          <>
            <ProgressOverview
            totalInLearning ={totalInLearning}
            totalLearned = {totalLearned}
            weeklyTranslated = {weeklyTranslated}
            totalTranslated = {totalTranslated}
            totalReadingMinutes = {totalReadingMinutes}
            weeklyReadingMinutes = {weeklyReadingMinutes}
            weeksPracticed={weeksPracticed}
            />
          </>
        )}
      </s.NivoGraphContainer>

    </>
  );
}