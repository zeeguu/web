import { useEffect, useState } from 'react';

const useCommitmentAndActivity = (api) => {
  const [commitmentAndActivityData, setCommitmentAndActivityData] = useState(0);
  const [lastCommitmentUpdate, setLastCommitmentUpdate] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      api.getUserActivityAndCommitment((activitiesAndCommitmentArray) => {
        console.log(activitiesAndCommitmentArray);

        const currentDate = new Date();
        const dayOfWeek = currentDate.getDay();
        let daysAwayFromMonday;

        if (dayOfWeek === 0) {
          daysAwayFromMonday = 6;
        } else {
          daysAwayFromMonday = dayOfWeek - 1;
        }

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

        const filteredActivitiesSorted = activitiesSorted.slice(
          0,
          daysAwayFromMonday + 1,
        );

        const userMinutes = activitiesAndCommitmentArray.user_minutes;

        const filteredActivities = filteredActivitiesSorted.filter(
          (activity) => activity.seconds >= userMinutes,
        );

        const weeklyActivitiesCount = filteredActivities.length;
        const userDaysPerWeek = activitiesAndCommitmentArray.user_days;

        let startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - daysAwayFromMonday);
        startOfWeek.setHours(0, 0, 0);

        let endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59);

        const inCurrentWeek =
          currentDate >= startOfWeek && currentDate <= endOfWeek;

        const goalMetThisWeek =
          weeklyActivitiesCount >= userDaysPerWeek && inCurrentWeek;

        const currentCommitmentAndActivityData =
          activitiesAndCommitmentArray.consecutive_weeks;

        if (goalMetThisWeek) {
          const lastWeeklyCommitmentUpdate = new Date(
            activitiesAndCommitmentArray.last_commitment_update,
          );

          if (
            lastWeeklyCommitmentUpdate != null &&
            lastWeeklyCommitmentUpdate >= startOfWeek &&
            lastWeeklyCommitmentUpdate <= endOfWeek
          ) {
            setCommitmentAndActivityData(currentCommitmentAndActivityData);
          } else {
            setCommitmentAndActivityData(currentCommitmentAndActivityData + 1);
            setLastCommitmentUpdate(currentDate);
          }
        } else {
          setCommitmentAndActivityData(0);
        }
      });
    };

    fetchData();
  }, [api]);

  return { commitmentAndActivityData, lastCommitmentUpdate };
};

export default useCommitmentAndActivity;