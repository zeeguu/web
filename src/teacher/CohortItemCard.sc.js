import styled from "styled-components";
import { darkGrey } from "../components/colors";

export const StyledCohortItemCard = styled.div`
  .cohort-card {
    background-color: white;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.08);
    border-radius: 10px;
    text-align: left;
    display: flex;
    position: relative;
    flex-direction: column;
    padding-left: 1em;
    padding-bottom: 1em;
    margin-bottom: 1em;
  }
  .top-line-box {
    display: flex;
    justify-content: space-between;
    padding-right: 1em;
  }

  .cohort-card-icon-people {
    position: relative;
    top: -2px;
  }

  .student-count {
    color: black;
    display: flex;
    & > * {
      margin-left: 5px;
    }
  }
  .cohort-card-headline {
    color: black;
    font-size: xx-large;
    margin-top: -4px;
    height: 50px;
  }
  .font-light {
    color: ${darkGrey};
    font-weight: 400;
  }
  .bottom-box {
    display: flex;
    justify-content: space-between;
    padding-right: 1em;
  }
  .buttons-container {
    padding-top: 0.49em;

    /*  To put the buttons on top of each other:
      display:flex;
      flex-direction: column; */
  }
`;
