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
`;
