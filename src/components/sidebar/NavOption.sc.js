import styled from "styled-components";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { blue700, orange600 } from "../colors";
import { isMobile } from "../../utils/misc/browserDetection";

const NavOption = styled.li`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0.25rem 0 0.25rem;
  width: 100%;
  height: 3rem;
  list-style-type: none;
  font-size: 1rem;
  color: white;
  font-weight: 600;
  border-radius: 0.25rem;
  border: solid 0.1rem transparent;
  transition: 0.3s ease-in-out;
  cursor: pointer;
  white-space: nowrap;
  ${({ isActive, isOnStudentSide }) =>
    isActive &&
    `
    background-color: white;
    color: ${isOnStudentSide ? `${orange600}` : `${blue700}`};
    opacity: 100%;
  `}

  :hover {
    border: solid 0.1rem rgba(255, 255, 255, 0.9);
  }

  :active {
    background-color: white;
    color: ${({ isOnStudentSide }) =>
      isOnStudentSide ? `${orange600}` : `${blue700}`};
  }

  &.logo {
    font-size: 1.5rem;
    height: 3.5rem;
    margin: 0 0 2rem 0;
  }

  &.logo img {
    width: 2rem;
    height: 2rem;
  }

  &.logo:hover {
    border: solid 0.1rem transparent;
  }

  &.logo:active {
    background-color: transparent;
    color: white;
  }
`;

const RouterLink = styled(Link)`
  font: inherit;
  width: 100%;
  height: 2.813rem;
  color: inherit;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
  gap: 0.5rem;
`;

const Span = styled.span`
  white-space: nowrap;
  opacity: ${({ visibility }) => (visibility ? (visibility ? "0" : "1") : "1")};
  transition: opacity 0.3s ease-in-out;
  white-space: nowrap;
  @media (max-width: 768px) {
    opacity: ${!isMobile() && 0};
  }
`;

const IconContainer = styled.span`
  width: 3rem;
  min-width: 3rem;
  height: 2.813rem;
  min-height: 2.813rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: inherit;
`;

const OptionButton = styled.button`
  font: inherit;
  color: inherit;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
  gap: 0.5rem;
  margin: inherit;
  border: none;
  background-color: transparent;
  color: inherit;
  padding: 0;
  cursor: pointer;
  width: 100%;
`;

export { NavOption, RouterLink, Span, IconContainer, OptionButton };
