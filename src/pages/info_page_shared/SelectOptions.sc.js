import styled from "styled-components";
import {
  lightGrey,
  zeeguuOrange,
  darkGrey,
  gray,
} from "../../components/colors";

const SelectOptionsdWrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const SelectStyling = styled.div`
  box-sizing: border-box;
  width: 100%;
  border: 1.5px solid ${lightGrey};
  border-radius: 0.3rem;
  padding: 1rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  height: 2.7rem;

  &:focus {
    /* outline: transparent; */
    border: 1.5px solid ${zeeguuOrange};
  }

  &:after {
    box-sizing: border-box;
    content: "";
    width: 0.8em;
    height: 0.5em;
    background-color: ${darkGrey};
    clip-path: polygon(100% 0%, 0 0%, 50% 100%);
  }

  &:before {
    box-sizing: border-box;
  }
`;

const Select = styled.select`
  appearance: none;
  background-color: transparent;
  border: none;
  margin: 0;
  width: 100%;
  font-family: inherit;
  font-size: inherit;
  cursor: inherit;
  line-height: inherit;
  outline: none;
`;
const Label = styled.label`
  padding: 0;
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
`;

export { Select, SelectStyling, Label, SelectOptionsdWrapper };
