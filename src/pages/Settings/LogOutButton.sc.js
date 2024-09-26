import { zeeguuDarkOrange } from "../../components/colors";
import { WhiteRoundButton } from "../../components/allButtons.sc";
import styled from "styled-components";

const LogOutButtonStyle = styled(WhiteRoundButton)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;
  padding: 0.7em 2em;
  border-radius: 4em;
  font-weight: 600;
  box-shadow: 0 0.2em ${zeeguuDarkOrange};
  transition: all ease-in 0.08s;
  overflow: hidden;
  white-space: nowrap;
  margin-bottom: 1rem;
  margin-top: 2rem;
  cursor: pointer;

  &:active {
    box-shadow: none;
    transform: translateY(0.2em);
    transition: all ease-in 0.08s;
  }
`;

export { LogOutButtonStyle };
