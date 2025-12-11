import styled from "styled-components";
import * as s from "../../components/TopMessage.sc";
import { zeeguuWarmYellow, zeeguuDarkOrange } from "../../components/colors";
import "react-datepicker/dist/react-datepicker.css";
import { OrangeButton } from "../../reader/ArticleReader.sc";

const UserDashboardTopContainer = styled.div`
  text-align: center;
`;

const UserDashboardHelperText = styled(s.YellowMessageBox)`
  @media screen and (max-width: 768px) {
    font-size: 0.8em;
    line-height: 4ex;
    text-align: left;
  }
`;

const UserDatePicker = styled.div`
  padding: 0.2em;
  input {
    border: none;
    font-size: 1em;
    font-weight: 400;
    letter-spacing: 0;
    color: ${zeeguuDarkOrange};
    text-align: center;
    :hover {
      cursor: pointer;
    }
  }
`;

const UserDashBoardTabs = styled.div`
  line-height: 0.8em;
  width: 100%;
  align-items: center;
  display: flex;
  justify-content: center;
  margin-bottom: 1em;
`;

const UserDashBoardTab = styled.a`
  font-size: 1em;
  font-weight: ${(props) => (props.isActive ? 600 : 400)};
  letter-spacing: 0;
  color: black;
  padding: 1em;
  cursor: pointer;

  :hover {
    color: ${zeeguuWarmYellow};
  }

  @media screen and (max-width: 768px) {
    font-size: 0.8em;
    padding: 0.5em;
    line-height: 7ex;
  }
`;

const UserDashBoardDropdown = styled.select`
  border: none;
  font-size: 1em;
  font-weight: 400;
  letter-spacing: 0;
  color: ${(props) => (props.isCustom ? "black" : zeeguuDarkOrange)};
  text-align: center;

  :hover {
    cursor: pointer;
  }
`;
const UserDashboardFeedbackButton = styled(OrangeButton)`
  display: inline-block;
  float: none;
  width: 30%;
`;

export {
  UserDashboardTopContainer,
  UserDashboardHelperText,
  UserDashBoardTabs,
  UserDashBoardTab,
  UserDashBoardDropdown,
  UserDatePicker,
  UserDashboardFeedbackButton,
};
