import styled from "styled-components";
import { WordChip } from "../SessionHistory.sc";

// A teacher's chip: the History chip as a button; the whole chip toggles the
// sentence the word was translated in.
export const WordToggle = styled(WordChip).attrs({ as: "button", type: "button" })`
  font: inherit;
  color: inherit;
  cursor: pointer;

  &[aria-expanded="true"] {
    border-color: var(--text-secondary);
  }
`;

export const Excerpt = styled.p`
  margin: 0.6em 0 0;
  padding: 0.5em 0.8em;
  border-left: 3px solid var(--border-color);
  font-size: 0.9em;
  line-height: 1.5;
  color: var(--text-secondary);

  mark {
    background: none;
    font-weight: 700;
    color: var(--text-primary);
  }
`;
