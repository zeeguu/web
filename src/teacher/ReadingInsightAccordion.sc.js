import styled from "styled-components";
import "@reach/accordion/styles.css";
import { darkBlue, lightOrange } from "../components/colors";

export const ReadingInsightAccordion = styled.div`
  .accordion-wrapper {
    display: flex;
    height: 13vh;
    margin-bottom: 3vh;
    border-left: solid 3px ${darkBlue};
    width: 100%;
  }

  .content-wrapper {
    display: flex;
    margin-left: 1vw;
  }

  .article-title {
    font-weight: 400;
  }

  button {
    margin-left: -2em;
    border: None;
    background-color: white;
    align-content: center;
  }

  .panel {
    min-width: 300px;
    max-width: 90%;
    margin-left: 2%;
    margin-top: 1vh;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.08);
    border-radius: 10px;
    padding: 1em;
  }
  .panel-headline{
    color: ${darkBlue};
  }

  .panel-no-words{
    text-align: center;
  }
`;
