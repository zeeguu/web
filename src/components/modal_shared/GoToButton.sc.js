import { zeeguuDarkOrange } from "../colors";
import { OrangeRoundButton } from "../allButtons.sc";
import styled from "styled-components";

//redesigned button for a better focal point and improved
//readability of the text inside it.
//TODO: After implementing all the onboarding steps,
//create style guide for all buttons and refactor / factor them out
const GoToButton = styled(OrangeRoundButton)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 0.25rem;
  padding: 0.7em 2em;
  border-radius: 4em;
  font-weight: 600;
  box-shadow: 0px 0.2em ${zeeguuDarkOrange};
  transition: all ease-in 0.08s;
  overflow: hidden;
  white-space: nowrap;
  margin-bottom: 0.2em;

  &:active {
    box-shadow: none;
    transform: translateY(0.2em);
    transition: all ease-in 0.08s;
  }
`;

export { GoToButton };
