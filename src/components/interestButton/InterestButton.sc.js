import styled from "styled-components";
import { RoundButton } from "../Theme.sc";
import {
  zeeguuSecondGray,
  zeeguuSecondOrange,
  zeeguuThirdGray,
} from "../colors";
import { variants } from "./InterestButton";

const InterestButton = styled(RoundButton)`
  border: 1px solid ${zeeguuThirdGray};
  cursor: ${(props) => (props.disabled ? "default" : "pointer")};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => {
    switch (props.variant) {
      case variants.orangeFilled:
        return zeeguuSecondOrange;
      case variants.grayFilled:
        return zeeguuThirdGray;
      case variants.orangeOutlined:
        return "white";
      case variants.grayOutlined:
        return "white";
    }
  }};
  color: ${(props) => {
    switch (props.variant) {
      case variants.orangeOutlined:
        return zeeguuSecondOrange;
      case variants.grayOutlined:
        return zeeguuThirdGray;
      case variants.grayFilled:
        return zeeguuSecondGray;
      case variants.orangeFilled:
        return "white";
    }
  }};
  border: ${(props) => {
    switch (props.variant) {
      case variants.orangeOutlined:
        return `1px solid ${zeeguuSecondOrange}`;
      case variants.grayOutlined:
        return `1px solid ${zeeguuThirdGray}`;
      case variants.grayFilled:
        return `1px solid ${zeeguuThirdGray}`;
      case variants.orangeFilled:
        return `1px solid ${zeeguuSecondOrange}`;
    }
  }};
`;

export { InterestButton };
