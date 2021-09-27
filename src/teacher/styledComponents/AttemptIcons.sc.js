import styled from "styled-components";

export const StyledAttemptIcons = styled.div`
  .correct-attempt-icon {
    color: green;
    margin: 12px -3px 0 -2px;
    font-size: 18px;
  }

  .wrong-attempt-icon {
    color: red;
    margin: 12px -3px 0 -2px;
    font-size: 18px;
  }

  .solution-shown-icon {
    margin: 13px -5px 0 -3.5px;
    font-size: 15px;
  }

  .used-attempt-icon {
    display: flex;
    flex-direction: row;
    margin-left: 0.5em;
    margin-right: 2em;
  }

  .hint-used-icon {
    color: orange;
    font-weight: 600;
    margin: 12px 0px 0 1.5px;
    font-size: 14px;
  }

  .student-feedback {
    font-weight: 500;
    margin: 13px 0px 0 7px;
    font-size: small;
  }

  .icon-explained-row {
    display: flex;
    flex-direction: row;
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
