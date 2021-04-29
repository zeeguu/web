import { useEffect, useState } from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import TranslatedWordsGraph from "./userdashboard_Graphs/TranslatedWordsGraph";
import ReadingAndExercisesTimeGraph from "./userdashboard_Graphs/ReadingAndExercisesTimeGraph";
import {
  PERIOD_OPTIONS,
  ACTIVITY_TIME_FORMAT_OPTIONS,
  OPTIONS,
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
import UserDashboard_Top from "./userDashboard_Top/UserDashboard_Top";
import * as s from "./userDashboard_Styled/UserDashboard.sc";

export default function UserDashboard({ api }) {
  const [activeTab, setActiveTab] = useState(1);
  const [activeTimeInterval, setActiveTimeInterval] = useState(OPTIONS.WEEK);
  const [activeCustomTimeInterval, setActiveCustomTimeInterval] = useState(
    PERIOD_OPTIONS.WEEK
  );
  const [activeTimeFormatOption, setActiveTimeFormatOption] = useState(
    ACTIVITY_TIME_FORMAT_OPTIONS.MINUTES
  );
  const [allWordsData, setAllWordsData] = useState(null);
  const [allWordsDataPerMonths, setAllWordsDataPerMonths] = useState({});
  const [referenceDate, setReferenceDate] = useState(new Date());
  const [
    dailyExerciseAndReadingTimes,
    setDailyExerciseAndReadingTimes,
  ] = useState(null);
  const [
    monthlyExerciseAndReadingTimes,
    setMonthlyExerciseAndReadingTimes,
  ] = useState({});

  function handleActiveTabChange(tabId) {
    setActiveTab(tabId);
  }

  function handleActiveTimeIntervalChange(selected) {
    setActiveTimeInterval(selected);

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
  }

  useEffect(() => {
    api.getBookmarksCountsByDate((counts) => {
      var formatted = getMapData(counts);

      setAllWordsData(formatted);

      setAllWordsDataPerMonths(calculateCountPerMonth_Words(formatted));
    });

    api.getUserActivityByDay((activity) => {
      setDailyExerciseAndReadingTimes(activity);

      setMonthlyExerciseAndReadingTimes(
        calculateCountPerMonth_Activity(activity)
      );
    });
  }, [activeTab]);

  if (!allWordsData || !dailyExerciseAndReadingTimes) {
    return <LoadingAnimation />;
  }

  return (
    <>
      <UserDashboard_Top
        activeTab={activeTab}
        handleActiveTabChange={handleActiveTabChange}
        activeTimeInterval={activeTimeInterval}
        handleActiveTimeIntervalChange={handleActiveTimeIntervalChange}
        handleActiveTimeFormatChange={handleActiveTimeFormatChange}
        activeTimeFormatOption={activeTimeFormatOption}
        referenceDate={referenceDate}
        setReferenceDate={setReferenceDate}
      />

      <s.NivoGraphContainer>
        {activeTab === 1 ? (
          <ReadingAndExercisesTimeGraph
            data={getBarGraphData(
              dailyExerciseAndReadingTimes,
              monthlyExerciseAndReadingTimes,
              activeCustomTimeInterval,
              referenceDate,
              activeTimeFormatOption
            )}
          />
        ) : activeTab === 2 ? (
          <TranslatedWordsGraph
            data={getLineGraphData(
              allWordsData,
              allWordsDataPerMonths,
              activeCustomTimeInterval,
              referenceDate
            )}
          />
        ) : (
          <></>
        )}
      </s.NivoGraphContainer>
    </>
  );
}
