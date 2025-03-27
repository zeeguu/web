import styled from "styled-components";
import {
  alertGreen,
  zeeguuOrange,
  errorRed,
  zeeguuDarkOrange,
} from "../../components/colors";

export const StyledAttemptIcons = styled.div`
  margin: 0px 1px;
  .correct-attempt-icon {
    color: ${alertGreen};
    font-size: 15px;
    font-smooth: always;
  }

  .wrong-attempt-icon {
    color: ${errorRed};
    font-size: 15px;
    font-smooth: always;
  }

  .solution-shown-icon {
    color: ${zeeguuDarkOrange};
    font-size: 15px;
    font-smooth: always;
  }

  .used-attempt-icon {
    display: flex;
    flex-direction: row;
  }

  .hint-used-icon {
    color: ${zeeguuOrange};
    font-size: 15px;
    font-smooth: always;
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

  .info-attempt-string {
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
