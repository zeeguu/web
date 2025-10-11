import { useState, useEffect } from "react";
import Feature from "../../features/Feature.js";
import { correctnessBasedOnTries } from "../CorrectnessBasedOnTries.js";
import LevelIndicator from "./levelIndicator/LevelIndicator.js";
import { WordProgressWrapper } from "./levelIndicator/LevelIndicator.sc.js";
import LearningCycleIndicator from "./LearningCycleIndicator.js";

export default function WordProgressBar({ bookmark, message, isGreyedOutBar }) {
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
      <WordProgressWrapper>
        <LevelIndicator
          bookmark={bookmark}
          userIsCorrect={userIsCorrect}
          userIsWrong={userIsWrong}
          isGreyedOutBar={isGreyedOutBar}
        />
      </WordProgressWrapper>
    </>
  );
}
