import styled, { css } from "styled-components";
import colors from "../colors";

export const StyledPrimaryButton = styled.button`
  color: ${colors.black};
  background-color: ${colors.zeeguuOrange};

  :hover {
    background-color: ${colors.lightOrange};
  }

  .default {
    background-color: ${colors.darkBlue};
    color: ${colors.white};
  }

  height: 45px;
  display: flex;
  padding: 5px 45px 5px 45px;
  margin: 5px;
  height: 50px;
  border-style: none;
  border-width: 2px;
  border-radius: 10px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  align-items: center;
  justify-content: center;
`;

export const StyledCloseButton = styled.div`
  cursor: pointer;
  padding: 0%;
  height: 55px;
  margin: 0px 0px 20px 20px;
  float: right;
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
`;

export const StyledSmallButton = styled.button`
  color: ${colors.lightBlue} !important;
  background-color: ${colors.white} !important;
  border-color: none;
  cursor: pointer;
  border-radius: 50px;
  border: none;
  padding: 5px;
  margin: 5px 5px 5px 5px;
  width: auto;
`;

export const StyledSmallButtonBlue = styled.button`
  color: ${colors.white} !important;
  background-color: ${colors.darkBlue} !important;
  border-color: ${colors.buttonBorder} !important;
  :hover {
    background-color: ${colors.hoverBlue}!important;
  }
  cursor: pointer;
  border-radius: 10px;
  border: none;
  padding: 5px;
  margin: 5px 5px 5px 5px;
  font-size: 18px;
`;

export const StyledSmallDisabledButton = styled.button`
  color: #b7b7b7 !important;
  background-color: ${colors.white} !important;
  border-color: none;
  cursor: default;
  border-radius: 10px;
  border: none;
  padding: 5px;
  margin: 5px 5px 5px 5px;
`;

export const StyledButtonBlue = styled.button`
  color: ${colors.white} !important;
  background-color: ${colors.darkBlue} !important;
  border-color: ${colors.buttonBorder} !important;

  :hover {
    background-color: ${colors.hoverBlue} !important;
  }

  color: ${colors.white};
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

export let NavigationButton = styled.button`
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  min-width: 8em;
  min-height: 2em;
  height: 2.3em;
  padding: 0.5em;
  font-size: 1.2em;
  margin-left: 1em;
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
      color: ${colors.white} !important;
      background-color: ${colors.darkBlue} !important;
      border-color: ${colors.buttonBorder} !important;
      :hover {
        background-color: ${colors.hoverBlue}!important;
      }
      border-style: solid;
      border-width: 2px;
      border-radius: 10px;
    `}
  // Secondary
  ${(props) =>
    props.secondary &&
    css`
      color: ${colors.white} !important;
      background-color: ${colors.darkBlue} !important;
      border-color: ${colors.buttonBorder}!important;
      :hover {
        background-color: ${colors.hoverBlue} !important;
      }
      border-style: solid !important;
      border-width: 2px !important;
      border-radius: 10px !important;
    `}
    // Disabled
    ${(props) =>
    props.disabled &&
    css`
      background-color: ${colors.white} !important;
      color: ${colors.gray} !important;
      cursor: not-allowed;
      border-color: ${colors.gray} !important;
      pointer-events: none;
      border-width: 0;
      border-style: solid;
      border-width: 2px;
      border-radius: 10px;
    `}
`;
