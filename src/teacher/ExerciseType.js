import React from "react";
import strings from "../i18n/definitions";

const ExerciseType = ({ source }) => {
  switch (source) {
    case "Match_three_L1W_to_three_L2W":
      return (
        <p style={{ color: "#808080", margin: "1em 0 0 .5em" }}>
          {strings.matchThreePairs}
        </p>
      );
      case "Select_L2W_fitting_L2T":
        return (
          <p style={{ color: "#808080", margin: "1em 0 0 .5em" }}>
          {strings.pickTheWord}
        </p>
      );
      case "Recognize_L1W_in_L2T":
        return (
          <p style={{ color: "#808080", margin: "1em 0 0 .5em" }}>
          {strings.typeTheWord}
        </p>
      );
      //TODO the MULTIPLE_CHOICE case can be deleted when the logging in exercises has been changed.
      case "MULTIPLE_CHOICE":
        return (
        <p style={{ color: "#808080", margin: "1em 0 0 .5em" }}>
          {strings.pickTheWord}
        </p>
      );
    case "LEARNED":
      return (
        <p style={{ color: "#808080", margin: "1em .5em 0 .5em" }}>
          {strings.learnedOn}
        </p>
      );
    case "FEEDBACK":
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            color: "#808080",
            margin: "1em .5em 0 .5em",
          }}
        >
          <p style={{ marginTop: 0 }}>{strings.studentFeedback}</p>
          <p style={{ fontWeight: 500, color: "black", margin: "0 3px" }}>
            {strings.tooEasy}
          </p>
        </div>
      );
    default:
      //this case will tell us if something is wrong...
      return (
        <p style={{ color: "#808080", margin: "1em 0 0 .5em" }}>
          {strings.noType}
        </p>
      );
  }
};
export default ExerciseType;
