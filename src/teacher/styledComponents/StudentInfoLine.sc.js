import styled, { css } from "styled-components";
import { darkBlue, darkGrey, veryLightGrey } from "../../components/colors";

export const StudentInfoLine = styled.div`
  .wrapper {
    margin-bottom: 2em;
    display: flex;
    justify-content: space-between;
    width: 80%;
    min-height: 10vh;
    margin: 3vh 0 3.2vh 3vw;
  }

  .sideline {
    height: 5em;
    padding-left: 2em;
    display: flex;
    flex-direction: row;
  }

  .sideline-header {
    display: flex;
    flex-direction: row;
  }

  .text-box {
    margin: 1.5em 1.5em 1.5em 1em;
    color: black !important;
    width: 300px;
  }

  .student-name-header {
    font-size: medium;
    margin-left: 3em;
  }

  .activity-count {
    font-size: small;
  }

  .progress-bar-wrapper {
    width: 200px;
    margin: 0 2em 0 0;
    line-height: 1.4em;
    padding-top: 1.5em;
  }

  .title-circle-wrapper {
    width: 100px;
  }

  .number-display-wrapper {
    display: flex;
    justify-content: space-between;
    width: 300px;
    margin-top: 2em;
  }

  .number-display {
    line-height: 4em;
    display: flex;
    height: 3.8em;
    width: 2.8em;
    background-color: ${veryLightGrey};
    color: black;
    border-radius: 30px;
    padding: 0 0.55em;
    margin-left: 1.2em;
    margin-top: 2em;
    font-weight: 400;
    text-align: center;
    justify-content: center;
  }

  .delete-student-button {
    margin-top: 15px;
    margin-left: 10px;
  }

  .number-display-header {
    display: flex;
    text-align: center;
  }

  .head-title {
    font-family: "Montserrat";
    font-size: small;
    font-weight: 300;
    color: black;
    text-align: center;
  }

  .head-title#student {
    text-align: left;
    margin-left: 2.2vw;
  }

  .head-title#reading-exercise-time {
    margin: 9px 0 11px 0;
  }

  .head-title#length-level-correctness {
    margin: 18px 0 11px 0;
  }

  .name-activity-wrapper {
    margin-left: 2em;
  }

  .left-line {
    display: flex;
    flex-direction: column;
    border-left: solid 3px ${darkBlue};
    height: 100px;
    padding: 1vh 0 0 0;
  }
  .student-name {
    font-size: 20px;
    font-weight: 400;
    margin-bottom: 0.3em;
  }

  .student-email {
    color: ${darkGrey};
    font-size: 16px;
    font-weight: 400;
    margin-bottom: 0.2em;
  }

  .activity-count {
    font-size: 16px;
    font-weight: 400;
    margin-bottom: 0.2em;
  }

  ${(props) =>
    props.isFirst &&
    css`
      .wrapper {
        padding-top: 5em;
        padding-bottom: 0;
        margin-bottom: 0;
      }

      .progress-bar-wrapper {
        margin-top: -3.5em;
      }

      .number-display {
        margin-top: 3.5em;
      }

      .number-display-wrapper {
        margin-top: -3.4em;
      }

      .text-box {
        margin-top: -2em;
      }
      .name-activity-wrapper {
        margin-top: 0;
      }
    `}
`;
