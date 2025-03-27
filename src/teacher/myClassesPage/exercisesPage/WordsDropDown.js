import PractisedWordsList from "./PractisedWordsList";
import LearnedWordsList from "./LearnedWordsList";
import NonStudiedWordsList from "./NonStudiedWordsList";
import { InfoOutlined } from "@mui/icons-material";
import strings from "../../../i18n/definitions";
import * as s from "../../styledComponents/WordsDropDown.sc";
import { StyledTooltip } from "../../styledComponents/StyledTooltip.sc";
import { IconExplanation } from "./AttemptIcons";

const WordsDropDown = ({ card }) => {
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
              <InfoOutlined className="information-icon" />
            </StyledTooltip>
          )}
        </div>
        <div className="exercise-drop-down-container">
          {card === "practised" && <PractisedWordsList />}
          {card === "learned" && <LearnedWordsList />}
          {card === "non-studied" && <NonStudiedWordsList />}
        </div>
      </div>
    </s.StyledWordsDropDown>
  );
};
export default WordsDropDown;
