import styled, { css } from "styled-components";
import { lightGrey, veryDarkGrey, zeeguuOrange, zeeguuRed } from "./colors";

const FieldLabelContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  input:focus {
    outline: transparent;
    border: 1.5px solid ${zeeguuOrange};
    &.error {
      border: 1.5px solid ${zeeguuRed};
    }
  }
`;

const InputWrapper = styled.div`
  height: 2.5rem;
  gap: 0.5rem;
  align-items: center;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: stretch;
`;
const Input = styled.input`
  box-sizing: border-box;
  width: 100%;
  font-size: 0.9rem;
  height: 2.5rem;
  padding: 0 1rem;
  margin: 0;
  border: 1.5px solid ${lightGrey};
  border-radius: 0.3rem;
  &.error {
    border: 1.5px solid ${zeeguuRed};
  }

  input:focus {
    outline: transparent;
    border: 1.5px solid ${zeeguuOrange};
    &.error {
      border: 1.5px solid ${zeeguuRed};
    }
  }
`;
const Label = styled.label`
  padding: 0;
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
`;

const BaseHelperTextStyle = css`
  margin: 0.1rem 0 0 0;
  line-height: 1.2;
  display: flex;
  gap: 0.2rem;
  align-items: flex-start;
  font-size: 0.8rem;
  font-weight: 500;
  color: ${veryDarkGrey};

  a {
    font-weight: 600;
    text-decoration: underline;
  }
`;

const HelperText = styled.div`
  ${BaseHelperTextStyle}
`;

const ErrorMessage = styled.div`
  ${BaseHelperTextStyle}
  color: ${zeeguuRed};
`;

export {
  Input,
  Label,
  HelperText,
  ErrorMessage,
  FieldLabelContainer,
  InputWrapper,
};
