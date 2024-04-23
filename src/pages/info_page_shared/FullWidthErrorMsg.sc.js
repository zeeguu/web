import styled from "styled-components";
import { errorRed, zeeguuRed } from "../../components/colors";

const FullWidthErrorMsg = styled.div`
  box-sizing: border-box;
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: flex-start;
  padding: 0.75rem 1rem;
  border-radius: 0.3rem;
  color: #BA2135;
  background-color: #FAE5E9;
  /* background-color: #FAE1E4; */
  font-weight: 500;
`;

export { FullWidthErrorMsg };
