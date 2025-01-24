import styled from "styled-components";
import { zeeguuOrange } from "../components/colors";

let EditWordsToExerciseButton = styled.button`
  color: black;
  height: auto;
  display: flex;
  padding: 1em;
  margin: 1em;
  border-style: solid;
  border-color: ${zeeguuOrange};
  border-width: 2px;
  border-radius: 10px;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  background: white;
  cursor: pointer;
  span {
    font-weight: 600;
    font-size: 1em;
    color: ${zeeguuOrange};
  }
  &:hover {
    filter: brightness(90%);
  }
`;

export { EditWordsToExerciseButton };
//
