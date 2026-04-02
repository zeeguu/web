import styled from "styled-components";

export const PeriodNavButton = styled.button`
  padding: 0;
  border: none;
  background: transparent;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${({ $isDark }) => ($isDark ? "#f1f1f1" : "#222")};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.55 : 1)};
`;

export const PeriodNavSpacer = styled.div`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
`;

export const PeriodLabel = styled.p`
  margin: 0;
  font-size: 0.9em;
  color: ${({ $isDark }) => ($isDark ? "#c6c6c6" : "#555")};
  text-align: center;
  flex: 1;
`;
