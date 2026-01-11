import * as s from "./exerciseTypes/Exercise.sc";
import Pluralize from "../utils/text/pluralize";
import useScreenWidth from "../hooks/useScreenWidth";
import BackArrow from "../pages/Settings/settings_pages_shared/BackArrow";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { APIContext } from "../contexts/APIContext";
import { formatFutureDueTime } from "../utils/misc/readableTime";

export default function OutOfWordsMessage({ goBackAction }) {
  const { isMobile } = useScreenWidth();
  const api = useContext(APIContext);

  const [totalInLearning, setTotalInLearning] = useState();
  const [nextWordDueText, setNextWordDueText] = useState(null);

  useEffect(() => {
    api.getCountOfAllScheduledWords((totalInLearning) => {
      setTotalInLearning(totalInLearning);
    });
    api.getNextWordDueTime((nextTime) => {
      if (nextTime && new Date(nextTime) > new Date()) {
        setNextWordDueText(formatFutureDueTime(new Date(nextTime)));
      }
    });
  }, []);

  return (
    <s.Exercise>
      {isMobile && <BackArrow func={goBackAction} />}
      <div className="contextExample">
        <br />
        <br />

        <h2>
          Nothing more to study at the moment.
          {nextWordDueText
            ? ` New words will be ready to practice ${nextWordDueText}.`
            : ""}{" "}
          :)
        </h2>

        <br />
        <br />
        <p>
          Words are scheduled for exercises according to spaced-repetition principles and you already practiced the
          words that were due at this moment 🎉
        </p>

        <br />

        <p>
          <small>
            Note: You currently have <b>{totalInLearning}</b> {Pluralize.word(totalInLearning)}{" "}
            <Link to={"/words"}>
              <b>in learning</b>
            </Link>
            . You can also increase the number of words in learning from the{" "}
            <Link to={"/account_settings/exercise_scheduling"}>
              {" "}
              <b>Settings &gt; Exercises &gt; Scheduling</b>
            </Link>{" "}
            preferences page and then you can get more exercises also today.
          </small>
        </p>
      </div>
    </s.Exercise>
  );
}
