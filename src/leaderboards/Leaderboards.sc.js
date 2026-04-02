import styled from "styled-components";
import { orange300 } from "../components/colors";

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



export const Container = styled.section`
width: 100%;
max-width: 760px;
`;

export const Header = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
flex-wrap: wrap;
gap: 0.5em;
`;

// export const PeriodLabel = styled.p`
//   margin: 0;
//   font-size: 0.9em;
//   color: ${({ $isDark }) => ($isDark ? "#c6c6c6" : "#555")};
//   text-align: center;
//   flex: 1;
// `;
export const PeriodLabel = styled.p`
  margin-left: 0.5em;
  font-size: 0.9em;
  color: ${({ $isDark }) => ($isDark ? "#c6c6c6" : "#555")};
`;

export const TabsWrapper = styled.div`
  display: inline-flex;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 1em;
  margin-bottom: 1em;
`;

export const TabButton = styled.button`
  display: flex;
  font-size: 1em;
  align-items: center;
  justify-content: center;
  gap: 0.35em;
  padding: 0.75em;
  border: none;
  cursor: pointer;

  background: ${({ $active }) => ($active ? orange300 : "var(--active-bg)")};
  color: ${({ $active }) => ($active ? "var(--text-primary)" : "var(--text-secondary)")};
  font-weight: ${({ $active }) => ($active ? 500 : 400)};

  transition: background 0.2s;
  box-shadow: ${({ $active }) => ($active ? "0 4px 10px rgba(0,0,0,0.25)" : "0 1px 2px rgba(0,0,0,0.1)")};

  transform: ${({ $active }) => ($active ? "translateY(-1px)" : "none")};
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHeadCell = styled.th`
  padding: 0.5em;
`;
