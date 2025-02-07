import styled from "styled-components";

const StyledFieldset = styled.fieldset`
  all: unset;
  box-sizing: border-box;
  overflow-y: scroll;
  max-height: 500px;
`;

const StyledLegend = styled.legend`
  margin: 0 0 0.5rem 0;
`;

const StyledDiv = styled.div`
  margin: 0.5rem 0;
`;

const StyledInput = styled.input`
  appearance: none;
  position: absolute;
  opacity: 0;
`;

const StyledLabel = styled.label`
  box-sizing: border-box;
  cursor: pointer;
  padding: 0.5rem;
  border: 2px solid transparent;
  display: inline-block;
  width: 100%;
  transition: all 300ms ease-in-out;
  user-select: none;
  font-weight: bold;
  border-radius: 0.3rem;
  border: solid 0.1rem transparent;

  &:hover {
    border-color: #007bff;
  }

  ${StyledInput}:checked + & {
    border-color: #007bff;
  }
`;

export { StyledFieldset, StyledLegend, StyledDiv, StyledInput, StyledLabel };
