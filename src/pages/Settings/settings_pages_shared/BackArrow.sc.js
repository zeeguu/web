import styled from "styled-components";
import { darkGrey, veryDarkGrey } from "../../../components/colors";

const BackArrow = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${darkGrey};
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  &:hover {
    color: ${veryDarkGrey};
  }
  &:active {
    color: ${veryDarkGrey};
  }
`;

export { BackArrow };
