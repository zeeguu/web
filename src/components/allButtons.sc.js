import styled, { css } from "styled-components";
import { zeeguuOrange, lightOrange } from "./colors";
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
  vertical-align: middle;

  cursor: pointer;
  margin-top: 3px;
  box-sizing: border-box;
`;

const WhiteRoundButton = styled(RoundButton)`
  background-color: var(--card-bg);
  color: ${zeeguuOrange} !important;
  border: 2px solid ${zeeguuOrange};
  @media (hover: hover) {
    &:hover {
      filter: brightness(95%);
    }
  }
`;

const OrangeRoundButton = styled(RoundButton)`
  background-color: ${zeeguuOrange};
  border: 2px solid ${zeeguuOrange};
  @media (hover: hover) {
    &:hover {
      filter: brightness(105%);
    }
  }
`;

const SearchIcon = styled(MUISearchIcon)`
  color: ${zeeguuOrange};
  @media (hover: hover) {
    &:hover {
      filter: brightness(120%);
    }
  }
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

  // Primary (use $primary to avoid passing to DOM)
  ${(props) =>
    props.$primary &&
    css`
      background-color: ${zeeguuOrange};
      @media (hover: hover) {
        :hover {
          background-color: ${lightOrange};
        }
      }
    `}

  // Secondary (use $secondary to avoid passing to DOM)
  ${(props) =>
    props.$secondary &&
    css`
      background-color: white;
      @media (hover: hover) {
        :hover {
          text-decoration: underline;
        }
      }
      border: 2px solid ${zeeguuOrange};

      ${(props) =>
        props.$disabled &&
        css`
          border: none;
        `}
    `}

  // Navigation used together with <NavigateNextIcon /> or <NavigateBeforeIcon />
  ${(props) =>
    props.$navigation &&
    css`
      background-color: var(--action-btn-secondary-color-bg);
      color: var(--action-btn-secondary-color-text);
      @media (hover: hover) {
        :hover {
          text-decoration: underline;
        }
      }
    `}

    // Disabled
  ${(props) =>
    props.$disabled &&
    css`
      background-color: var(--action-btn-secondary-color-bg);
      color: var(--action-btn-secondary-color-text);
      cursor: not-allowed;
    `}

  //onboarding
  ${(props) =>
    props.$onboarding &&
    css`
      background-color: var(--onboarding-btn-bg);
      color: var(--onboarding-btn-text-color);
      @media (hover: hover) {
        :hover {
          background-color: ${lightOrange};
        }
      }
    `}
`;

const HideWhenDisabledButton = styled(StyledButton)`
  ${(props) =>
    props.$disabled &&
    css`
      display: none;
    `}
`;

export {
  RoundButton,
  OrangeRoundButton,
  WhiteRoundButton,
  BigSquareButton,
  StyledButton,
  HideWhenDisabledButton,
  SearchIcon,
};
