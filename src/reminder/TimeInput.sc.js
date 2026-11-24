import styled from "styled-components";

// The reminder time, on the Notifications page and in the reminder offer.
const TimeInput = styled.input`
  font: inherit;
  color: var(--text-primary);
  background: var(--input-bg);
  border: 1px solid var(--input-border);
  border-radius: 0.5rem;
  padding: 0.3rem 0.5rem;

  &:disabled {
    opacity: 0.5;
  }
`;

export default TimeInput;
