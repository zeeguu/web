import styled, { keyframes } from "styled-components";
import { blue700, orange600 } from "../../../colors";
import { Link } from "react-router-dom/cjs/react-router-dom";

const slideIn = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`;

const slideOut = keyframes`
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
`;

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
`;

const IconSpan = styled.span`
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

const fadeIn = keyframes`
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
`;

const fadeOut = keyframes`
from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
`;

const MoreOptionsWrapper = styled.div`
  background-color: rgba(0, 0, 0, 0.6);
  width: 100%;
  height: 100%;
  z-index: 2;
  position: absolute;
  animation: ${({ isOverlayVisible }) => (isOverlayVisible ? fadeIn : fadeOut)}
    0.3s ease-in-out forwards;
`;

const MoreOptionsPanel = styled.nav`
  opacity: 1;
  box-sizing: border-box;
  width: 100%;
  background-color: ${({ isOnStudentSide }) =>
    isOnStudentSide ? `${orange600}` : `${blue700}`};
  position: fixed;
  bottom: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  border-radius: 1rem 1rem 0 0;
  padding: 1rem 1rem 2rem 1rem;
  box-shadow: 0 -0.25rem 1.25rem rgba(0, 0, 0, 0.1);
  animation: ${({ isMoreOptionsVisible }) =>
      isMoreOptionsVisible ? slideIn : slideOut}
    0.3s ease-in-out forwards;
`;

const CloseSection = styled.div`
  width: 100%;
  display: flex;
`;

const CloseButton = styled.button`
  background-color: inherit;
  border: none;
  padding: 0;
  margin: 0 0 0 auto;
  color: white;
`;

export {
  BottomNav,
  BottomNavOption,
  StyledLink,
  IconSpan,
  MoreOptionsWrapper,
  MoreOptionsPanel,
  StyledButton,
  CloseSection,
  CloseButton,
};
