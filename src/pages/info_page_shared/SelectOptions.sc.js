import styled from "styled-components";
import {
  lightGrey,
  zeeguuOrange,
  darkGrey,
  gray,
} from "../../components/colors";

const SelectOptionsdWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  select:focus {
    outline: transparent;
    border: 1.5px solid ${zeeguuOrange};
  }
`;
const Select = styled.select`
  color: ${gray};
  font-family: inherit;
  font-size: 0.9rem;
  height: 2.7rem;
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

export { Select, Label, SelectOptionsdWrapper };
