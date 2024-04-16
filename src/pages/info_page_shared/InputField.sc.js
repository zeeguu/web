import styled from "styled-components";
import { lightGrey, zeeguuOrange } from "../../components/colors";

const InputFieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  input:focus {
    outline: transparent;
    border: 1.5px solid ${zeeguuOrange};
  }
`;
const Input = styled.input`
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

export { Input, Label, InputFieldWrapper };
