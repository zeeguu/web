import styled from "styled-components";

export const WordAttempts = styled.div`
  margin: 0 0 1em 3.5em;
  font-size: 0.85em;
  color: var(--text-secondary);
`;

export const Attempt = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6em;

  .date {
    min-width: 4.5em;
  }
`;
