import React from "react";
import strings from "../../../i18n/definitions";
import { shortFormattedDate } from "../../sharedComponents/FormattedDate";
import * as s from "../../styledComponents/ExerciseType.sc";

const ExerciseType = ({ source, date}) => {
  switch (source) {
    case "Match_three_L1W_to_three_L2W":
      return (
        <s.StyledExerciseType>
          <p className="type-explanation">{strings.matchThreePairs}</p>
        </s.StyledExerciseType>
      );
    case "Select_L2W_fitting_L2T":
      return (
        <s.StyledExerciseType>
          <p className="type-explanation">{strings.pickTheWord}</p>
        </s.StyledExerciseType>
      );
    case "Recognize_L1W_in_L2T":
      return (
        <s.StyledExerciseType>
          <p className="type-explanation">{strings.typeTheWord}</p>
        </s.StyledExerciseType>
      );
    //TODO the MULTIPLE_CHOICE case can be deleted when the logging in exercises has been changed.
    case "MULTIPLE_CHOICE":
      return (
        <s.StyledExerciseType>
          <p className="type-explanation">{strings.pickTheWord}</p>
        </s.StyledExerciseType>
      );
    case "LEARNED":
      return (
        <s.StyledExerciseType>
          <p className="type-explanation">{strings.learnedOn} {shortFormattedDate(date)}</p>
        </s.StyledExerciseType>
      );
    case "FEEDBACK":
      return (
        <s.StyledExerciseType>
          <div className="feedback-container">
            <p className="type-explanation">{strings.studentFeedback}</p>
            <p className="feedback">{strings.tooEasy}</p>
          </div>
        </s.StyledExerciseType>
      );
    default:
      //this case will tell us if something is wrong...
      return (
        <s.StyledExerciseType>
          <p className="type-explanation">{strings.noType}</p>
        </s.StyledExerciseType>
      );
  }
};
export default ExerciseType;
