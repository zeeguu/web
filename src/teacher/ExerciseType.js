import React from "react";
import strings from "../i18n/definitions";
import * as s from "./ExerciseType.sc";

const ExerciseType = ({ source }) => {
  switch (source) {
    case "Match_three_L1W_to_three_L2W":
      return (
        <s.StyledExerciseType>
          <p className="match-three-pairs-text">{strings.matchThreePairs}</p>
        </s.StyledExerciseType>
      );
    case "Select_L2W_fitting_L2T":
      return (
        <s.StyledExerciseType>
          <p className="pick-the-word-text">{strings.pickTheWord}</p>
        </s.StyledExerciseType>
      );
    case "Recognize_L1W_in_L2T":
      return (
        <s.StyledExerciseType>
          <p className="type-the-word-text">{strings.typeTheWord}</p>
        </s.StyledExerciseType>
      );
    //TODO the MULTIPLE_CHOICE case can be deleted when the logging in exercises has been changed.
    case "MULTIPLE_CHOICE":
      return (
        <s.StyledExerciseType>
          <p className="type-the-word-text">{strings.pickTheWord}</p>
        </s.StyledExerciseType>
      );
    case "LEARNED":
      return (
        <s.StyledExerciseType>
          <p className="learned-on-text">{strings.learnedOn}</p>
        </s.StyledExerciseType>
      );
    case "FEEDBACK":
      return (
        <s.StyledExerciseType>
          <div className="student-feedback-text-box">
            <p className="student-feedback-text">{strings.studentFeedback}</p>
            <p className="too-easy-feedback">{strings.tooEasy}</p>
          </div>
        </s.StyledExerciseType>
      );
    default:
      //this case will tell us if something is wrong...
      return (
        <s.StyledExerciseType>
          <p className="no-type-text">{strings.noType}</p>
        </s.StyledExerciseType>
      );
  }
};
export default ExerciseType;
