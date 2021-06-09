import PractisedWordsList from "./PractisedWordsList";
import LearnedWordsList from "./LearnedWordsList";
import NonStudiedWordsList from "./NonStudiedWordsList";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import strings from "../i18n/definitions";
import { StyledTooltip } from "./StyledTooltip.sc";
import { IconExplanation } from "./AttemptIcons";

const WordsDropDown = ({ card, words, practisedWords, learnedWords, nonStudiedWords }) => {

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
    <div
      style={{
        padding: 20,
        width: "95%",
        boxShadow:
          "0 4px 8px 0 rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.08)",
        borderRadius: "15px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <h3 style={{ color: "#5492b3" }}>{setHeadline()}</h3>
        <StyledTooltip label={IconExplanation}>
          <InfoOutlinedIcon style={{ color: "#5492b3", fontSize: "45px" }} />
        </StyledTooltip>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          flexWrap: "wrap",
        }}
      >
        {card === "practised" && <PractisedWordsList words={practisedWords} />}
        {card === "learned" && <LearnedWordsList words={learnedWords} />}
        {card === "non-studied" && <NonStudiedWordsList words={nonStudiedWords}/>}
      </div>
    </div>
  );
};
export default WordsDropDown;
