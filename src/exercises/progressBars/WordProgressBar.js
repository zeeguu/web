import { useState, useEffect } from "react";
import Feature from "../../features/Feature.js";
import { correctnessBasedOnTries } from "../CorrectnessBasedOnTries.js";
import LevelIndicator from "./levelIndicator/LevelIndicator.js";
import { WordProgressWrapper } from "./levelIndicator/LevelIndicator.sc.js";

export default function WordProgressBar({ bookmark, message, isGreyedOutBar }) {
  // The level indicator predicts the new level from the message itself;
  // userIsWrong is only for the blinking. Both stay unset while the learner
  // is still in the middle of an answer.
  const [userIsWrong, setUserIsWrong] = useState(false);

  useEffect(() => {
    const [, userIsWrong] = correctnessBasedOnTries(message);
    setUserIsWrong(userIsWrong);
  }, [message]);

  return (
    <>
      <WordProgressWrapper>
        <LevelIndicator
          bookmark={bookmark}
          message={message}
          userIsWrong={userIsWrong}
          isGreyedOutBar={isGreyedOutBar}
        />
      </WordProgressWrapper>
    </>
  );
}
