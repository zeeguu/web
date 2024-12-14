import styled from "styled-components";
import { zeeguuDarkOrange, zeeguuOrange } from "../components/colors";

const CenteredColumn = styled.div`
  justify-content: center;
  display: flex;
`;

const CommitmentCircleDisplay = styled.div`
  @media screen and (max-width: 768) {
    font-size: 0.8 em;
    line-height: 4ex;
    text-align: left;
    color: ${zeeguuDarkOrange};
  }
`;

const CommitmentText = styled.text`
  line-height: 1.5em;
  color: white;
`;

const CommitmentCircle = styled.div`
  margin-top: 0.3em;
  display: flex;
  flex-direction: column;
  text-align: center;
  margin: auto;
  background-color: orange;
  border: 3px solid ${zeeguuOrange};
  border-radius: 30em;
  height: 200px;
  line-height: 0.8em;
  font-size: 1em;
  width: 200px;
  align-items: center;
  display: flex;
  justify-content: center;
`;

const ConclusionBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
`;
const ExerciseBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const WeekText = styled.text`
  font-weight: bold;
  color: white;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
`;
export {
  WeekText,
  ConclusionBox,
  ExerciseBox,
  CenteredColumn,
  CommitmentCircleDisplay,
  CommitmentCircle,
  CommitmentText,
};
