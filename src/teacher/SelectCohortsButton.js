import React from "react";
import { StyledButton } from "./TeacherButtons.sc";

export default function SelectCohortsButton({ cohort, isChosen, handleChange }) {
  return (
    <>
      {isChosen && (
        <StyledButton
          key={cohort.id}
          choiceSelected
          onClick={() => {
            handleChange(cohort.name);
          }}
        >
          {cohort.name}
        </StyledButton>
      )}
      {!isChosen && (
        <StyledButton
          key={cohort.id}
          choiceNotSelected
          onClick={() => {
            handleChange(cohort.name);
          }}
        >
          {cohort.name}
        </StyledButton>
      )}
    </>
  );
}
