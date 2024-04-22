import styled from "styled-components";
import {
  lightGrey,
  veryDarkGrey,
  darkGrey,
  zeeguuOrange,
  zeeguuRed,
} from "../../components/colors";

const InputFieldWrapper = styled.div`
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
const Input = styled.input`
  font-size: 0.9rem;
  height: 2.5rem;
  padding: 0 1rem;
  margin: 0;
  border: 1.5px solid ${lightGrey};
  border-radius: 0.3rem;
  &.error {
    border: 1.5px solid ${zeeguuRed};
  }
`;
const Label = styled.label`
  padding: 0;
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
`;

const HelperText = styled.div`
  margin: 0.1rem 0 0 0;
  line-height: 1.2;
  display: flex;
  gap: 0.2rem;
  align-items: flex-start;
  font-size: 0.8rem;
  font-weight: 500;
  color: ${veryDarkGrey};
  &.error {
    color: ${zeeguuRed};
  }

  a {
    font-weight: 600;
  }
`;

export { Input, Label, HelperText, InputFieldWrapper };
