import styled from "styled-components";
import { zeeguuOrange, white, brown, lightOrange, buttonBorder } from "./colors";

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

  cursor: pointer;
  margin-top: 3px;
  box-sizing: border-box;
`;

const OrangeRoundButton = styled(RoundButton)`
  background-color: ${zeeguuOrange};
`;

const OrangeBackButton = styled(OrangeRoundButton)`
  position: absolute;
  bottom:1em;
  left:0;
`;

// from: https://stackoverflow.com/questions/10019797/pure-css-close-button
const ClearSearchButton = styled.div`
  display: block;
  float: left;
  margin-top: 3px;
  margin-left: -1.6em;
  box-sizing: border-box;
  width: 1.4em;
  height: 1.4em;

  border-width: 3px;
  border-style: solid;
  border-color: white;
  border-radius: 100%;
  background: -webkit-linear-gradient(
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

  transition: all 0.3s ease;
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

const StyledPrimaryButton = styled.button`
  color: ${white};
  background-color: ${zeeguuOrange};
  border-color:  ${buttonBorder} !important;

  :hover{
    background-color: ${lightOrange};
    color: ${brown};
  }

  height: 45px;
  display: inline-block;
  padding: 5px 45px 5px 45px;
  margin: 5px;
  height: 50px;
  border-style: none;
  border-width: 2px;
  border-radius: 40px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0px 4px ${brown};
`;

export { RoundButton, OrangeRoundButton, OrangeBackButton, BigSquareButton, ClearSearchButton, StyledPrimaryButton};
