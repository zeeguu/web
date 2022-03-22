import styled, { css } from "styled-components";

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
`;

export const StyledButtonBlue = styled.button`
  color: white !important;
  background-color: #2F77AD!important;
  border-color: #3079B0!important;

  :hover{
    background-color: #4F97CF!important;
  }

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