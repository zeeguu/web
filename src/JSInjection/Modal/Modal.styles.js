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

  p {
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
  font-family: "Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI",
    "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
    "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

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

