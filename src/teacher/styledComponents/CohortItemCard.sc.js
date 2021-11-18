import styled from "styled-components";
import { darkGrey } from "../../components/colors";

export const StyledCohortItemCard = styled.div`
  button {
    margin: 0.3em;
  }

  p {
    color: black;
    margin: 0;
  }

  .cohort-card {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.08);
    border-radius: 10px;
    text-align: left;
    display: flex;
    justify-content: space-between;
    width: 80%;
    padding-bottom: 1em;
    padding-left: 1.5em;
    margin-bottom: 1em;
    margin-left: 10%;
  }

  .cohort-info-column {
    display: flex;
    flex-direction: column;
    width: 50%;
    padding-right: 1em;
  }

  .light-font {
    color: ${darkGrey};
    font-weight: 400;
    margin-top: 1em;
  }

  .cohort-card-headline {
    color: black;
    font-size: xx-large;
    margin: 0;
  }

  .student-count-container {
    display: flex;
    color: black;
    margin: 0.2em 0;
  }

  .student-count {
    margin-right: 5px;
    margin-top: 2px;
  }

  #teacher-name {
    margin-top: 0;
    margin-left: 1em;
  }

  .button-column {
    display: flex;
    flex-direction: column;
    margin-top: 2.3em;
    margin-right: 2em;
  }

  .lower-buttons {
    display: flex;
    flex-direction: column;
    margin-top: 2em;
  }
`;
