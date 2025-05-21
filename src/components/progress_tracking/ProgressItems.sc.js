import styled from "styled-components";
import { zeeguuWarmYellow} from "../colors";

const ProgressOverviewItem = styled.div`
  display: flex;
  background-color: white;
  border:2px solid ${zeeguuWarmYellow};
  border-radius: 4px;
  padding: 1.5em;
  width: 40%;
  max-width: 80em;
  height: 60px;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 20em;
    height: 3.5em; 
  }
`;

const IconWithValueAndLabel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 4.5em;
`;

const IconAndValue = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3em;
`;

const Icon = styled.div`
  font-size: 1em;
`;

const Value = styled.div`
  font-weight: bold;
  font-size: 0.8em;
`;

const Label = styled.div`
  font-size: 0.6em;
  margin-top: 0.2em;
`;

const ProgressDescription = styled.div`
  display: flex;
  width: 60%;
  font-size: 0.75rem;
  align-items: center;
  text-align: left;
  margin-left: 4em;
`;

export {ProgressDescription, Label, Value, Icon, IconAndValue, IconWithValueAndLabel, ProgressOverviewItem};