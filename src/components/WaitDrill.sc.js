import styled from "styled-components";

export const DrillBox = styled.div`
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
  cursor: pointer;
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
