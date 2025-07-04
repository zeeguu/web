import styled from "styled-components";
import Heading from "../modal_shared/Heading.sc.js";
import { Value } from "../progress_tracking/ProgressItems.sc.js";


export const IconAndIntegerRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5em;
    padding-top: 1em;
`;

export const ValueModal = styled(Value)`
    font-size: 1.8em;
    text-align: center;
`;

export const TextRow = styled.div`
  padding-top: 1em;
  padding-bottom: 1em;
  text-align: center;
  width: 100%;
  justify-content: center;
  align-items: center;
  max-width: 80%; 

      @media (max-width: 768px) {
    font-size: 0.9em;
  } 
`;

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 90%;
  padding: 1em;
`;

export const CenteredHeading = styled(Heading)`
text-align: center;
`;

export const TextRowAsteriks = styled(TextRow)`
  font-style: italic;
  font-size: 0.7em;
  

`;
