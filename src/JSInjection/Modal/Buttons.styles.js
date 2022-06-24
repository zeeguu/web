import styled, { css } from "styled-components";
import colors from "../colors";

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


export const StyledSmallButtonBlue = styled.button`
  color: ${colors.white} !important;
  background-color: ${colors.darkBlue} !important;
  border-color: ${colors.buttonBorder} !important;
  :hover{
    background-color: ${colors.hoverBlue}!important;
  }
  cursor: pointer;
  border-radius: 10px;
  border: none;
  padding: 7px;
  margin: 5px 5px 5px 0px;
`;

export const StyledSmallDisabledButton = styled.button`
  color: #696969!important;
  background-color: ${colors.lightGray} !important;
  border-color: ${colors.darkGray} !important;
  cursor: default;
  border-radius: 10px;
  border: none;
  padding: 7px;
  margin: 5px 5px 5px 0px;
`;

export const StyledButtonBlue = styled.button`
  color: ${colors.white} !important;
  background-color: ${colors.darkBlue} !important;
  border-color:  ${colors.buttonBorder} !important;

  :hover{
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
     :hover{
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
      color:${colors.white} !important;
      background-color: ${colors.darkBlue} !important;
      border-color: ${colors.buttonBorder}!important;
      :hover{
        background-color: ${colors.hoverBlue} !important;
      }
      border-style: solid!important;
      border-width: 2px!important;
      border-radius: 10px!important;
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
