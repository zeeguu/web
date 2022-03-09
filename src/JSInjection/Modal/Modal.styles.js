import styled, { createGlobalStyle } from "styled-components";
import ReactModal from "react-modal";

export const GlobalStyle = createGlobalStyle`
   .ReactModal__Overlay{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(255,208,71) !important;
      }
`;

export const StyledModal = styled(ReactModal)`
  max-width: 700px;
  h1 {
    font-size: 1.9em !important;
  }

  h2 {
    font-size: 1.7rem !important;
  }

  h3 {
    font-size: 1.5rem !important;
  }

  h4,
  h5,
  h6 {
    font-size: 1.4rem !important;
  }

  p {
    font-size: 1.1rem !important;
  }

  font-family: Arial, sans-serif;
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
    box-shadow: inset 0 0 6px rgba(255, 208, 71);
  }

  ::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 6px rgb(255, 209, 71);
  }

  #zeeguuImage {
    max-height: 250px !important;
    width: auto !important;
  }
`;

export const StyledButton = styled.div`
  cursor: pointer;
  right: 0px;
  padding: 20px;
  height: 55px;
  margin: 10px;
  padding: 1px;
  float: right;
`;

export const StyledHeading = styled.div`
  height: 110px;
  background-color: white;
  padding-top: 20px;
  right: 0px;
  top: 0px;
  position: sticky;
  width: 100%;
  border-bottom: 1px solid rgb(239, 239, 239);
`;
export const StyledPersonalCopy = styled.button`
  background-color: rgba(255, 229, 158);
  cursor: pointer;

  :hover {
    background-color: rgba(255, 187, 84);
  }
`;