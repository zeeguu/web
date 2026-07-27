import styled from "styled-components";

export const TextSizeRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.6rem;
`;

export const TextSizeControls = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const FontSizeButton = styled.button`
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 0.2rem 0.5rem;
  cursor: pointer;
  font-size: 0.9em;
`;

export const FontSizeValue = styled.span`
  font-size: 0.85em;
  color: var(--text-secondary);
  min-width: 2.2em;
  text-align: center;
`;
