import * as s from "./exerciseTypes/Exercise.sc";
import Pluralize from "../utils/text/pluralize";
import useScreenWidth from "../hooks/useScreenWidth";
import { MOBILE_WIDTH } from "../components/MainNav/screenSize";
import BackArrow from "../pages/Settings/settings_pages_shared/BackArrow";
import { Link } from "react-router-dom";

export default function OutOfWordsMessage({ totalInLearning, goBackAction }) {
  const { screenWidth } = useScreenWidth();

  return (
    <s.Exercise>
      {screenWidth < MOBILE_WIDTH && <BackArrow />}
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
          Note: You currently have <b>{totalInLearning}</b> {Pluralize.word(totalInLearning)}{" "}
          <Link to={"words"}>
            <b>in learning</b>
          </Link>
          . You can also increase the number of words you can study in a day from the{" "}
          <Link to={"/account_settings/exercise_scheduling"}>
            {" "}
            <b>Exercises>Scheduling</b>
          </Link>{" "}
          preferences page.
        </p>
      </div>
    </s.Exercise>
  );
}
