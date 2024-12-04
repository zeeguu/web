import styled from "styled-components";
import { blue700, orange600 } from "../../../colors";
import { Link } from "react-router-dom/cjs/react-router-dom";
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

const BottomNavOption = styled.li`
  box-sizing: border-box;
  list-style: none;
  font-weight: 700;
  font-size: 0.7rem;
  position: relative;
`;

const StyledLink = styled(Link)`
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 4rem;
  height: 3rem;
  white-space: nowrap;
  gap: 0.2rem;
  font-weight: inherit;
  user-select: none;
  position: relative;
`;

const StyledButton = styled.button`
  color: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: inherit;
  font: inherit;
  border: inherit;
  padding: inherit;
  margin: inherit;
  width: 4rem;
  height: 3rem;
  gap: 0.2rem;
  user-select: none;
  position: relative;
`;

const IconSpan = styled.span`
  position: relative;
  border-radius: 0.25rem;
  padding: 0.2rem 0.5rem;
  color: inherit;
  transition: 0.3s ease-in-out;

  ${({ isActive, isOnStudentSide }) =>
    isActive &&
    `
    background-color: white;
    color: ${isOnStudentSide ? `${orange600}` : `${blue700}`};
  `}

  :active {
    background-color: white;
    color: ${({ isOnStudentSide }) =>
      isOnStudentSide ? `${orange600}` : `${blue700}`};
  }
`;

export { BottomNav, BottomNavOption, StyledLink, IconSpan, StyledButton };
