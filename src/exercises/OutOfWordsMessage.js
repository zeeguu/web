import * as s from "./exerciseTypes/Exercise.sc";
import strings from "../i18n/definitions";
import Pluralize from "../utils/text/pluralize";
import useScreenWidth from "../hooks/useScreenWidth";
import { MOBILE_WIDTH } from "../components/MainNav/screenSize";
import BackArrow from "../pages/Settings/settings_pages_shared/BackArrow";
import { StyledButton } from "../components/allButtons.sc";

export default function OutOfWordsMessage({ totalInLearning, goBackAction }) {
  const { screenWidth } = useScreenWidth();
  return (
    <s.Exercise>
      {screenWidth < MOBILE_WIDTH && <BackArrow />}
      <div className="contextExample">
        <h2>{strings.noTranslatedWords}</h2>
        <p>
          This means you already practiced all the words you have translated and
          have selected to be part of the exercises. These are scheduled
          according to our spaced-repetition and we will let you know when it is
          time to train them again.
        </p>
        <p>You can always go read to find new words to start learning.</p>
        <p>
          You are currently learning <b>{totalInLearning}</b>{" "}
          {Pluralize.word(totalInLearning)}.
        </p>
      </div>
      <s.BottomRow>
        <StyledButton primary onClick={goBackAction}>
          {"Go to Reading"}
        </StyledButton>
      </s.BottomRow>
    </s.Exercise>
  );
}
