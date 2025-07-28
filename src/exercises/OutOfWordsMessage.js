import * as s from "./exerciseTypes/Exercise.sc";
import Pluralize from "../utils/text/pluralize";
import useScreenWidth from "../hooks/useScreenWidth";
import BackArrow from "../pages/Settings/settings_pages_shared/BackArrow";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { APIContext } from "../contexts/APIContext";

export default function OutOfWordsMessage({ goBackAction }) {
  const { isMobile } = useScreenWidth();
  const api = useContext(APIContext);

  const [totalInLearning, setTotalInLearning] = useState();

  useEffect(() => {
    api.getCountOfAllScheduledBookmarks((totalInLearning) => {
      setTotalInLearning(totalInLearning);
    });
  }, []);

  return (
    <s.Exercise>
      {isMobile && <BackArrow />}
      <div className="contextExample">
        <br />
        <br />

        <h2>No more exercises today. Come back tomorrow! :)</h2>

        <br />
        <br />
        <p>
          Words are scheduled for exercises according to spaced-repetition principles and you already practiced the
          words that were due today 🎉
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
              <b>Settings>Exercises>Scheduling</b>
            </Link>{" "}
            preferences page and then you can get more exercises also today.
          </small>
        </p>
      </div>
    </s.Exercise>
  );
}
