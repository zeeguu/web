import styled from "styled-components";
import { darkGrey, veryDarkGrey } from "../../components/colors";

export const NavigationContainer = styled.div`
  margin-top: 0.5em;
  font-size: 0.7em;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ArrowsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.2em;
`;

export const ArrowButton = styled.button`
  background: none;
  border: none;
  padding: 0.4em;
  cursor: pointer;
  color: ${darkGrey};
  display: flex;
  align-items: center;
  font-size: 1.6em;
  min-width: 2em;
  min-height: 2em;
  justify-content: center;

  &:hover:not(:disabled) {
    color: ${veryDarkGrey};
  }

  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
`;

export const ContextIndicator = styled.span`
  color: ${darkGrey};
  font-size: 0.9em;
  min-width: 2em;
  text-align: center;
`;
