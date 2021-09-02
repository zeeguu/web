import React, { Fragment } from "react";
import { StyledButton } from "../styledComponents/TeacherButtons.sc";

export default function SelectButton({
  value,
  btnText,
  isChosen,
  handleChange,
}) {
  return (
    <Fragment>
      {isChosen ? (
        <StyledButton
          choiceSelected
          onClick={() => {
            handleChange(value);
          }}
        >
          {btnText}
        </StyledButton>
      ) : (
        <StyledButton
          choiceNotSelected
          onClick={() => {
            handleChange(value);
          }}
        >
          {btnText}
        </StyledButton>
      )}
    </Fragment>
  );
}
