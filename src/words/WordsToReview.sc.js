import styled from "styled-components";
import { zeeguuOrange } from "../components/colors";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

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
  gap: 0.3em;
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

const InfoIcon = styled(HelpOutlineIcon)`
  cursor: pointer;
  flex-shrink: 0;
  margin-top: -0.7em;
  font-size: 24px;
  color: var(--info-icon-color);
  border-radius: 50%;
  width: 32px;
  height: 32px;
`;

const SectionHeading = styled.h3`
  display: flex;
  align-items: flex-start;
  gap: 0.3rem;
  margin: 0;
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
`;

export { EditWordsToExerciseButton, WordsSection, WordsListColumn, InfoBoxColumn, InfoIcon, SectionHeading };
