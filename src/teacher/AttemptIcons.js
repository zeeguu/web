import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import ClearRoundedIcon from "@material-ui/icons/ClearRounded";
import PriorityHighRoundedIcon from "@material-ui/icons/PriorityHighRounded";
import { v4 as uuid } from "uuid";
import strings from "../i18n/definitions";

const CorrectAttempt = () => {
  return (
    <CheckRoundedIcon
      style={{ color: "green", margin: "12px -3px 0 -2px", fontSize: 18 }}
    />
  );
};

const WrongAttempt = () => {
  return (
    <ClearRoundedIcon
      style={{ color: "red", margin: "12px -3px 0 -2px", fontSize: 18 }}
    />
  );
};

const SolutionShown = () => {
  return (
    <PriorityHighRoundedIcon
      style={{ margin: "13px -5px 0 -3.5px", fontSize: "15px" }}
    />
  );
};

const HintUsed = () => {
  return (
    <p
      style={{
        color: "orange",
        fontWeight: 600,
        margin: "12px 0px 0 1.5px",
        fontSize: "14px",
      }}
    >
      ?
    </p>
  );
};

const FeedBack = (props) => {
  return (
    <p style={{ fontWeight: 500, margin: "13px 0px 0 7px", fontSize: "small" }}>
      {props.children}
    </p>
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
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        marginLeft: ".5em",
        marginRight: "2em",
      }}
    >
      {attemptChars.map((char) => setIcon(char))}
    </div>
  );
};

export const IconExplanation = (
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
      <p style={{ marginLeft: ".5em" }}>{strings.askedForSolutionInExercise}</p>
    </div>
    <div style={{ display: "flex", flexDirection: "row" }}>
      <p style={{ fontWeight: 500, marginRight: ".6em" }}>
        {strings.studentExerciseFeedback}
      </p>
      <p> {strings.exerciseFeedbackFromStudent}</p>
    </div>
    <div style={{ display: "flex", flexDirection: "row" }}>
      <p style={{ marginRight: ".4em", fontWeight: 500 }}>
        {strings.recogniseOrMultipleChoice}
      </p>
      <p> {strings.typeOfExerciseIconExplanation}</p>
    </div>
  </div>
);
