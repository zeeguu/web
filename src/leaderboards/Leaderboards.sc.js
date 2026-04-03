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
  color: var(--text-primary);
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

export const PeriodContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 0.5em;
  gap: 0.1em;
`;

export const WeekLabel = styled.p`
  margin: 0;
  font-size: 1em;
  font-weight: 600;
  color: var(--text-primary);
  text-align: center;
`;

export const PeriodLabel = styled.p`
  margin: 0;
  font-size: 0.85em;
  color: var(--text-secondary);
  text-align: center;
`;

export const TabsWrapper = styled.div`
  display: inline-flex;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 1em;
  margin-bottom: 1em;
  width: 100%;
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
    overflow-x: auto;
    overflow-y: hidden;
  }
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
  flex: 1;

  background: ${({ $active }) => ($active ? "#ff9800" : "var(--active-bg)")};
  color: ${({ $active }) => ($active ? "var(--text-primary)" : "var(--text-secondary)")};
  font-weight: ${({ $active }) => ($active ? 500 : 400)};

  transition: background 0.2s;
  box-shadow: ${({ $active }) => ($active ? "0 4px 10px var(--shadow-color)" : "0 1px 2px var(--shadow-color)")};

  transform: ${({ $active }) => ($active ? "translateY(-1px)" : "none")};
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

export const TableHeadCell = styled.th`
  padding: 0.5em;
`;
