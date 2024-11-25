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
  const [commitmentAndActivityData, setCommitmentAndActivityData] = useState(0); //added useState for the streak
  const [lastCommitmentUpdate, setLastCommitmentUpate] = useState(null);

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

  /*
   activitiesAndCommitmentArray likely looks like
   {
      user_minutes: 2000, //in seconds 
      user_days: 3,
      consecutive_weeks: 5, 
      activity_time_by_day: {        
        reading: [                     
        { date: "2024-11-18", seconds: 3600 },
          ...
        ],
        exercises: [              
          { date: "2024-11-18", seconds: 1200 },
          ...
        ]
      }
    }
   */
  useEffect(() => {
    api.getUserActivityAndCommitment((activitiesAndCommitmentArray) => {
      console.log(activitiesAndCommitmentArray);

      //date with format eg. "Thu Nov 21 2024 15:32:26 GMT+0100"
      const currentDate = new Date();
      //day of the week (sunday = 0, monday = 1 etc.). If it is thursday -> dayOfWeek = 4
      const dayOfWeek = currentDate.getDay();
      let daysAwayFromMonday;

      //if dayOfWeek === 0 we know it sunday, and we know we are 6 days away from monday
      if (dayOfWeek === 0) {
        daysAwayFromMonday = 6;
        //otherwise we calculate the days away from monday like below
      } else {
        daysAwayFromMonday = dayOfWeek - 1;
      }

      //Stores only the activity by day data
      const activityTimeByDay = activitiesAndCommitmentArray.user_activities;
      console.log(activityTimeByDay);

      /*
        activityTimeByDay would probably look something like
        {
          reading: [
            { date: "2024-11-18", seconds: 3600 },
            { date: "2024-11-19", seconds: 1800 },
          ],
          exercises: [
            { date: "2024-11-18", seconds: 1200 },
            { date: "2024-11-20", seconds: 2400 },
          ]
        }
        */

      /*
      Adds the activity arrays together that we get from getUserActivityByDay
      "reading" and "exercises" should dissapear because concat created a new array
      that combines all the objects from both arrays
      */
      const bothActivitiesArray = activityTimeByDay.exercises.concat(
        activityTimeByDay.reading,
      );

      /**
       Format of bothActivitiesArray probably looks like
       [
        { date: "2024-11-18", seconds: 1200 }, // Exercises
        { date: "2024-11-20", seconds: 2400 }, // Exercises
        { date: "2024-11-18", seconds: 3600 }, // Reading
        { date: "2024-11-19", seconds: 1800 }, // Reading
       ];
       */

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
      /*
      combinedArray probably looks something like
      [
        { date: "2024-11-18", seconds: 4800 },
        { date: "2024-11-19", seconds: 1800 },
        { date: "2024-11-20", seconds: 2400 },
      ];
      */

      // orders the instances by date
      const activitiesSorted = combinedArray.sort((a, b) =>
        b.date.localeCompare(a.date),
      );

      //the array only containing activites within the current week
      const filteredActivitiesSorted = activitiesSorted.slice(
        0,
        daysAwayFromMonday + 1,
      );
      //gets the users commitment of minutes converted to seconds
      const userMinutes = activitiesAndCommitmentArray.user_minutes;

      //filter out the activities less than the user defined minutes
      const filteredActivities = filteredActivitiesSorted.filter(
        (activity) => activity.seconds >= userMinutes,
      );

      //amount of valid activities for the current week
      const weeklyActivitiesCount = filteredActivities.length;

      //the commitment of days to practice per week
      const userDaysPerWeek = activitiesAndCommitmentArray.user_days;

      //get the specific dates for current week
      //format "Thu Nov 21 2024 15:32:26 GMT+0100 (centraleuropeisk normaltid)"
      let startOfWeek = new Date(currentDate);
      //format eg. "Thu Nov 18 2024 15:32:26 GMT+0100 (centraleuropeisk normaltid)"
      startOfWeek.setDate(currentDate.getDate() - daysAwayFromMonday); //getDate returns the a number (the day of the month eg 21.)
      //format eg. Thu Nov 14 2024 00:00:00 GMT+0100 (centraleuropeisk normaltid)
      startOfWeek.setHours(0, 0, 0); //makes sure it is monday 00:00

      //starting reference
      let endOfWeek = new Date(startOfWeek);
      //gives us the end of the week
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59);

      //now we check if current date is within the specicif dates
      const inCurrentWeek =
        currentDate >= startOfWeek && currentDate <= endOfWeek;

      const goalMetThisWeek =
        weeklyActivitiesCount >= userDaysPerWeek && inCurrentWeek;

      const currentCommitmentAndActivityData =
        activitiesAndCommitmentArray.consecutive_weeks;

      //we have reached our weekly commitment within the current week
      if (goalMetThisWeek) {
        //Now we want to check if we have already updated the streak this week
        const lastWeeklyCommitmentUpdate = new Date(
          activitiesAndCommitmentArray.last_commitment_update,
        );

        //If the last streak update was this week, do not increment and not null
        if (
          lastWeeklyCommitmentUpdate != null &&
          lastWeeklyCommitmentUpdate >= startOfWeek &&
          lastWeeklyCommitmentUpdate <= endOfWeek
        ) {
          setCommitmentAndActivityData(currentCommitmentAndActivityData);
        } else {
          //update the CommitmentAndActivityData variable by one and update when the Streak was updated
          setCommitmentAndActivityData(currentCommitmentAndActivityData + 1);
          setLastCommitmentUpate(currentDate);
        }
      } else {
        setCommitmentAndActivityData(currentCommitmentAndActivityData);
      }
    });
  }, [api, setCommitmentAndActivityData, commitmentAndActivityData]);

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
