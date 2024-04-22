import styled from "styled-components";
import {
  lightGrey,
  veryDarkGrey,
  darkGrey,
  zeeguuOrange,
} from "../../components/colors";

const InputFieldWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  input:focus {
    outline: transparent;
    border: 1.5px solid ${zeeguuOrange};
  }
`;
const Input = styled.input`
  font-size: 0.9rem;
  height: 2.5rem;
  padding: 0 1rem;
  margin: 0;
  border: 1.5px solid ${lightGrey};
  border-radius: 0.3rem;
`;
const Label = styled.label`
  padding: 0;
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
`;

const HelperText = styled.div`
  font-size: 0.8rem;
  font-weight: 500;
  color: ${veryDarkGrey};

  .has-error{
    
  }

  a {
    font-weight: 600;
  }
`;

export { Input, Label, HelperText, InputFieldWrapper };
