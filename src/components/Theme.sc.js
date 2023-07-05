import styled from "styled-components";
import { zeeguuRed, zeeguuSecondGray } from "./colors";

const errorText = styled.span`
  color: ${zeeguuRed};
`;

const LabelWithError = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const H1 = styled.h1`
  font-style: normal;
  font-weight: 500;
  font-size: 40px;
  line-height: 48px;
  color: ${zeeguuSecondGray};
  text-align: center;
`;

const H3 = styled.h3`
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  letter-spacing: 0.02em;
  color: ${zeeguuSecondGray};
`;

const RoundButton = styled.div`
  user-select: none;
  display: inline-block;
  padding: 7px 23px;
  border-radius: 50px;
  background-color: lightgray;
  color: white;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  font-size: 13px;
  line-height: 16px;
`;

export { H1, H3, errorText, LabelWithError, RoundButton };
