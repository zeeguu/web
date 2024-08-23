import styled from "styled-components";
import { lightGrey, zeeguuOrange, darkGrey } from "./colors";

const SelectWrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const SelectStyledContainer = styled.div`
  width: 100%;
  border-radius: 0.25em;
  cursor: pointer;
  background-color: #fff;
  display: grid;
  grid-template-areas: "select";
  align-items: center;

  &:after {
    box-sizing: border-box;
    content: "";
    width: 0.8em;
    height: 0.5em;
    background-color: ${darkGrey};
    clip-path: polygon(100% 0%, 0 0%, 50% 100%);
    pointer-events: none;
    grid-area: select;
    justify-self: end;
    margin: 0 1rem;
  }
`;

const Select = styled.select`
  box-sizing: border-box;
  height: 2.69rem;
  appearance: none;
  border: 1.5px solid ${lightGrey};
  border-radius: 0.3rem;
  background-color: transparent;
  padding: 0 2.25rem 0 1rem;
  margin: 0;
  width: 100%;
  font-family: inherit;
  font-size: 0.9rem;
  cursor: inherit;
  line-height: inherit;
  grid-area: select;

  &:focus {
    outline: transparent;
    border: 1.5px solid ${zeeguuOrange};
  }
`;
const Label = styled.label`
  padding: 0;
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
`;

export { Select, SelectStyledContainer, Label, SelectWrapper };
