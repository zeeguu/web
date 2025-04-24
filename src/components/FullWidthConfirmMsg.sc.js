import styled from "styled-components";
import { darkGreen, greenTransparent } from "./colors";

const FullWidthConfirmMsg = styled.div`
  box-sizing: border-box;
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: flex-start;
  padding: 0.75rem 1rem;
  border-radius: 0.3rem;
  color: ${darkGreen};
  background-color: ${greenTransparent};
  font-weight: 500;
`;

export default FullWidthConfirmMsg;
