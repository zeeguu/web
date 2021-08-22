import PractisedWordsList from "./PractisedWordsList";
import LearnedWordsList from "./LearnedWordsList";
import NonStudiedWordsList from "./NonStudiedWordsList";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import strings from "../i18n/definitions";
import * as s from "./WordsDropDown.sc";
import { StyledTooltip } from "./StyledTooltip.sc";
import { IconExplanation } from "./AttemptIcons";

const WordsDropDown = ({ api, card }) => {
  const setHeadline = () => {
    switch (card) {
      case "non-studied":
        return strings.wordsTranslatedButNotInZeeguu;
      case "learned":
        return strings.wordsTranslatedAndLearned;
      default:
        return strings.wordsTranslatedAndExercised;
    }
  };

  return (
    <s.StyledWordsDropDown>
      <div className="exercise-categories-drop-down">
        <div className="exercise-categories-drop-down-headline-container">
          <h3 className="exercise-drop-down-headlines">{setHeadline()}</h3>
          {card === "practised" && (
            <StyledTooltip label={IconExplanation()}>
              <InfoOutlinedIcon className="information-icon" />
            </StyledTooltip>
          )}
        </div>
        <div className="exercise-drop-down-container">
          {card === "practised" && <PractisedWordsList api={api} />}
          {card === "learned" && <LearnedWordsList api={api} />}
          {card === "non-studied" && <NonStudiedWordsList api={api} />}
        </div>
      </div>
    </s.StyledWordsDropDown>
  );
};
export default WordsDropDown;
