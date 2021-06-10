import React from "react";

const ExerciseType = ({ source }) => {
  switch (source) {
    //TODO localize everything here. STRINGS!!!
    case "MULTIPLE_CHOICE":
      return (
        <p style={{ color: "#808080", margin: "1em 0 0 .5em" }}>
          pick the word
        </p>
      );
    case "Match_three_L1W_to_three_L2W":
      return (
        <p style={{ color: "#808080", margin: "1em 0 0 .5em" }}>
          match 3 pairs
        </p>
      );
    case "LEARNED":
      return (
        <p style={{ color: "#808080", margin: "1em .5em 0 .5em" }}>
          Learned on:
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
          <p style={{ marginTop:0 }}>Student feedback:</p>
          <p style={{ fontWeight: 500, color: "black", margin:"0 3px" }}>too easy</p>
        </div>
      );
    default:
      return (
        <p style={{ color: "#808080", margin: "1em 0 0 .5em" }}>find in text</p>
      );
  }
};
export default ExerciseType;
