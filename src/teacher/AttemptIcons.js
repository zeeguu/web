import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import ClearRoundedIcon from "@material-ui/icons/ClearRounded";
import PriorityHighRoundedIcon from "@material-ui/icons/PriorityHighRounded";
import { v4 as uuid } from "uuid";
import strings from "../i18n/definitions";
import * as s from "./AttemptIcons.sc";

const CorrectAttempt = () => {
  return (
    <s.StyledAttemptIcons>
      <CheckRoundedIcon className="correct-attempt-icon" />
    </s.StyledAttemptIcons>
  );
};

const WrongAttempt = () => {
  return (
    <s.StyledAttemptIcons>
      <ClearRoundedIcon className="wrong-attempt-icon" />
    </s.StyledAttemptIcons>
  );
};

const SolutionShown = () => {
  return (
    <s.StyledAttemptIcons>
      <PriorityHighRoundedIcon className="solution-shown-icon" />
    </s.StyledAttemptIcons>
  );
};

const HintUsed = () => {
  return (
    <s.StyledAttemptIcons>
      <p className="hint-used-icon">?</p>
    </s.StyledAttemptIcons>
  );
};

const FeedBack = (props) => {
  return (
    <s.StyledAttemptIcons>
      <p className="student-feedback">{props.children}</p>
    </s.StyledAttemptIcons>
  );
};

const FeedbackGiven = (feedback) => {
  switch (feedback) {
    case "too_easy":
      return <FeedBack>{strings.tooEasy}</FeedBack>;
    case "too_hard":
      return <FeedBack>{strings.tooHard}</FeedBack>;
    case "bad_word":
      return <FeedBack>{strings.badWord}</FeedBack>;
    case "not_a_good_example":
      return <FeedBack>{strings.badExample}</FeedBack>;
    case "dont_show_it_to_me_again":
      return <FeedBack>{strings.dontShowAgain}</FeedBack>;
    default:
      const newString = feedback.replaceAll("_", " ");
      return <FeedBack>{newString}</FeedBack>;
  }
};

export const AttemptIcons = ({ attemptString }) => {
  const setIcon = (char) => {
    switch (char) {
      case "W":
        return <WrongAttempt key={char + uuid()} />;
      case "H":
        return <HintUsed key={char + uuid()} />;
      case "S":
        return <SolutionShown key={char + uuid()} />;
      default:
        return <CorrectAttempt key={char + uuid()} />;
    }
  };

  if (attemptString.includes("_")) {
    return FeedbackGiven(attemptString);
  }

  const attemptChars = attemptString.split("");
  return (
    <s.StyledAttemptIcons>
      <div className="used-attempt-icon">
        {attemptChars.map((char) => setIcon(char))}
      </div>
    </s.StyledAttemptIcons>
  );
};

export const IconExplanation = () => {
  return (
    <s.StyledAttemptIcons>
      <div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <WrongAttempt />
          <p style={{ marginLeft: "1em" }}>
            {strings.incorrectAttemptIconExplanation}
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <CorrectAttempt />
          <p style={{ marginLeft: ".5em" }}>
            {strings.correctExerciseIconExplanation}
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <HintUsed />
          <p style={{ marginLeft: ".5em" }}>
            {strings.hintInExerciseIconExplanation}
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <SolutionShown />
          <p style={{ marginLeft: ".5em" }}>
            {strings.askedForSolutionInExercise}
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <p style={{ fontWeight: 500, marginRight: ".6em" }}>
            {strings.studentExerciseFeedback}
          </p>
          <p> {strings.exerciseFeedbackFromStudent}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <p style={{ marginRight: ".4em", fontWeight: 500 }}>
            {strings.pickTheWordOrMatchThreePairs}
          </p>
          <p> {strings.typeOfExerciseIconExplanation}</p>
        </div>
      </div>
    </s.StyledAttemptIcons>
  );
};

export const StarExplanation = () => {
  return (
    <s.StyledAttemptIcons>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <p style={{ marginRight: ".4em", fontWeight: 500 }}>
          {strings.starExplanation}
        </p>
      </div>
    </s.StyledAttemptIcons>
  );
};
