import styled, { createGlobalStyle, css } from "styled-components";
import ReactModal from "react-modal";
import { zeeguuOrange } from "../../zeeguu-react/src/components/colors";
export const GlobalStyle = createGlobalStyle`
   .ReactModal__Overlay{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgb(239, 239, 239) !important;
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
    font-size: 1.0rem !important;
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
    padding: 5px 45px 0px 45px;
  }

  .feedbackBox {
  background-color: rgb(255, 229, 158);
  line-height: 1.2em;
  border: 0px solid rgb(255, 229, 158);
  font-size: 1.2em;
  }

  .logoModal {
    height: 50px;
    margin: 10px;
  } 


  /*** Overwriting zeeguu-react ***/
  z-tag:hover {
    color: #a46a00 !important;
  }
  z-tag{
    font-size: 1.2em !important;
  }
  z-tag z-tran {
    margin-bottom: -5px !important;
    color: black !important;
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
    color: #a46a00 !important;
  }

  .dXiuJH h1 {
    font-size: 2.8em !important;
    margin-top: 0.3em;
    margin-block-end: 0.4em !important;
  }

  .sc-dPaNzc.fqbJCS {
    margin-top: 0em !important;
    margin-bottom: 0em !important;
  }

  .sc-ezzafa.dvHFX h1 {
    margin-block-start: 0.3em !important;
    margin-block-end: 0em !important;
  }

  .sc-khIgEk.hQhHpX {
    margin-top: -1em !important;
  }

  .dvHFX .headlineWithMoreSpace {
    margin-top: 2em!important;
    margin-bottom: 0em!important;
  }

  .sc-hmbstg.iriXCP {
    display: none!important;
  }

  .sc-pNWdM.XJxhY {
    padding-bottom: 0px!important;
  }

  .sc-bYwzuL.sc-gXfVKN.fDDjHD.jKLUHq {
    margin-top: 1em!important;
    margin-bottom: 1em!important;
  }
  .lRfdj {
    margin-top: 0em!important;
    margin-bottom: 0em!important;
  }

  .sc-bYwzuL.sc-ciSkZP.sc-jcwpoC.fDDjHD.bwSYJA.kyvWZW{
    height: 2em!important;
  }
  .sc-gtsrHT.gfuSqG{
    margin-bottom: 70px;
  }

`;

export const StyledCloseButton = styled.div`
  cursor: pointer;
  right: 0px;
  padding: 20px;
  height: 55px;
  margin: 10px;
  padding: 1px;
  float: right;
  font-family: "Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI",
    "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
    "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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

export const StyledButtonGrey = styled.button`
  background-color: #e7e7e9;
  cursor: pointer;
  border-radius: 10px;
  border: none;
  padding: 7px;
  margin: 5px 5px 5px 0px;

  :hover,
  :focus {
    box-shadow: 0 0.5em 0.5em -0.4em rgba(255, 208, 71);
  }
`;

export const StyledButtonOrange = styled.button`
  background-color: ${zeeguuOrange};
  font-weight: 500;
  color: white;
  height: 45px;
  display: inline-block;
  margin: 5px;
  height: 45px;
  border-color: ${zeeguuOrange};
  border-style: solid;
  border-width: 2px;
  border-radius: 10px;
  font-size: 18px;
  cursor: pointer;
`;

export const StyledButtonWhite = styled.button`
  font-weight: 500;
  background-color: white;
  color: ${zeeguuOrange};
  height: 45px;
  cursor: pointer;
  display: inline-block;
  margin: 5px;
  height: 45px;
  border-color: ${zeeguuOrange};
  border-style: solid;
  border-width: 2px;
  border-radius: 10px;
  font-size: 18px;
`;

export const MarginTop = styled.div`
  margin-top: 11px;
`;

export let NavigationButton = styled.button`
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  min-width: 8em;
  min-height: 2em;
  padding: 0.5em;
  font-size: 1.2em;
  margin-left: 1em;
  @media (min-wdith: 768px) {
    width: 16em;
  }
  // Next
  ${(props) =>
    props.next &&
    css`
      :after {
        content: ">>";
      }
    `}
  // Previous
  ${(props) =>
    props.prev &&
    css`
      :before {
        content: "<<";
      }
    `}
  // Primary
  ${(props) =>
    props.primary &&
    css`
      background-color: ${zeeguuOrange} !important;
      color: white !important;
      border-color: ${zeeguuOrange};
      border-style: solid;
      border-width: 2px;
      border-radius: 10px;
    `}
  // Secondary
  ${(props) =>
    props.secondary &&
    css`
      border: none !important;
      background-color: white !important;
      color: ${zeeguuOrange} !important;
      border-color: ${zeeguuOrange}!important;
      border-style: solid!important;
      border-width: 2px!important;
      border-radius: 10px!important;
    `}
    // Disabled
    ${(props) =>
    props.disabled &&
    css`
      background-color: white !important;
      color: #999999 !important;
      cursor: not-allowed;
      border-color: #999999 !important;
      pointer-events: none;
      border-width: 0;
      border-style: solid;
      border-width: 2px;
      border-radius: 10px;
    `}
`;
