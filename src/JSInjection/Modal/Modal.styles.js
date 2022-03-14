import styled, { createGlobalStyle } from "styled-components";
import ReactModal from "react-modal";

export const GlobalStyle = createGlobalStyle`
   .ReactModal__Overlay{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #FFE59E !important;
      }
`;

export const StyledModal = styled(ReactModal)`
  max-width: 650px;
  h1 {
    font-size: 1.9em !important;
    font-weight: 800;
  }

  h2 {
    font-size: 1.5rem !important;
  }

  h3 {
    font-size: 1.3rem !important;
  }

  h4,
  h5,
  h6 {
    font-size: 1.2rem !important;
  }

  p, li {
    font-size: 1.1rem !important;
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
    box-shadow: inset 0 0 6px rgb(230, 227, 220) ;
  }

  ::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 6px rgb(204, 203, 200);
  }

  #zeeguuImage {
    max-height: 250px !important;
    max-width: 600px;
    width: auto !important;
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

:hover,
:focus {
  box-shadow: 0 0.5em 0.5em -0.4em rgba(255,208,71);
}
`;
