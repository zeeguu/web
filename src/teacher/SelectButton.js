import React from "react";
import { StyledButton } from "./TeacherButtons.sc";

export default function SelectButton({ key, value, btnText, isChosen, handleChange }) {
  return (
    <>
      {isChosen && (
        <StyledButton
          key={key}
          choiceSelected
          onClick={() => {
            handleChange(value);
          }}
        >
          {btnText}
        </StyledButton>
      )}
      {!isChosen && (
        <StyledButton
          key={key}
          choiceNotSelected
          onClick={() => {
            handleChange(value);
          }}
        >
          {btnText}
        </StyledButton>
      )}
    </>
  );
}
