import styled from "styled-components";
import { blue700, orange600 } from "../../../colors";
import { slideIn, slideOut } from "../../../transitions";

const BottomNav = styled.nav`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: fixed;
  bottom: 0;
  padding: 0.5rem 1rem 1rem 1rem;
  background-color: ${({ isOnStudentSide }) =>
    isOnStudentSide ? `${orange600}` : `${blue700}`};
  color: white;
  z-index: 1;
  transition: 0.3s ease-in-out;
  animation: ${({ isBottonNavVisible }) =>
      isBottonNavVisible ? slideIn : slideOut}
    0.3s ease-in-out forwards;
`;

export { BottomNav };
