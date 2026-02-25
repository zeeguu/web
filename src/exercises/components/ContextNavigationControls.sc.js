import styled from "styled-components";
import { darkGrey, zeeguuOrange } from "../../components/colors";

export const NavigationContainer = styled.div`
  margin-top: 0.5em;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ChangeExampleLink = styled.button`
  background: none;
  border: none;
  padding: 0.3em 0.6em;
  cursor: pointer;
  color: ${darkGrey};
  font-size: 0.85em;
  text-decoration: underline;
  text-underline-offset: 2px;

  &:hover:not(:disabled) {
    color: ${zeeguuOrange};
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;
