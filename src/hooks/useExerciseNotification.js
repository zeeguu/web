import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { APIContext } from "../contexts/APIContext";
import { ExerciseCountContext } from "../exercises/ExerciseCountContext";
import { MAX_EXERCISE_TO_DO_NOTIFICATION } from "../exercises/ExerciseConstants";

export default function useExerciseNotification() {
  const exerciseNotification = useContext(ExerciseCountContext);
  const [hasExerciseNotification, setHasExerciseNotification] = useState(exerciseNotification.hasExercises);
  const [totalExercisesInPipeline, setTotalExercisesInPipeline] = useState();
  const [notificationMsg, setNotificationMsg] = useState();
  const path = useLocation().pathname;

  useEffect(() => {
    exerciseNotification.fetchAndUpdate();

    // eslint-disable-next-line
  }, [path]);

  useEffect(() => {
    exerciseNotification.fetchAndUpdate();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (totalExercisesInPipeline) {
      setNotificationMsg(
        totalExercisesInPipeline > MAX_EXERCISE_TO_DO_NOTIFICATION
          ? `${MAX_EXERCISE_TO_DO_NOTIFICATION}+`
          : totalExercisesInPipeline,
      );
    } else {
      setNotificationMsg("");
    }
  }, [totalExercisesInPipeline]);

  return { hasExerciseNotification, notificationMsg };
}
