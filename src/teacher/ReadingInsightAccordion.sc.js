import styled from "styled-components";
import "@reach/accordion/styles.css";
import { darkBlue } from "../components/colors";

export const ReadingInsightAccordion = styled.div`
  .accordion-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 13vh;
    margin-top: 3vh;
  }

  .content-wrapper {
    border-left: solid 3px ${darkBlue};
    display: flex;
    justify-content: space-between;
  }

  .date-title-wrapper{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100px;
  }

  .date{
    display:flex;
    color: ${darkBlue};
    margin:0 0 .5vh 2vw;
  }

  .article-title {
    font-weight: 400;
    margin-left: 2vw;
    text-align: left;
    max-width: 100vw;
    min-width: 32vw;
  }

  button {
    border: None;
    background-color: white;
    align-content: center;
  }
  button:hover {
    cursor: pointer;
  }
  .data-circle-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-left: 10em;
  }

  .panel {
    margin-left:2.5em;
    margin-top: 1vh;
    margin-bottom: 7vh;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.08);
    border-radius: 10px;
    padding: 1em;
  }
  .panel-headline {
    color: ${darkBlue};
  }

  .panel-no-words {
    text-align: center;
  }
`;
