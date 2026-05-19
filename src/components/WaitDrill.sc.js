import styled from "styled-components";

export const DrillBox = styled.div`
  position: relative;
  margin: 0.5rem 0;
  padding: 1rem 1.25rem;
  min-width: 16rem;
  max-width: 22rem;
  text-align: center;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 1rem;
  line-height: 1.6;
  color: ${({ $isDark }) => ($isDark ? "#f0f0f0" : "#222")};
  border: 1px solid ${({ $isDark }) => ($isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.2)")};
  border-radius: 0.25rem;
  cursor: ${({ $interactive }) => ($interactive ? "pointer" : "default")};
  user-select: none;
`;

export const DrillHint = styled.div`
  font-size: 0.75em;
  opacity: 0.5;
  margin-top: 0.5rem;
`;

export const DrillAnswer = styled.span`
  opacity: ${({ $revealed }) => ($revealed ? 1 : 0.35)};
`;

export const DrillDismiss = styled.button`
  position: absolute;
  top: 0.25rem;
  right: 0.5rem;
  background: transparent;
  border: 0;
  color: inherit;
  opacity: 0.4;
  cursor: pointer;
  font-size: 1.1em;
  line-height: 1;
  padding: 0.25rem 0.4rem;
  &:hover { opacity: 0.85; }
`;

export const DrillModeLink = styled.button`
  margin-top: 0.5rem;
  background: transparent;
  border: 0;
  color: inherit;
  opacity: 0.55;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.8em;
  text-decoration: underline;
  text-underline-offset: 0.2em;
  &:hover { opacity: 0.9; }
`;

export const DrillHistoryList = styled.div`
  margin: 0.5rem 0 0;
  min-width: 16rem;
  max-width: 22rem;
  text-align: center;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.85em;
  line-height: 1.5;
`;

export const DrillHistoryItem = styled.div`
  opacity: ${({ $age }) => Math.max(0.18, 0.7 - $age * 0.12)};
`;
