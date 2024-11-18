import styled from "styled-components";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { blue700 } from "../colors";

const NavOption = styled.li`
  box-sizing: border-box;
  margin: 0.125rem 0 0.125rem;
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
    color: ${isOnStudentSide ? "#ffa41a" : `${blue700}`};
    opacity: 100%;
  `}

  :hover {
    border: solid 0.1rem rgba(255, 255, 255, 0.9);
  }

  :active {
    background-color: white;
    color: ${({ isOnStudentSide }) =>
      isOnStudentSide ? `#ffa41a` : `${blue700}`};
    opacity: 100%;
  }
`;

const RouterLink = styled(Link)`
  font: inherit;
  height: 2.813rem;
  color: inherit;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
  gap: 0.5rem;
  /* padding: 0.75rem; */
`;

const Span = styled.span`
  white-space: nowrap;
  opacity: ${(props) => (props.visibility ? "0" : "1")};
  pointer-events: none;
  transition: opacity 0.3s ease-in-out;
  white-space: nowrap;
  @media (max-width: 768px) {
    opacity: 0;
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
`;

export { NavOption, RouterLink, Span, IconContainer, OptionButton };
