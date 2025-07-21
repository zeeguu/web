import ReactModal from "react-modal";
import styled from "styled-components";
import colors from "../colors";

export const StyledTextarea = styled.textarea`
  resize: none;
  min-width: 99%;
  min-height: 40px;
  align-items: center;
  display: block;
  font-family:
    Montserrat,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    "Fira Sans",
    "Droid Sans",
    "Helvetica Neue",
    sans-serif;
`;

export const StyledForm = styled.form`
  display: block;
  justify-content: center;
`;

export const StyledContainer = styled.div`
  overflow: hidden;
`;

export const StyledPopup = styled(ReactModal)`
  background-color: ${colors.white};
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
  font-size: 1.15rem !important;
`;

export const ErrorMessage = styled.span`
  color: ${colors.red};
`;
