import { zeeguuDarkOrange, zeeguuRed } from "../colors";
import { OrangeRoundButton } from "../allButtons.sc";
import styled from "styled-components";

// TODO: Merge with Save button from Preferences
const GoToButton = styled(OrangeRoundButton)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 0.25rem;
  padding: 0.7em 2em;
  border-radius: 4em;
  font-weight: 600;
  box-shadow: 0 0.2em ${zeeguuDarkOrange};
  transition: all ease-in 0.08s;
  overflow: hidden;
  white-space: nowrap;
  margin-bottom: 0.2em;

  &.warning {
    background-color: red;
    box-shadow: 0 0.2em ${zeeguuRed};
  }

  &:active {
    box-shadow: none;
    transform: translateY(0.2em);
    transition: all ease-in 0.08s;
  }
`;

export { GoToButton };
