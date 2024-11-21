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
import getUserActivityAndCommitment from "../api/userActivityAndCommitment/"; //importing function for user activity and commitment

export default function UserDashboard({ api }) {
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
  const [currentStreak, setCurrentStreak] = useState(0);
  const [commitmentAndActivityData, setCommitmentAndActivityData] = useState(0); //added useState for the streak
  const [lastStreakUpdate, setLastStreakUpate] = useState(0);

  function handleChangeReferenceDate(newDate) {
    setReferenceDate(newDate);
    api.logUserActivity(api.USER_DASHBOARD_DATE_CHANGE, "", newDate);
  }

  function handleActiveTabChange(tabId) {
    setActiveTab(tabId);
    api.logUserActivity(api.USER_DASHBOARD_TAB_CHANGE, "", tabId);
  }

  //This is a test to see

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

  function getPreviousDate(dateString) {
    const date = new Date(dateString);
    date.setDate(date.getDate() - 1);
    return date.toISOString().slice(0, 10);
  }

  useEffect(() => {
    setTitle(strings.titleUserDashboard);
    api.logUserActivity(api.USER_DASHBOARD_OPEN);
    // eslint-disable-next-line
  }, []);

  //useEffect and function for the user defined commitment
  useEffect(() => {
    api.getUserActivityAndCommitment((activitiesAndCommitmentArray) => {
      //Week logic
      const currentDate = new Date(); //current date and time
      const dayOfWeek = currentDate.getDay(); //day of the week (sunday = 0, monday = 1 etc.)
      let daysAwayFromMonday; //the x amount of days starting from monday to the current date that we want to include in our calculation.

      //set the days away from monday. We need an if statement because sunday is 0.
      if (dayOfWeek === 0) {
        daysAwayFromMonday = 6;
      } else {
        daysAwayFromMonday = dayOfWeek - 1;
      }

      //Only extract activity_time_by_day data
      const activityTimeByDay =
        activitiesAndCommitmentArray.activity_time_by_day;
      //Adds the activity arrays together that we get from getUserActivityByDay
      const bothActivitiesArray = activityTimeByDay.exercises.concat(
        activityTimeByDay.reading,
      );

      //adds together the seconds for each day. this is an object
      const combinedObject = bothActivitiesArray.reduce((acc, curr) => {
        if (acc[curr.date]) {
          acc[curr.date] += curr.seconds;
        } else {
          acc[curr.date] = curr.seconds;
        }
        return acc;
      }, {});

      //converts back into array
      const combinedArray = Object.keys(combinedObject).map((date) => ({
        date: date,
        seconds: combinedObject[date],
      }));

      // orders the instances by date
      const activitiesSorted = combinedArray.sort((a, b) =>
        b.date.localeCompare(a.date),
      );

      //the array only containing the weekly dates.
      const filterActivitiesSorted = activitiesSorted.slice(
        0,
        daysAwayFromMonday + 1,
      );

      const userMinutes = activitiesAndCommitmentArray.user_minutes; //gets the users commitment of minutes converted to seconds

      const filteredActivities = filterActivitiesSorted.filter(
        (activity) => activity.seconds >= userMinutes,
      );

      const weeklyActivitiesCount = filteredActivities.length; //amount of activities that fulfills the minimum amount of minutes per session.

      const userDaysPerWeek = activitiesAndCommitmentArray.user_days;

      //get the specific dates for current week
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - daysAwayFromMonday); //getDate returns the a number (the day of the month eg 21.)
      startOfWeek.setHours(0, 0, 0); //makes sure it is monday 00:00

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59);

      //now we check if current date is within the specicif dates
      const inCurrentWeek =
        currentDate >= startOfWeek && currentDate <= endOfWeek;

      const goalMetThisWeek =
        weeklyActivitiesCount >= userDaysPerWeek && inCurrentWeek;

      if (goalMetThisWeek) {
        //Have we already updated the streak this week?
        const lastStreakUpdate =
          activitiesAndCommitmentArray.last_weekly_commitment_update;
        const currentWeek = startOfWeek.getWeek();

        //If the last streak update was this week, to not increment
        if (lastStreakUpdate && lastStreakUpdate.getWeek() === currentWeek) {
          setCommitmentAndActivityData(commitmentAndActivityData);
        } else {
          //
          setCommitmentAndActivityData(commitmentAndActivityData + 1);
          setLastStreakUpate(currentDate);
        }
      }
    });
  }, []);

  useEffect(() => {
    api.getBookmarksCountsByDate((counts) => {
      var formatted = getMapData(counts);

      setAllWordsData(formatted);

      setAllWordsDataPerMonths(calculateCountPerMonth_Words(formatted));
    });

    //the activitiesArray argument in the anonymous function (which is also an argument)
    //is what is passed as the argument to the function in userStats.js
    api.getUserActivityByDay((activitiesArray) => {
      setDailyExerciseAndReadingTimes(activitiesArray);
      setMonthlyExerciseAndReadingTimes(
        calculateCountPerMonth_Activity(activitiesArray),
      );

      //Adds the activity arrays together that we get from getUserActivityByDay
      const bothActivitiesArray = activitiesArray.exercises.concat(
        activitiesArray.reading,
      );

      //adds together the seconds for each day. this is an object
      const combinedObject = bothActivitiesArray.reduce((acc, curr) => {
        if (acc[curr.date]) {
          acc[curr.date] += curr.seconds;
        } else {
          acc[curr.date] = curr.seconds;
        }
        return acc;
      }, {});

      //converts back into array
      const combinedArray = Object.keys(combinedObject).map((date) => ({
        date: date,
        seconds: combinedObject[date],
      }));

      // filters out the instances where seconds is 0 and orders by date
      const activitiesSorted = combinedArray
        .filter((activity) => activity.seconds > 0)
        .sort((a, b) => b.date.localeCompare(a.date));
      console.log(activitiesSorted);

      const currentDate = new Date();
      const currentDateString = currentDate.toISOString().slice(0, 10);

      let streak = 0;
      let previousDate = currentDateString;

      for (const activity of activitiesSorted) {
        if (activity.date === previousDate) {
          streak++;
          previousDate = getPreviousDate(activity.date);
        } else {
          break;
        }
      }

      setCurrentStreak(streak);
    });
  }, [api, setCurrentStreak]);

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
        currentStreak={currentStreak}
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
