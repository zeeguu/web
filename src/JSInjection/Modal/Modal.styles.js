import styled, { createGlobalStyle, css } from "styled-components";

import ReactModal from "react-modal";
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
    padding: 5px 50px 0px 50px;
  }

  //grey box
  .feedbackBox {
  background-color: #f2f3f4;
  line-height: 1.2em;
  border: 0px solid rgb(255, 229, 158);
  font-size: 1.2em;
  }

  .floatRight{
  float:right;
  }

  .logoModal {
    height: 50px;
    margin: 10px;
  } 


  /*** Overwriting zeeguu-react ***/
  
  //blue
  z-tag:hover {
    color: #2F76AC !important;
  }
  z-tag{
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

  //blue dashed
  z-orig {
    color: black !important;
    border-bottom: 2px dashed #2F76AC !important;
  }

  .iNWOJK h1 {
    font-size: 2.8em !important;
    margin-top: 0.3em;
    margin-block-end: 0.4em !important;
  }

  .sc-pNWdM.XJxhY h3 {
    font-size: 1.17em!important;
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
  button{
    font-weight: 600!important;
  }

  //blue buttons from zeeguu-react
  .sc-jSFjdj.sc-fujyAs.sc-fFSPTT.sc-iemWCZ.jcTaHb.eysHZq.eEJWPz.hKymwP,
  .sc-jSFjdj.sc-fujyAs.sc-eKYRIR.jcTaHb.eysHZq.llyViG,
  .sc-jSFjdj.sc-fujyAs.sc-fFSPTT.sc-iemWCZ.jcTaHb.eysHZq.eEJWPz.hKymwP,
  .sc-jSFjdj.sc-fujyAs.sc-fFSPTT.sc-bkbkJK.jcTaHb.eysHZq.eEJWPz.bIINLz
  {
    color: white !important;
    background-color: #2F77AD!important;
    border-color: #3079B0!important;
    :hover{
      background-color: #4F97CF!important;
    }
    font-weight: 600;
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

export const StyledSmallButtonBlue = styled.button`
  color: white !important;
  background-color: #2F77AD!important;
  border-color: #3079B0!important;
  :hover{
    background-color: #4F97CF!important;
  }
  cursor: pointer;
  border-radius: 10px;
  border: none;
  padding: 7px;
  margin: 5px 5px 5px 0px;
  font-weight: 600;
`;

export const StyledButtonBlue = styled.button`
  color: white !important;
  background-color: #2F77AD!important;
  border-color: #3079B0!important;

  :hover{
    background-color: #4F97CF!important;
  }

  font-weight: 600;
  color: white;
  height: 45px;
  display: inline-block;
  margin: 5px;
  height: 45px;
  border-style: solid;
  border-width: 2px;
  border-radius: 10px;
  font-size: 18px;
  cursor: pointer;
`;


export const MarginTop = styled.div`
  margin-top: 11px;
`;

export let NavigationButton = styled.button`
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  font-weight: 600;
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
     color: white !important;
     background-color: #2F77AD!important;
     border-color: #3079B0!important;
     :hover{
         background-color: #4F97CF!important;
      }
      border-style: solid;
      border-width: 2px;
      border-radius: 10px;
    `}
  // Secondary
  ${(props) =>
    props.secondary &&
    css`
      color: white !important;
      background-color: #2F77AD!important;
      border-color: #3079B0!important;
      :hover{
        background-color: #4F97CF!important;
      }
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

export const StyledTextarea = styled.textarea`
  resize: none;
  min-width: 99%;
  min-height: 70px;
  align-items: center;
  display: block;
`;

export const StyledForm = styled.form`
  display: block;
  justify-content: center;
`;

export const StyledContainer = styled.div`
  padding: 10px;
  overflow: hidden;
`;

export const StyledPopup = styled(ReactModal)`
  background-color: white;
  position: fixed;
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 25px;
  padding-right: 25px;
  box-shadow: 0px 10px 30px rgba(29, 5, 64, 0.32);
  border-radius: 2px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: "Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI",
  "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
  "Helvetica Neue", sans-serif;
  font-size: 1.0rem !important;
`;

//export const StyledFeedbackButton = styled.button`
//  display: left;
//  background-color: rgb(255, 187, 84, 0.6);
//  color: black;
//  border-radius: 10px;
//  border: none;
//  padding: 7px;
//  margin: 5px 0px 5px 0px;
//  float: right;
//  height: 30px;
//  width: 120px;//

//  :hover {
//    background-color: rgba(255, 208, 71, 0.4);
//  }
//`;

export const ErrorMessage = styled.span`
  color: red;
`;
