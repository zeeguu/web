import styled, { css } from "styled-components";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { MEDIUM_WIDTH, MOBILE_WIDTH } from "./screenSize";

const NavOption = styled.li`
  box-sizing: border-box;
  margin: 0.25rem 0 0.25rem;
  width: 100%;
  list-style-type: none;
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
  color: ${({ theme }) => theme.btnContentDefault};
  background-color: ${({ theme }) => theme.btnBgDefault};
  white-space: nowrap;
  border-radius: 0.25rem;
  border: solid 0.1rem ${({ theme }) => theme.btnBorderDefault};
  transition: 0.3s ease-in-out;
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;

  ${({ $isActive }) =>
    $isActive &&
    css`
      color: ${({ theme }) => theme.btnContentActive};
      background-color: ${({ theme }) => theme.btnBgActive};
      opacity: 100%;
    `}

  &:hover {
    ${({ $screenWidth }) =>
      $screenWidth > MOBILE_WIDTH &&
      css`
        border: solid 0.1rem ${({ theme }) => theme.btnBorderHover};);
      `}
  }

  &:active {
    color: ${({ theme }) => theme.btnContentActive};
    background-color: ${({ theme }) => theme.btnBgActive};
  }

  &.logo {
    font-size: 1.5rem;
    height: 3.5rem;
    margin: 0 0 2rem 0;

    &:hover {
      border: solid 0.1rem transparent;
    }

    //logo color is always white
    &:active {
      color: ${({ theme }) => theme.btnContentDefault};
      background-color: transparent;
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
  margin: 0;
  padding: 0;

  &:hover {
    box-shadow: none;
    margin: none;
    padding: none;
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
    $screenWidth <= MEDIUM_WIDTH &&
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
    $screenWidth <= MEDIUM_WIDTH &&
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
