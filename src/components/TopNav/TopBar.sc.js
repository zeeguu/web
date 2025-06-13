import styled from "styled-components";
import { veryLightGrey} from "../colors";

export const StatContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  letter-spacing: 0.05em;
  width: 100%;
  padding-right: 1em;
  padding-top: 1em;

  @media (min-width: 768px) {
      gap: 0.5em;
    }

`;

export const StatNumber = styled.h2`
  font-weight: 500;
  font-size: 1em;
  line-height: 1em;
  letter-spacing: 0.10em;
  margin: 0;
  padding-bottom: 0.25em;
`;

export const ClickableStat = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.5em;
  border-radius: 5px;
  &:hover {
    background-color: ${veryLightGrey};
  }
`;