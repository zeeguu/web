import styled from "styled-components";
import { darkGrey } from "./colors";

export const ErrorDialogWrapper = styled.div`
  text-align: center;
  padding: 4em 2em;
`;

export const ErrorDialogDescription = styled.p`
  color: ${darkGrey};
  font-size: 0.9em;
  word-break: break-all;
`;

export const ErrorDialogButton = styled.button`
  margin-top: 1em;
  padding: 0.5em 1.5em;
  font-size: 1em;
  cursor: pointer;
`;
