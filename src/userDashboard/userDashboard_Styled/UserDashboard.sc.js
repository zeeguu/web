import styled from "styled-components";
import * as s from "../../components/TopMessage.sc";
import { zeeguuWarmYellow, zeeguuDarkOrange } from "../../components/colors";
import { device } from "./Devices";
import * as datePickerCSS from "react-datepicker/dist/react-datepicker.css";
import { OrangeButton } from "../../reader/ArticleReader.sc";

const UserDashboardTopContainer = styled.div`
  text-align: center;
  margin: 0;
`;

const UserDashboardHelperText = styled(s.TopMessage)`
  @media screen and (max-width: 768px) {
    font-size: 0.8em;
    line-height: 4ex;
    text-align: left;
  }
`;

const UserDatePicker = styled.div`
  ${datePickerCSS}
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

  :hover {
    color: ${zeeguuWarmYellow};
    cursor: pointer;
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

const ProgressOverviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 70%;
  padding-bottom: 1em;
  margin-left: 10em;
  margin-top: 5em;

  @media (max-width: 768px) {
  width: 80%;
  margin-left: 3em;
  }
`;

const ProgressOverviewSection = styled.div`
  padding: 1em;
  display: flex;
  flex-wrap: wrap;
  gap: 2em;
  width: 100;
  justify-content: space-evenly;
`;

const ProgressOverviewItem = styled.div`
  display: flex;
  background-color: white;
  border:2px solid ${zeeguuWarmYellow};
  border-radius: 4px;
  padding: 1.5em;
  width: 40%;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const IconWithValueAndLabel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 4.5em;
`;

const IconAndValue = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3em;
`;

const Icon = styled.div`
  font-size: 1em;
`;

const Value = styled.div`
  font-weight: bold;
  font-size: 0.8em;
`;

const Label = styled.div`
  font-size: 0.6em;
  margin-top: 0.2em;
`;

const ProgressDescription = styled.div`
  display: flex;
  width: 60%;
  font-size: 0.75rem;
  align-items: center;
  text-align: left;
  margin-left: 4em;
`;

// parent container has to have height specified in order for the nivo graphs to be shown
// nivo automatically resizes the graphs' width, but not height
const NivoGraphContainer = styled.div`
  @media ${device.mobileS} {
    height: 200px;
  }

  @media ${device.mobileL} {
    height: 250px;
  }

  @media ${device.tablet} {
    height: 350px;
  }

  @media ${device.laptop1} {
    height: 350px;
  }

  @media ${device.laptop2} {
    height: 400px;
  }

  @media ${device.laptop3} {
    height: 450px;
  }

  @media ${device.laptop4} {
    height: 550px;
  }

  @media ${device.laptop5} {
    height: 600px;
  }

  @media ${device.desktop} {
    height: 700px;
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
  NivoGraphContainer,
  UserDatePicker,
  UserDashboardFeedbackButton,
  ProgressOverviewItem,
  ProgressOverviewSection,
  ProgressOverviewContainer,
  ProgressDescription,
  Label,
  Value,
  Icon,
  IconAndValue,
  IconWithValueAndLabel,
};