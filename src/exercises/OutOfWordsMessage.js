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

        <h2>You already practiced the words that were due today 🎉</h2>

        <p></p>

        <br />
        <br />
        <p>
          You have <b>{totalInLearning}</b> {Pluralize.word(totalInLearning)} that are{" "}
          <Link to={"words"}>
            <b>currently in learning</b>
          </Link>
          .
        </p>

        <p>
          Words are scheduled for exercises according to spaced-repetition principles and we believe there is no need to
          practice your {totalInLearning} words again today.
        </p>

        <p>Come back tomorrow for more exercises :)</p>
      </div>
      <s.BottomRow>
        {/*<StyledButton primary onClick={goBackAction}>*/}
        {/*  {"Go Reading Instead"}*/}
        {/*</StyledButton>*/}
      </s.BottomRow>
    </s.Exercise>
  );
}
