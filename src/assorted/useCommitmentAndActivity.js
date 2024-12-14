import { useEffect, useState } from "react";

const useCommitmentAndActivity = (api) => {
  const [commitmentAndActivityData, setCommitmentAndActivityData] = useState(0);
  const [lastCommitmentUpdate, setLastCommitmentUpdate] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      api.getUserActivityAndCommitment((activitiesAndCommitmentArray) => {
        const currentDate = new Date();
        //dayOfWeek = 5 if today is friday
        const dayOfWeek = currentDate.getDay();
        let daysAwayFromMonday;

        //if day of week is 0 it is sunday. Monday was 6 days ago
        if (dayOfWeek === 0) {
          daysAwayFromMonday = 6;
        } else {
          //else monday was this many days ago
          daysAwayFromMonday = dayOfWeek - 1;
        }

       let daysLeftInWeek = 8 - dayOfWeek;

        const activityTimeByDay = activitiesAndCommitmentArray.user_activities;
        const bothActivitiesArray = activityTimeByDay.exercises.concat(
          activityTimeByDay.reading,
        );

        const combinedObject = bothActivitiesArray.reduce((acc, curr) => {
          if (acc[curr.date]) {
            acc[curr.date] += curr.seconds;
          } else {
            acc[curr.date] = curr.seconds;
          }
          return acc;
        }, {});

        const combinedArray = Object.keys(combinedObject).map((date) => ({
          date: date,
          seconds: combinedObject[date],
        }));

        const activitiesSorted = combinedArray.sort((a, b) =>
          b.date.localeCompare(a.date),
        );

        let startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - daysAwayFromMonday);
        startOfWeek.setHours(0, 0, 0);

        let endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59);

        //filteredActivitiesSorted stores the sessions within the current week.
        const filteredActivitiesSorted = activitiesSorted.filter((activity) => {
          const activityDate = new Date(activity.date);
          return activityDate >= startOfWeek && activityDate <= endOfWeek;
        });

        //stores the minutes goal the user picked
        const userMinutes = activitiesAndCommitmentArray.user_minutes;
        //seconds version to be able to filter
        const userSeconds = userMinutes * 60;

        //filters out sessions that is less than the seconds the user picked as minutes goal
        const filteredActivities = filteredActivitiesSorted.filter(
          (activity) => activity.seconds >= userSeconds,
        );

        //How many times the user have practiced this week
        const weeklyActivitiesCount = filteredActivities.length;

        //Stores how many days the user wants to practice every week
        const userDaysPerWeek = activitiesAndCommitmentArray.user_days;

        //inCurrentWeek allows you to check wether the sessions practiced are within the current week
        const inCurrentWeek =
          currentDate >= startOfWeek && currentDate <= endOfWeek;

        const goalMetThisWeek =
          weeklyActivitiesCount >= userDaysPerWeek && inCurrentWeek;

        const currentConsecutiveWeeks =
          activitiesAndCommitmentArray.consecutive_weeks;

        const lastCommitmentUpdate = new Date(
            activitiesAndCommitmentArray.commitment_last_updated,
          );
          
        if (goalMetThisWeek) {
          if (
            lastCommitmentUpdate != null &&
            lastCommitmentUpdate.getTime() >= startOfWeek.getTime() &&
            lastCommitmentUpdate.getTime() <= endOfWeek.getTime()
          ) {
            setCommitmentAndActivityData(currentConsecutiveWeeks);
          } else {
            setCommitmentAndActivityData(currentConsecutiveWeeks + 1);
            setLastCommitmentUpdate(currentDate);
          }
        } else {
          // checks if there are enough days left in the week for the user to potentially meet their goal
          if (userDaysPerWeek - weeklyActivitiesCount > daysLeftInWeek) {
            // if not the consecutive weeks is reset
            setCommitmentAndActivityData(0);
            setLastCommitmentUpdate(currentDate);
          }
          // if it is it's set to the current amount
          else {
            setCommitmentAndActivityData(currentConsecutiveWeeks);
          }
        }
      });
    };

    fetchData();
  }, [api]);
  
  return { commitmentAndActivityData, lastCommitmentUpdate };
};

export default useCommitmentAndActivity;
