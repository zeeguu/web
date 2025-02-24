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
export const ZeeguuErrorStyle = styled.div`
  font-family:
    "Montserrat",
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    "Roboto",
    "Oxygen",
    "Ubuntu",
    "Cantarell",
    "Fira Sans",
    "Droid Sans",
    "Helvetica Neue",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 2px !important;

  p {
    font-size: 1rem !important;
    color: black;
    text-align: center;
  }

  .background {
    height: 100%;
    width: 100%;
  }

  .card {
    background-color: #f4f4f6;
    margin-top: 3em;
    margin-right: auto;
    margin-left: auto;
    width: fit-content;
    padding: 3em;
    max-width: 50em;
    min-width: 20em;

    border: black;
    border-style: solid;
    border-radius: 2em;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-self: center;
    align-items: center;
    justify-content: center;
  }
`;

export const StyledModal = styled(ReactModal)`
  font-family:
    "Montserrat",
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    "Roboto",
    "Oxygen",
    "Ubuntu",
    "Cantarell",
    "Fira Sans",
    "Droid Sans",
    "Helvetica Neue",
    sans-serif;
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
  margin-bottom: 2em;

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
    border-top: 1px solid #f6f6f6;
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
    max-width: 20em;
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

  progress[value] {
    --color: linear-gradient(
      89.5deg,
      ${colors.zeeguuOrange},
      ${colors.zeeguuLightYellow} 100%
    ); /* the progress color */
    --background: ${colors.lightGray}; /* the background color */

    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border: none;
    width: 100%;
    height: 0.5em;
    margin: 10px 0px 1px 0px;
    border-radius: 10em;
    background: var(--background);
    transition: all 0.1s linear 0s;
  }

  progress[value]::-webkit-progress-bar {
    transition: all 0.1s linear 0s;
    border-radius: 10em;
    background: var(--background);
  }
  progress[value]::-webkit-progress-value {
    transition: all 0.1s linear 0s;
    border-radius: 10em;
    background: var(--color);
  }
  progress[value]::-moz-progress-bar {
    transition: all 0.1s linear 0s;
    border-radius: 10em;
    background: var(--color);
  }
`;

export const StyledBox = styled.div`
  border: 1px solid ${colors.lighterBlue};
  background-color: white;
  border-radius: 0.5em;
  display: flex;
  flex-direction: column;
  padding: 2em 0em 2em 0em;
  margin-top: 1em;
  align-items: center;
  justify-content: center;

  @media (min-width: 768px) {
    width: 30em;
  }
  margin-left: auto;
  margin-right: auto;

  h2,
  h3,
  h5,
  p {
    text-align: center;
  }
  .selected {
    background-color: #ffd047 !important;
    color: white !important;
  }
`;

export const InvisibleBox = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  padding: 0.5em 0em 0em 0em;
  align-items: center;
  justify-content: center;

  @media (min-width: 768px) {
    width: 30em;
  }
  margin-left: auto;
  margin-right: auto;

  h2,
  h3,
  h5,
  p {
    text-align: center;
  }
  .selected {
    background-color: ${colors.zeeguuVarmYellow} !important;
    color: white !important;
  }
`;

export const CenteredContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  max-width: 90%;
  align-items: center;

  .imgContainer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 1em;
    align-items: center;
  }
`;
