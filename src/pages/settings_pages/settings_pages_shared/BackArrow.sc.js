import styled from "styled-components";
import { darkGrey, veryDarkGrey } from "../../../components/colors";

const BackArrow = styled.button`
  width: fit-content;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  gap: 0.25rem;
  color: ${darkGrey};
  background: inherit;
  border: inherit;
  font-family: inherit;
  font-size: inherit;
  font-weight: 600;
  &:hover {
    color: ${veryDarkGrey};
  }
  &:active {
    color: ${veryDarkGrey};
  }
`;

export { BackArrow };
