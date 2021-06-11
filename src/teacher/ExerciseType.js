import React from "react";

const ExerciseType = ({ source }) => {
  switch (source) {
    //TODO localize everything here. STRINGS!!!
    case "Match_three_L1W_to_three_L2W":
      return (
        <p style={{ color: "#808080", margin: "1em 0 0 .5em" }}>
          match 3 pairs
        </p>
      );
    case "Select_L2W_fitting_L2T":
      return (
        <p style={{ color: "#808080", margin: "1em 0 0 .5em" }}>
          pick the word
        </p>
      );
    case "Recognize_L1W_in_L2T":
      return (
        <p style={{ color: "#808080", margin: "1em 0 0 .5em" }}>find in text</p>
      );
    //TODO the MULTIPLE_CHOICE case can be deleted when the logging in exercises has been changed.
    case "MULTIPLE_CHOICE":
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
          <p style={{ marginTop: 0 }}>Student feedback:</p>
          <p style={{ fontWeight: 500, color: "black", margin: "0 3px" }}>
            too easy
          </p>
        </div>
      );
    default:
      //this case will tell us if something is wrong...
      return (
        <p style={{ color: "#808080", margin: "1em 0 0 .5em" }}>No type</p>
      );
  }
};
export default ExerciseType;
