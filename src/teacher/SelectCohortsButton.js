import React from "react";
import { StyledButton } from "./TeacherButtons.sc";

export default function ({ cohort, isChosen, handleChange }) {
    console.log(cohort.name + " " + isChosen)
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
