import styled from "styled-components";
import { blue100, blue700, blue900, lightGrey, veryLightGrey } from "../colors";

const StyledFieldset = styled.fieldset`
  all: unset;
  box-sizing: border-box;
  overflow-y: scroll;
  overflow-x: hidden;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 0.5rem;
  padding: 1rem 0 0 0;
  max-height: 24rem;
`;

const StyledLegend = styled.legend`
  margin: 0 0 0.5rem 0;
`;

const StyledInput = styled.input`
  appearance: none;
  position: absolute;
  opacity: 0;
`;

const StyledLabel = styled.label`
  cursor: pointer;
  color: black;
  margin: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.6rem 1.2rem;
  border-radius: 2rem;
  border: solid 0.1rem ${lightGrey};
  box-shadow: 0px 0.1rem ${lightGrey};
  white-space: nowrap;
  transition: all 300ms ease-in-out;
  margin-bottom: 0.2rem;

  &:hover {
    background-color: ${veryLightGrey};
  }

  ${StyledInput}:checked + &:hover {
    background-color: ${blue100};
  }

  ${StyledInput}:checked + & {
    background-color: ${blue100};
    border-color: ${blue700};
    box-shadow: 0px 0.1rem ${blue700};
    color: ${blue900};
  }

  //more about :is() https://developer.mozilla.org/en-US/docs/Web/CSS/:is
  &:is(:active, ${StyledInput}:checked + &:active) {
    box-shadow: none;
    transform: translateY(0.1em);
    transition: all ease-in 0.08s;
  }
`;

export { StyledFieldset, StyledLegend, StyledInput, StyledLabel };
