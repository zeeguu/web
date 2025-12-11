import styled, { css } from "styled-components";
import { darkBlue } from "../../components/colors";

export const ReadingInsightAccordionItem = styled.div`
  .accordion-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 13vh;
    margin: 3vh 0 3.2vh 0;
    font-family: "Montserrat";
  }

  .content-wrapper {
    display: flex;
    justify-content: space-between;
    margin: 0 5.5vw 0 5.5vw;
  }

  ${(props) =>
    props.isFirst &&
    css`
      .data-circle-wrapper {
        margin-top: 5vh;
      }
      .content-wrapper {
        padding-bottom: 0.6vh;
      }
      .left-line {
        border-left: solid 3px ${darkBlue};
        min-height: 88px !important;
      }
    `}

  .date-title-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100px;
  }

  .date {
    display: flex;
    color: ${darkBlue};
    margin: 0 0 0.5vh 2vw;
  }

  .article-title {
    font-weight: 400;
    margin-left: 2vw;
    text-align: left;
    max-width: 100vw;
    min-width: 32vw;
    padding-top: 0.2vw;
    font-family: "Montserrat";
  }

  button {
    border: None;
    background-color: white;
    align-content: center;
    font-family: "Montserrat";
  }

  button:hover {
    cursor: pointer;
  }

  .data-circle-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }

  .panel {
    margin: 2vh auto 7vh auto;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.08);
    border-radius: 10px;
    padding: 1em;
    width: 70vw;
  }

  .panel-headline {
    color: ${darkBlue};
    padding-left: 1.5em;
  }

  .panel-no-words {
    text-align: center;
  }

  .article-title {
    font-weight: 400;
    margin: 0 0 1.5vh 2vw;
    text-align: left;
    max-width: 100vw;
    min-width: 32vw;
  }

  .date-title-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100px;
    margin-top: 1.1vh;
  }

  .left-line {
    display: flex;
    flex-direction: column;
    border-left: solid 3px ${darkBlue};
    min-height: 9vh;
    padding: 1.5vh 0 0 0;
  }

  .line {
    display: flex;
    flex-direction: row;
  }

  .date {
    display: flex;
    color: ${darkBlue};
    margin-bottom: 2vw;
    font-family: "Montserrat";
  }

  .head-title {
    padding-top: 2vh;
    margin-left: 2vw;
    text-align: left;
    font-size: small;
    font-family: "Montserrat";
    color: black !important;
  }
`;
