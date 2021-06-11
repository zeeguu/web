import styled, { css } from "styled-components";
import { darkBlue } from "../components/colors";
import "@reach/listbox/styles.css";

export const StudentInfoLine = styled.div`
  .wrapper {
    margin: 0 0 2em 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding-bottom: 50 em;
    min-height: 10vh;
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
    margin: 0.5em;
    color: black !important;
    width: 300px;
    margin-left: 1em;
   
  }

  .student-name {
    font-size: large;
  }

  .student-name-header {
    font-size: medium;
    margin-left: 3em;
  }

  .activity-count {
    font-size: small;
  }

  .progress-bar-wrapper{
    width: 300px;
    margin: 0 2em;
    line-height: 1.4em;
    padding-top: 1.5em;
  }

  .title-circle-wrapper{
    width:100px;
  }

  .number-display-wrapper {
    display: flex;
    justify-content: space-between;
    width: 350px;
    margin-top: 2em;
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
    padding-left: 1.1em;
    margin-left: 1.2em;
    margin-top: -1em;
  }

  .number-display-header {
    display: flex;
    text-align: center;
  }

  .head-title{
    font-family: "Montserrat";
    font-size: large;
    color: black;
    text-align: center;
  }

  .name-activity-wrapper{
  margin-left: 1em;
  }

  .left-line {
    display: flex;
    flex-direction: column;
    border-left: solid 3px ${darkBlue};
    height: 6vh;
    padding: 1vh 0 0 0;
  }

  ${(props) =>
    props.isFirst &&
    css`

     .wrapper {
      padding-top: 5em;
      padding-bottom: 1em;;
     }

     .progress-bar-wrapper{
       margin-top: -3.5em;
     }

     .number-display{
      margin-top: 1.5em;
     }

     .title-progress-bar-wrapper{
      margin-top: -50em;
     }

     .progress-bar{
       margin-top:1.5em;
     }

     .number-display-wrapper{
       margin-top: -3.4em;
     }

     .text-box{
       margin-top: -2em;
     }
    .name-activity-wrapper{
      margin-top: 0;
    }

  
    
    `}
`;
