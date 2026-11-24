import styled from "styled-components";

export { default as TimeInput } from "../../../reminder/TimeInput.sc";

export const ReminderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

export const ReminderNote = styled.p`
  font-size: 0.9em;
  color: var(--text-secondary);
  margin: 0.25em 0 0 32px; /* under the label, as the email setting's note */
`;
