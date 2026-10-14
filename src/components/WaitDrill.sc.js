import styled from "styled-components";

// Colours via the CSS tokens (which follow `data-theme` on <html>), not a JS
// isDark flag: LoadingAnimation renders outside the ThemeContext provider, so
// the flag reads false on a dark screen.
export const DrillPair = styled.div`
  margin: 0.75rem 0;
  padding: 0.5rem 1rem;
  text-align: center;
  font-size: 1.4rem;
  line-height: 1.6;
  color: var(--text-primary);
  cursor: pointer;
  user-select: none;
`;

export const DrillAnswer = styled.span`
  color: ${({ $revealed }) => ($revealed ? "var(--text-primary)" : "var(--text-muted)")};
`;
