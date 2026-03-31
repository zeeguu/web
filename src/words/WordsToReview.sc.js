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
  font-size: 22px !important;
  color: var(--info-icon-color);
  border-radius: 50%;
`;

const SectionHeading = styled.h3`
  display: flex;
  align-items: flex-start;
  gap: 0.3rem;
  margin: 0;
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
`;

const ToggleContainer = styled.div`
  display: flex;
  width: 80%;
  flex-direction: row;
  align-items: left;
  gap: 0.5em;
  margin: 1em 0;
  background-color: var(--infobox-bg);
  border-radius: 2em;
  padding: 0.7em 2em;

  p {
    margin-top: 0.5em;
  }
  img {
    width: 60px;
    margin: 0.5em;
  }

  @media (max-width: 576px) {
    margin: 0.8em 0;
    flex-direction: column;
  }
`;
export {
  EditWordsToExerciseButton,
  WordsSection,
  WordsListColumn,
  InfoBoxColumn,
  InfoIcon,
  SectionHeading,
  ToggleContainer,
};
