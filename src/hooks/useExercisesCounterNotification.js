import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { APIContext } from "../contexts/APIContext";

export default function useExercisesCounterNotification() {
  const path = useLocation().pathname;
  const api = useContext(APIContext);

  const [hasExerciseNotification, setHasExerciseNotification] = useState(false);
  const [totalExercisesInPipeline, setTotalExercisesInPipeline] = useState();

  useEffect(() => {
    console.log("UPDATING COUNTER");
    updateExercisesCounter();

    // eslint-disable-next-line
  }, [path]);

  function updateExercisesCounter() {
    api.getCountOfBookmarksRecommendedForPractice((scheduledBookmarksCount) => {
      setTotalExercisesInPipeline(scheduledBookmarksCount);

      setHasExerciseNotification(scheduledBookmarksCount >= 1);
    });
  }

  function decrementExerciseCounter() {
    setTotalExercisesInPipeline(totalExercisesInPipeline - 1);
    setHasExerciseNotification(true);
  }

  function incrementExerciseCounter() {
    setTotalExercisesInPipeline(totalExercisesInPipeline + 1);
    setHasExerciseNotification(true);
  }

  function hideExerciseCounter() {
    setHasExerciseNotification(false);
  }

  return {
    hasExerciseNotification,
    totalExercisesInPipeline,
    updateExercisesCounter,
    decrementExerciseCounter,
    incrementExerciseCounter,
    hideExerciseCounter,
  };
}