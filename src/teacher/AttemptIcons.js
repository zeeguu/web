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

const FeedbackGiven = (feedback) => {
  return (
    <p style={{ fontWeight: 500, margin: "13px 0px 0 2px", fontSize: "14px" }}>
      {feedback}
    </p>
  );
};

export const AttemptIcons = ({ attemptString, feedback }) => {
  const setIcon = (char) => {
    switch (char) {
      case "w":
        return <WrongAttempt key={char + uuid()} />;
      case "h":
        return <HintUsed key={char + uuid()} />;
      case "s":
        return <SolutionShown key={char + uuid()} />;

      default:
        return <CorrectAttempt key={char + uuid()} />;
    }
  };

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
      {FeedbackGiven(feedback)}
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
        Recognise/multiple choice etc.
      </p>
      <p> {strings.typeOfExerciseIconExplanation}</p>
    </div>
  </div>
);
