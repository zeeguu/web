import styled from "styled-components";
import { zeeguuRedTransparent, zeeguuDarkRed } from "./colors";

const FullWidthErrorMsg = styled.div`
  box-sizing: border-box;
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: flex-start;
  padding: 0.75rem 1rem;
  border-radius: 0.3rem;
  color: ${zeeguuDarkRed};
  background-color: ${zeeguuRedTransparent};
  font-weight: 500;
`;

export default FullWidthErrorMsg;
