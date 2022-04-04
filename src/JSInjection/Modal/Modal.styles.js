import styled, { createGlobalStyle } from "styled-components";
import ReactModal from "react-modal";
import { zeeguuTransparentMediumOrange } from "../../zeeguu-react/src/components/colors";
export const GlobalStyle = createGlobalStyle`
   .reader-overlay{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgb(239, 239, 239) !important;
      }

    .feedback-overlay{
      position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      background-color: rgba(255,255,255,0.75) !important;
    }
`;

export const StyledModal = styled(ReactModal)`
  font-family: "Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI",
    "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
    "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  max-width: 800px;
  position: fixed;
  top: 0px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  margin: 40px auto;
  background-color: white;
  padding: 0% 2% 2% 2%;
  height: 85%;
  width: 75%;
  overflow-y: auto;
  overflow-x: hidden;
  box-shadow: 0px 12px 48px rgba(29, 5, 64, 0.32);
  outline: none;

  h1 {
    font-size: 1.9em !important;
    font-weight: 800;
    line-height: 1.5;
  }

  h2 {
    font-size: 1.5rem !important;
    line-height: 1.5;
  }

  h3 {
    font-size: 1.4rem !important;
  }

  h4,
  h5,
  h6 {
    font-size: 1.3rem !important;
  }

  p,
  li {
    font-size: 1rem !important;
    line-height: normal;
  }

  .article-container p,
  .article-container li {
    line-height: 40px !important;
  }

  .author {
    margin-block-start: 0em;
    margin-block-end: 0em;
    line-height: 20px !important;
  }

  button {
    font-weight: 600 !important;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgb(230, 227, 220);
  }

  ::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 6px rgb(204, 203, 200);
  }

  #zeeguuImage {
    max-height: 250px !important;
    max-width: 600px;
    width: auto !important;
  }

  .article-container {
    padding: 5px 50px 0px 50px;
  }

  .feedbackBox {
    background-color: #f2f3f4;
    line-height: 1.2em;
    border: 0px solid rgb(255, 229, 158);
    font-size: 1.2em;
  }

  .floatRight {
    float: right;
    margin: 10px 0px 0px 0px;
  }

  .logoModal {
    height: 50px;
    margin: 10px;
  }
`;

export const OverwriteZeeguu = styled.div`
  /** Zeeguu Reader **/
  z-tag:hover {
    color: #2f76ac !important;
  }
  .article-container z-tag {
    font-size: 1.2em !important;
  }
  z-tag z-tran {
    margin-bottom: -5px !important;
    color: black !important;
    font-weight: 400 !important;
  }
  h1 z-tag z-tran {
    margin-bottom: 2px !important;
  }
  h2 z-tag z-tran {
    margin-bottom: -1px !important;
  }
  h3 z-tag z-tran {
    margin-bottom: -1px !important;
  }

  z-orig {
    color: black !important;
    border-bottom: 2px dashed #2f76ac !important;
  }

  .topMessage{
    background-color: ${zeeguuTransparentMediumOrange};
  }

  .centeredColumn{
    margin-top: 0px !important;
  }

  /** Exercises **/

  .wordSourceText {
    color: #2f77ad;
  }

  .exercisesColumn {
    margin-top: 3em;
  }
  .contentOnRow {
    margin-top: 1.5em;
  }

  .topTabs h1 {
    font-size: 2.8em !important;
    margin-top: 0.3em;
    margin-block-end: 0.4em !important;
  }

  .narrowColumn h3 {
    font-size: 1.17em !important;

    small {
      display: none;
    }
  }

  .narrowColumn small {
    display: none;
  }

  .topnav a {
    float: none;
    width: 100%;
  }

  /** Buttons from Exercises **/
  .whiteButton,
  .orangeButton {
    color: white !important;
    background-color: #2f77ad !important;
    border-color: #3079b0 !important;
    :hover {
      background-color: #4f97cf !important;
    }
    font-weight: 600 !important;
  }

  .styledGreyButton {
    font-weight: 400 !important;
  }

  .loadingAnimation {
    margin-bottom: 70px;
  }

  /** Exercises on a smaller screen **/
  @media screen and (max-height: 950px) {
    // FindWordInContext Exercises
    .bottomRow {
      margin-top: 1em !important;
      margin-bottom: 1em !important;
    }

    .multipleChoice h1 {
      margin-block-start: 0em;
      margin-block-end: 0em;
    }

    .wordInContextHeadline {
      margin-block-start: 0.6em !important;
      margin-block-end: 0em !important;
    }

    // MultipleChoice Exercises
    .headlineWithMoreSpace {
      //margin-bottom: 1em !important;
    }

    // Match Exercises
    .matchInputHolder button {
      margin-top: 0.4em !important;
      margin-bottom: 0.4em !important;
    }

    .matchInputHolder {
      margin-bottom: 1em;
    }

    .matchingWords {
      margin-top: 0em;
      margin-bottom: 0em;
    }

    // General
    .centeredRow {
      margin-top: -1.3em !important;
    }
    .narrowColumn {
      padding-bottom: 0px !important;
    }
  }
`;

export const StyledHeading = styled.div`
  height: 100px;
  background-color: white;
  padding-top: 20px;
  right: 0px;
  top: 0px;
  position: sticky;
  width: 100%;
  border-bottom: 2px solid rgb(246, 246, 246);
  z-index: 1;
`;
