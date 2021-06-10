import styled from "styled-components";
import { darkBlue, lightGrey, darkGrey } from "../components/colors";
import "@reach/listbox/styles.css";

export const StudentInfoLine = styled.div`
  .wrapper {
    margin: 0 0 2em 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  .wrapper#header {
    margin: 2em 0 0 0;
  }

  .sideline {
    height: 5em;
    border-left: 3px solid ${darkBlue};
    display: flex;
    flex-direction: row;
  }
  .sideline-header {
    display: flex;
    flex-direction: row;
  }

  .text-box {
    margin: 0.5em;
    color: black !important;
    width: 300px;
  }
  .text-box#header {
    margin: 0;
  }

  .student-name {
    font-size: large;
  }
  .student-name-header {
    font-size: medium;
    margin-left: 3em;
  }

  .student-email {
    color: ${darkGrey};
    font-size: small;
  }

  .activity-count {
    font-size: small;
  }

  .progress-bar {
    width: 300px;
    margin: 0 2em;
    line-height: 1.4em;
    padding-top: 1.5em;
  }
  .progress-bar#header {
    line-height: 1;
    padding-left: 2em;
    width: 285px;
  }

  .number-display-wrapper {
    display: flex;
    justify-content: space-between;
    width: 320px;
  }
  .number-display-wrapper#header {
    width: 345px;
    padding-right: 3.5em;
  }

  .number-display {
    line-height: 4em;
    display: flex;
    height: 4em;
    width: 2.8em;
    background-color: #e5e5e5;
    color: black;
    border-radius: 30px;
    text-align: center;
    padding-left: 1.1em;
  }
  .number-display-header {
    display: flex;
    text-align: center;
  }

  .head-title {
    font-family: "Montserrat";
    font-size: large;
    color: black;
  }
`;
