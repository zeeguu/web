import styled, { createGlobalStyle } from "styled-components";
import ReactModal from "react-modal";
import { zeeguuTransparentMediumOrange } from "../../zeeguu-react/src/components/colors";
import colors from "../colors";
export const GlobalStyle = createGlobalStyle`
   .reader-overlay{
        position: fixed;
        top: 0;
        left: auto;
        right: auto;
        bottom: auto;
        background-color: ${colors.overlay} !important;
        z-index: 3;
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
  z-index: 2;
  background-color: ${colors.white};
  padding: 0% 2% 2% 2%;
  margin-top: 0px;
  margin-bottom: 0px;
  margin-left: auto;
  margin-right: auto;
  height: 100%;
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

  hr {
    border-top: 1px solid #F6F6F6;
  }

  p,
  li {
    font-size: 1rem !important;
    line-height: normal;
  }

  .article-container p,
  .article-container li {
    line-height: 43px !important;
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
    width: 10px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1; 
  }

  ::-webkit-scrollbar-thumb {
    background: ${colors.lighterBlue}; 
    border-radius: 10px;
  }

  #zeeguuImage {
    max-height: 250px !important;
    max-width: 600px;
    width: auto !important;

  @media (max-width: 650px) {
    max-width: 250px;
  }
  }

  .article-container {
    padding: 5px 50px 0px 50px;
    margin-bottom: 10em;
  }

  .feedbackBox {
    background-color: ${colors.lighterBlue};
    border: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 80%;
  }

  .floatRight {
    float: right;
    margin: 10px 0px 0px 0px;
  }

  .logoModal {
    height: 2.5em;
  }
`;

export const OverwriteZeeguu = styled.div`
  /** Zeeguu Reader **/
  z-tag:hover {
    color: ${colors.translationHover} !important;
    background-color: ${colors.lightOrange};
  }
  .article-container z-tag {
    font-size: 1.2em !important;
  }
  z-tag z-tran {
    margin-bottom: -5px !important;
    color: ${colors.black} !important;
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

  z-tag.loading {
  color: ${colors.translationHover} !important;
  }

  z-orig {
    color: ${colors.black} !important;
    border-bottom: 2px dashed ${colors.translationHover} !important;
  }

  .topMessage{
    background-color: ${zeeguuTransparentMediumOrange};
  }

  .centeredColumn{
    margin-top: 0px !important;
  }

  /** Exercises **/

  .wordSourceText {
    color: ${colors.darkBlue};
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
    color: ${colors.white} !important;
    background-color: ${colors.darkBlue} !important;
    border-color: ${colors.buttonBorder} !important;
    :hover {
      background-color: ${colors.hoverBlue} !important;
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
  height: auto;
  min-height: 100px;
  overflow: hidden;
  background-color: ${colors.white};
  padding-top: 20px;
  padding-bottom: 8px;
  right: 0px;
  top: 0px;
  position: sticky;
  width: 100%;
  border-bottom: 2px solid rgb(246, 246, 246);
  z-index: 1;
`;