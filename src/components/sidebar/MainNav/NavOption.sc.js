import styled, { css } from "styled-components";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { blue700, orange600 } from "../../colors";

const NavOption = styled.li`
  box-sizing: border-box;
  margin: 0.25rem 0 0.25rem;
  width: 100%;
  list-style-type: none;
`;

const FontColors = css`
  color: ${({ $isOnStudentSide }) =>
    $isOnStudentSide ? `${orange600}` : `${blue700}`};
`;

const SharedStyle = css`
  box-sizing: border-box;
  display: flex;
  width: 100%;
  min-width: 3rem;
  height: 3rem;
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  white-space: nowrap;
  border-radius: 0.25rem;
  border: solid 0.1rem transparent;
  transition: 0.3s ease-in-out;
  -webkit-tap-highlight-color: transparent;

  ${({ $isActive }) =>
    $isActive &&
    css`
      ${FontColors}
      background-color: white;
      opacity: 100%;
    `}

  &:hover {
    ${({ $screenWidth }) =>
      $screenWidth > 700 &&
      css`
        border: solid 0.1rem rgba(255, 255, 255, 0.9);
      `}
  }

  &:active {
    background-color: white;
    ${FontColors};
  }

  &.logo {
    font-size: 1.5rem;
    height: 3.5rem;
    margin: 0 0 2rem 0;

    &:hover {
      border: solid 0.1rem transparent;
    }

    &:active {
      background-color: transparent;
      color: white;
    }

    img {
      width: 2rem;
      height: 2rem;
    }
  }
`;

const RouterLink = styled(Link)`
  ${SharedStyle}
`;

const OptionButton = styled.button`
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;

  &:hover {
    border: none;
    box-shadow: none;
    color: white;
  }
  ${SharedStyle}
`;

const TextWrapper = styled.span`
  white-space: nowrap;
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
  width: fit-content;
  user-select: none;

  ${({ $screenWidth }) =>
    $screenWidth <= 992 &&
    css`
      opacity: 0;
      width: 0;
    `}
`;

const IconContainer = styled.span`
  width: 2.8rem;
  min-width: 2.8rem;
  height: 2.8rem;
  min-height: 2.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const OptionContentWrapper = styled.span`
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.76rem;
  width: fit-content;
  padding: 0 1.8rem 0 0;
  height: 2rem;

  ${({ $screenWidth }) =>
    $screenWidth <= 992 &&
    css`
      padding: 0;
    `}
`;

export {
  NavOption,
  RouterLink,
  TextWrapper,
  IconContainer,
  OptionButton,
  OptionContentWrapper,
};
