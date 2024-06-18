import { zeeguuRed } from "../colors";
import { OrangeRoundButton } from "../allButtons.sc";
import styled from "styled-components";

const WarningButton = styled(OrangeRoundButton)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 0.25rem;
  padding: 0.7em 2em;
  border-radius: 4em;
  font-weight: 600;
  background-color: red;
  border-bottom: solid 0.2em ${zeeguuRed};
`;

export { WarningButton };
