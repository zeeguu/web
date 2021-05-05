import React from "react";
import { StyledButton } from "./TeacherButtons.sc";

export default function SelectButton({
  keyID,
  value,
  btnText,
  isChosen,
  handleChange,
}) {
  return (
    <>
      {isChosen ? (
        <StyledButton
          key={keyID}
          choiceSelected
          onClick={() => {
            handleChange(value);
          }}
        >
          {btnText}
        </StyledButton>
      ) : (
        <StyledButton
          key={keyID}
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
