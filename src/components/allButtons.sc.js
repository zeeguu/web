import styled from "styled-components";
import { zeeguuOrange } from "./colors";

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

const ClosePopupButton = styled.div`
  height: 1.5em;
  width: 1.4em;
  border-radius: 50%;
  float: right;
  cursor: pointer;
  font-size: 0.8em;

  font-weight: 500;
  background-color: white;
  color: orange;
  border: 1px solid orange;
  text-align: center;
  margin-left: 0.2em;
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

export { RoundButton, OrangeRoundButton, BigSquareButton, ClosePopupButton };
