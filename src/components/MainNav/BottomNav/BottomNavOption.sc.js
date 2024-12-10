import styled, { css } from "styled-components";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { orange600, blue700 } from "../../colors";

const OptionShared = css`
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 4rem;
  height: 3rem;
  gap: 0.2rem;
  white-space: nowrap;
  user-select: none;
  position: relative;
  -webkit-tap-highlight-color: transparent;
`;

const BottomNavOption = styled.li`
  box-sizing: border-box;
  list-style: none;
  font-weight: 700;
  font-size: 0.7rem;
  position: relative;
`;

const StyledLink = styled(Link)`
  ${OptionShared}
`;

const StyledButton = styled.button`
  background-color: inherit;
  font: inherit;
  border: inherit;
  padding: inherit;
  margin: inherit;
  ${OptionShared}
`;

const activeIconShared = css`
  background-color: white;
  color: ${({ isOnStudentSide }) =>
    isOnStudentSide ? `${orange600}` : `${blue700}`};
`;

const IconSpan = styled.span`
  position: relative;
  border-radius: 0.25rem;
  padding: 0.2rem 0.5rem;
  color: inherit;
  transition: 0.3s ease-in-out;

  ${({ isActive }) =>
    isActive &&
    css`
      ${activeIconShared}
    `}
  :active {
    ${activeIconShared}
  }
`;

export { BottomNavOption, StyledLink, StyledButton, IconSpan };
