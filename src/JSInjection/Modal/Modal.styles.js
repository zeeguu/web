import styled, { createGlobalStyle } from "styled-components";
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
  max-width: 800px;
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
    font-size: 1.2rem !important;
    line-height: 40px !important;
  }

  .author {
    margin-block-start: 0em;
    margin-block-end: 0em;
    line-height: 20px !important;
  }

  font-family: "Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI",
    "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
    "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

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
  z-tag:hover {
    color: #a46a00 !important;
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
  height: 90x;
  background-color: white;
  padding-top: 20px;
  right: 0px;
  top: 0px;
  position: sticky;
  width: 100%;
  border-bottom: 1px solid rgb(250, 250, 250);
`;
export const StyledButton = styled.button`
  background-color: #e7e7e9;
  cursor: pointer;
  border-radius: 10px;
  border: none;
  padding: 7px;
  margin: 5px 5px 5px 0px;

  :hover {
    box-shadow:rgba(255, 208, 71, 0.4);
  }
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

`;

export const StyledFeedbackButton = styled.button`
  display: left;
  background-color: rgb(255, 187, 84, 0.6);
  color: black;
  border-radius: 10px;
  border: none;
  padding: 7px;
  margin: 5px 0px 5px 0px;
  float: right;
  height: 30px;
  width: 120px;

  :hover {
    background-color: rgba(255, 208, 71, 0.4);
  }
`;

export const ErrorMessage = styled.span`
  color: red;
`;
