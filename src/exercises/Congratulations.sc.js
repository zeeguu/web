import styled from "styled-components";
import { YellowMessageBox } from "../components/TopMessage.sc";
const CongratulationsContainer = styled.div`
  flex: 1;
  margin-left: 20%;
  margin-right: 5%;
  padding: 1px;
  margin-top: 2em;

  @media (max-width: 768px) {
    margin-left: 5%;
    margin-right: 5%;
    margin-top: 0;
  }

  & > ${YellowMessageBox} {
    margin: 2em 0;
    
    @media (max-width: 768px) {
      margin: 2em;
    }
  } 
  `;

const CenteredColumn = styled.div`
  justify-content: center;
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-top: 3em;
`;

const CenteredRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1em; 
  margin: 0.5em 0.5em;
  @media (max-width: 800px) {
    flex-direction: column;
  }
`;

const SummaryTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const WordList = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  margin-top: 1.5em;
  margin-bottom: 1.5em;
`;
const ExercisesFrom = styled.div`
  font-size: 0.9em;
  margin-top: -1.5em;
  margin-bottom: 1em;
  text-align: start;
`;
const GoodJobTitle = styled.h1`
  font-size: 2em;
  margin-bottom: 1em;
  width: 100%;
  text-align: start;

  @media (max-width: 768px) {
    font-size: 1.5em;
    text-align: center;
  }
`;

const ProgressionButtonsRow = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  gap: 1em;
  margin-bottom: 2em;

  & > button {
    min-width: 250px;
    margin: 0; 

  }

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

export {
  CenteredColumn,
  CenteredRow,
  SummaryTextWrapper,
  WordList,
  ExercisesFrom,
  CongratulationsContainer,
  GoodJobTitle,
  ProgressionButtonsRow,
};
