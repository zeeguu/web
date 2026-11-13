import styled from "styled-components";
import { zeeguuOrange } from "../../../components/colors";

export const Reminder = styled.section`
  width: 100%;
  margin-top: 2rem;
  text-align: left;
`;

export const ReminderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;

  input[type="checkbox"] {
    width: 1.2rem;
    height: 1.2rem;
    margin: 0;
    accent-color: ${zeeguuOrange};
  }
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
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0.5rem 0 0;
`;
