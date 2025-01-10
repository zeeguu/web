import { useState, useEffect } from "react";
import Feature from "../../features/Feature.js";
import { correctnessBasedOnTries } from "../CorrectnessBasedOnTries.js";
import LevelIndicator from "./levelIndicator/LevelIndicator.js";
import LearningCycleIndicator from "./LearningCycleIndicator.js";

export default function BookmarkProgressBar({ bookmark, message, isHidden }) {
  // Note that the userIsCorrect and userIsWrong states are needed both
  // for the logic of this component to work.
  // When message changes, the correctness changes but the two can still be
  // both false if the user is still in the process.
  // Probably would be nice to refactor but till then, beware.
  const [userIsCorrect, setUserIsCorrect] = useState(false);
  const [userIsWrong, setUserIsWrong] = useState(false);

  useEffect(() => {
    const [userIsCorrect, userIsWrong] = correctnessBasedOnTries(message);
    setUserIsCorrect(userIsCorrect);
    setUserIsWrong(userIsWrong);
  }, [message]);

  return (
    <>
      {Feature.exercise_levels() && (
        <LevelIndicator
          bookmark={bookmark}
          userIsCorrect={userIsCorrect}
          userIsWrong={userIsWrong}
          isHidden={isHidden}
        />
      )}
      {Feature.merle_exercises() && (
        <LearningCycleIndicator
          bookmark={bookmark}
          userIsCorrect={userIsCorrect}
          userIsWrong={userIsWrong}
          isHidden={isHidden}
        />
      )}
    </>
  );
}
