import styled from "styled-components";
import { zeeguuWarmYellow, veryLightGrey, zeeguuOrange} from "../colors";


const ProgressOverviewItem = styled.div`
  min-width: 285px;
  max-width: 400px;    
  display: flex;
  align-items: center;
  background-color: var(--infobox-bg); 
  border-radius: 8px;
  padding: 1.1em 1.25em;
  min-height: 52px;
  cursor: pointer;
  &:hover {
    background-color: ${veryLightGrey};
  }

  @media (max-width: 768px) {
    width: 100%;
    max-width: 20em;
    min-height: 3em; 
  }
`;

const IconWithValueAndLabel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const IconAndValue = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3em;
`;

const Icon = styled.div`
  font-size: 2em;
  color: ${zeeguuOrange};
`;

const Value = styled.div`
  font-weight: bold;
  font-size: 1em;
`;

const Label = styled.div`
  font-size: 0.9em;
  letter-spacing: 0.04em;

  @media (max-width: 768px) {
    font-size: 0.8em;
  }
`;

const ProgressDescription = styled.div`
  display: flex;
  width: 60%;
  font-size: 0.9rem;
  align-items: center;
  text-align: left;
  margin-left: 2.9em;
  letter-spacing: 0.03em;

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    
  }
  
  @media (max-width: 375px) {
    font-size: 0.7rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
`;

const ProgressItemsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: start;
  padding: 1em;
  @media (max-width: 768px) {
    justify-content: center;
  }
  
  `;

  const ProgressOverviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 70%;
  padding-bottom: 1em;
  margin-left: 10em;

  @media (max-width: 768px) {
  width: 80%;
  margin-left: 1.5em;
  }
`;

const ProgressOverviewSection = styled.div`
  padding: 1em;
  display: flex;
  flex-wrap: wrap;
  gap: 2em;
  width: 100;
  justify-content: space-evenly;
`;

export {ProgressDescription, Label, Value, Icon, IconAndValue, IconWithValueAndLabel, ProgressOverviewItem, ProgressItemsContainer, ProgressOverviewContainer, ProgressOverviewSection};