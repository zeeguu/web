import styled, { css } from "styled-components";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { blue700, orange600 } from "../../colors";
import { isMobile } from "../../../utils/misc/browserDetection";

const NavOption = styled.li`
  box-sizing: border-box;
  margin: 0.25rem 0 0.25rem;
  width: 100%;
  list-style-type: none;
`;

const FontColors = css`
  color: ${({ isOnStudentSide }) =>
    isOnStudentSide ? `${orange600}` : `${blue700}`};
`;

const Shared = css`
  box-sizing: border-box;
  display: flex;
  width: 100%;
  min-width: 3rem;
  height: 3rem;
  flex: 1;
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

  ${({ isActive }) =>
    isActive &&
    css`
      ${FontColors}
      background-color: white;
      opacity: 100%;
    `}

  &:hover {
    border: solid 0.1rem rgba(255, 255, 255, 0.9);
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
  ${Shared}
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
  ${Shared}
`;

const Span = styled.span`
  white-space: nowrap;
  opacity: ${({ visibility }) => (visibility ? (visibility ? "0" : "1") : "1")};
  transition: opacity 0.3s ease-in-out;
  @media (max-width: 992px) {
    opacity: ${!isMobile() && 0};
  }
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

export { NavOption, RouterLink, Span, IconContainer, OptionButton };
