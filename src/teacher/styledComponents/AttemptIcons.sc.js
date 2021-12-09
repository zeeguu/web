import styled from "styled-components";
import { alertGreen, zeeguuOrange, errorRed } from "../../components/colors";

export const StyledAttemptIcons = styled.div`
  .correct-attempt-icon {
    color: ${alertGreen};
    font-size: 18px;
  }

  .wrong-attempt-icon {
    color: ${errorRed};
    margin: 0 -3px;
    font-size: 18px;
  }

  .solution-shown-icon {
    margin: 0 -3px;
    font-size: 15px;
  }

  .used-attempt-icon {
    display: flex;
    flex-direction: row;
  }

  .hint-used-icon {
    color: ${zeeguuOrange};
    font-weight: 600;
    margin: 0 2px;
    font-size: 14px;
  }

  .student-feedback {
    font-weight: 500;
    font-size: small;
  }

  .icon-explained-row {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .wrong-attempt-string {
    margin-left: 1em;
  }

  .correct-attempt-string {
    margin-left: 0.5em;
  }

  .hint-used-string {
    margin-left: 0.5em;
  }

  .solution-shown-string {
    margin-left: 0.5em;
  }

  .student-feedback-string {
    font-weight: 500;
    margin-right: 0.6em;
  }

  .exercise-type-string {
    margin-right: 0.4em;
    font-weight: 500;
  }

  .asterix-explanation-string {
    margin-right: 0.4em;
    font-weight: 500;
  }
`;
