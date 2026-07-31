import styled, { keyframes } from "styled-components";
import { StyledButton } from "../styledComponents/TeacherButtons.sc";

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
`;

export const Bar = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin: 1rem 0;
  padding: 0.75rem 1rem;
  background-color: #fff8ef;
  border: 1px solid #ffcf99;
  border-radius: 5px;

  .label {
    font-weight: bold;
    white-space: nowrap;
  }

  .sep {
    color: #b45309;
    font-size: 0.9em;
    margin-left: 0.25rem;
  }

  .hint {
    font-size: 0.85em;
    color: #666;
    font-style: italic;
  }
`;

// A CEFR-level button. Dimmed while another level is generating (unclickable);
// $barDisabled drives the cursor so the whole bar reads as inert mid-rewrite.
export const LevelButton = styled(StyledButton)`
  min-width: 3.5rem;
  font-family: monospace;
  font-weight: bold;
  opacity: ${(p) => (p.$dimmed ? 0.4 : 1)};
  cursor: ${(p) => (p.$barDisabled ? "not-allowed" : "pointer")};
`;

// Solid = a level already generated (instant switch).
export const GreenDot = styled.span`
  color: #16a34a;
  margin-left: 0.25rem;
`;

// Blinking = the level generating right now.
export const BlinkingGreenDot = styled(GreenDot)`
  animation: ${blink} 1s ease-in-out infinite;
`;
