import styled from "styled-components";
import { zeeguuSecondOrange } from "../colors";

const TimeLabel = styled.span`
  margin-left: 5px;
  display: inline-block;
  user-select: none;
  pointer-events: none;
  padding: 5px;
  color: ${zeeguuSecondOrange};
  border: solid 1px ${zeeguuSecondOrange};
  background-color: white;
  border-radius: 50px;
  font-style: normal;
  font-weight: 500;
  font-size: 10px;
  line-height: 100%;
`;

export { TimeLabel };
