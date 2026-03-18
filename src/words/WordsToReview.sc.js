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

const WordsSection = styled.div`
  display: grid;
  grid-template-columns: auto auto;

  width: fit-content;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    width: 100%;
  }
`;

const WordsListColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: fit-content;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const InfoBoxColumn = styled.div`
  display: flex;
  flex-direction: column;
  height: fit-content;
  order: -1;

  @media (min-width: 769px) {
    order: 0;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const InfoIcon = styled.img`
  width: 22px;
  height: 22px;
  cursor: pointer;
  flex-shrink: 0;
  margin-top: -0.7em;
`;

export { EditWordsToExerciseButton, WordsSection, WordsListColumn, InfoBoxColumn, InfoIcon };
//
