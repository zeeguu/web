import Button from "./Button.sc";
import styled from "styled-components";
import {
  lightGrey,
  veryLightGrey,
  blue700,
  blue100,
  blue900,
} from "../../components/colors";

const SelectionButton = styled(Button)`
  background: None;
  cursor: pointer;
  color: black;
  margin: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  padding: 0 1.2rem;
  height: 2.75rem;
  border-radius: 2rem;
  border: solid 0.1rem ${lightGrey};
  box-shadow: 0px 0.1rem ${lightGrey};
  white-space: nowrap;
  transition: all 300ms ease-in-out;
  margin-bottom: 0.2rem;

  &:hover {
    background-color: ${veryLightGrey};
  }

  &.selected {
    background-color: ${blue100};
  }

  &.selected {
    background-color: ${blue100};
    border-color: ${blue700};
    box-shadow: 0px 0.1rem ${blue700};
    color: ${blue900};
  }

  &:active,
  .selected + &:active {
    box-shadow: none;
    transform: translateY(0.1em);
    transition: all ease-in 0.08s;
  }
`;

export default SelectionButton;
