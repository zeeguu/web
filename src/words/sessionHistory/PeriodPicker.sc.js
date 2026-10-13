import styled from "styled-components";

export const PeriodPicker = styled.div`
  margin-bottom: 1em;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5em;

  select,
  input[type="date"] {
    padding: 0.4em 0.6em;
    border-radius: 4px;
    border: 1px solid var(--input-border);
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 0.95em;
  }
`;

export const CustomDates = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5em;
  color: var(--text-secondary);
`;
