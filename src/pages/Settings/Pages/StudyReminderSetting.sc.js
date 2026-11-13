import styled from "styled-components";

export const ReminderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

export const TimeInput = styled.input`
  font: inherit;
  color: var(--text-primary);
  background: var(--input-bg);
  border: 1px solid var(--input-border);
  border-radius: 0.5rem;
  padding: 0.3rem 0.5rem;
  color-scheme: light dark;

  &:disabled {
    opacity: 0.5;
  }
`;

export const ReminderNote = styled.p`
  font-size: 0.9em;
  color: var(--text-secondary);
  margin: 0.25em 0 0 32px; /* under the label, as the email setting's note */
`;
