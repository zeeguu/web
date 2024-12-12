import styled, { css } from "styled-components";
import { zeeguuOrange, lightOrange, lightGrey } from "./colors";
import MUISearchIcon from "@mui/icons-material/Search";

const RoundButton = styled.div`
  user-select: none;
  display: inline-block;

  margin-right: 0.25em;
  border-radius: 1.0625em;
  padding: 0.3125em 1.1875em;

  background-color: lightgray;
  color: white !important;
  font-weight: 500;
  text-align: center;
  vertical

  cursor: pointer;
  margin-top: 3px;
  box-sizing: border-box;
`;

const WhiteRoundButton = styled(RoundButton)`
  background-color: white;
  color: ${zeeguuOrange} !important;
  border: 2px solid ${zeeguuOrange};
  &:hover {
    filter: brightness(95%);
  }
`;

const OrangeRoundButton = styled(RoundButton)`
  background-color: ${zeeguuOrange};
  border: 2px solid ${zeeguuOrange};
  &:hover {
    filter: brightness(105%);
  }
  .
`;

const SearchIcon = styled(MUISearchIcon)`
  color: ${zeeguuOrange};
  &:hover {
    filter: brightness(120%);
  }
`;

// from: https://stackoverflow.com/questions/10019797/pure-css-close-button
const ClearSearchButton = styled.div`
  float: left;
  margin-top: 2px;
  margin-left: -3rem;
  margin-right: 1rem;
  box-sizing: border-box;
  width: 1.4em;
  height: 1.4em;
  cursor: pointer;
  border-width: 3px;
  border-style: solid;
  border-color: white;
  border-radius: 100%;
  &:hover {
    filter: brightness(120%);
  }
  background:
    -webkit-linear-gradient(
      -45deg,
      transparent 0%,
      transparent 46%,
      gray 46%,
      gray 56%,
      transparent 56%,
      transparent 100%
    ),
    -webkit-linear-gradient(45deg, transparent 0%, transparent 46%, gray 46%, gray
          56%, transparent 56%, transparent 100%);
  background-color: white;
`;

const BigSquareButton = styled(RoundButton)`
  margin: 5px;
  width: 180px;
  height: 45px;
  border-color: ${zeeguuOrange};
  border-style: solid;
  border-width: 2px;
  border-radius: 10px;
  font-size: 18px;
`;

const StyledButton = styled.button`
  color: black;
  height: auto;
  display: flex;
  padding: 1em;
  margin: 1em;
  border-style: none;
  border-width: 2px;
  border-radius: 10px;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  align-items: center;
  justify-content: center;

  // Primary
  ${(props) =>
    props.primary &&
    css`
      background-color: ${zeeguuOrange};
      :hover {
        background-color: ${lightOrange};
      }
    `}

  // Secondary
  ${(props) =>
    props.secondary &&
    css`
      background-color: white;
      :hover {
        text-decoration: underline;
      }
      border: 2px solid ${zeeguuOrange};
    `}
  
  // Navigation used together with <NavigateNextIcon /> or <NavigateBeforeIcon />
  ${(props) =>
    props.navigation &&
    css`
      background-color: white;
      :hover {
        text-decoration: underline;
      }
    `}

    // Disabled
    ${(props) =>
    props.disabled &&
    css`
      background-color: ${lightGrey};
      cursor: not-allowed;
    `}
`;

export {
  RoundButton,
  OrangeRoundButton,
  WhiteRoundButton,
  BigSquareButton,
  ClearSearchButton,
  StyledButton,
  SearchIcon,
};
