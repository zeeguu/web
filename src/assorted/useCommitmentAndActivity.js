import { useEffect, useState } from "react";

const useCommitmentAndActivity = (api) => {
  const [commitmentAndActivityData, setCommitmentAndActivityData] = useState(0);
  const [lastCommitmentUpdate, setLastCommitmentUpdate] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      api.getUserActivityAndCommitment((activitiesAndCommitmentArray) => {
        //currentDate = Fri Dec 13 2024 15:03:13 GMT+0100 (centraleuropeisk normaltid)
        const currentDate = new Date();
        //dayOfWeek = 5 (since it is friday today)
        const dayOfWeek = currentDate.getDay();
        let daysAwayFromMonday;

        //if day of week is 0 it is sunday monday was 6 days ago
        if (dayOfWeek === 0) {
          daysAwayFromMonday = 6;
        } else {
          //else monday was this many days ago
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
        //combinedArray[0].seconds) could be 300
        //combinedArray[0].date) could be 2024-12-12

        const activitiesSorted = combinedArray.sort((a, b) =>
          b.date.localeCompare(a.date),
        );

        let startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - daysAwayFromMonday);
        startOfWeek.setHours(0, 0, 0);

        let endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59);

        //filteredActivitiesSorted only keeps track of the sessions withing the current week.
        const filteredActivitiesSorted = activitiesSorted.filter((activity) => {
          const activityDate = new Date(activity.date); // Convert date string to Date object
          return activityDate >= startOfWeek && activityDate <= endOfWeek;
        });

        console.log(
          "This is the filteredActivitesSorted before filtering out short sessions",
        );
        filteredActivitiesSorted.forEach((item) => {
          console.log(item);
        });

        //stores the minutes goal the user picked
        const userMinutes = activitiesAndCommitmentArray.user_minutes;

        //CHLOE! BUG: Does not filter out sessions that is less than the minutes the user picked even if it should
        const filteredActivities = filteredActivitiesSorted.filter(
          (activity) => activity.seconds >= userMinutes,
        );

        console.log(
          "This is the filteredActivitesSorted when we have filtered out the one with too few time",
        );
        filteredActivities.forEach((item) => {
          console.log(item);
        });

        //How many times the user have practiced this week
        const weeklyActivitiesCount = filteredActivities.length;

        //Stores how many days the user wants to practice every week
        const userDaysPerWeek = activitiesAndCommitmentArray.user_days;

        const inCurrentWeek =
          currentDate >= startOfWeek && currentDate <= endOfWeek;

        const goalMetThisWeek =
          weeklyActivitiesCount >= userDaysPerWeek && inCurrentWeek;

        const currentCommitmentAndActivityData =
          activitiesAndCommitmentArray.consecutive_weeks;

        if (goalMetThisWeek) {
          const lastWeeklyCommitmentUpdate = new Date(
            activitiesAndCommitmentArray.commitment_last_updated,
          );

          console.log("lastWeeklyCommitmentUpdate", lastWeeklyCommitmentUpdate);
          console.log("startofWeek", startOfWeek);
          console.log("endOfWeek", endOfWeek);

          if (
            lastWeeklyCommitmentUpdate != null &&
            lastWeeklyCommitmentUpdate.getTime() >= startOfWeek.getTime() &&
            lastWeeklyCommitmentUpdate.getTime() <= endOfWeek.getTime()
          ) {
            setCommitmentAndActivityData(currentCommitmentAndActivityData);
            console.log("It is in the week!");
            console.log(
              "currentCommitmentAndActivityData",
              currentCommitmentAndActivityData,
            );
          } else {
            console.log("It is NOT in the week!");
            setCommitmentAndActivityData(currentCommitmentAndActivityData + 1);
            setLastCommitmentUpdate(currentDate);
          }
        } else {
          console.log("is this what is happening?");
          setCommitmentAndActivityData(0);
        }
      });
    };

    fetchData();
  }, [api]);

  console.log(
    "This is the commitmentAndActivityData, lastCommitmentUpdate",
    commitmentAndActivityData,
    lastCommitmentUpdate,
  );
  return { commitmentAndActivityData, lastCommitmentUpdate };
};

export default useCommitmentAndActivity;
