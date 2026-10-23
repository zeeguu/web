import styled, { css } from "styled-components";
import { Link } from "react-router-dom";

const OptionShared = css`
  color: ${({ theme }) => theme.btnContentDefault};
  background-color: ${({ theme }) => theme.btnBgDefault};
  display: flex;
  flex-direction: column;
  align-items: center;
  /* Six tabs (five plus More) share the bar: 4rem each where there is room,
     and an equal share of the bar's width (minus its 1rem of side padding,
     see BottomNav.sc) on narrower phones, where 6 x 4rem would overflow. */
  width: min(4rem, calc((100vw - 1rem) / 6));
  height: 3rem;
  gap: 0.2rem;
  font-weight: 700;
  font-size: 0.7rem;
  white-space: nowrap;
  user-select: none;
  position: relative;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
`;

const BottomNavOption = styled.li`
  box-sizing: border-box;
  list-style: none;
  position: relative;
`;

const StyledLink = styled(Link)`
  ${OptionShared}
`;

const StyledButton = styled.button`
  border: inherit;
  padding: inherit;
  margin: inherit;
  ${OptionShared}
`;

const activeIconShared = css`
  color: ${({ theme }) => theme.btnContentActive};
  background-color: ${({ theme }) => theme.btnBgActive};
`;

const IconSpan = styled.span`
  position: relative;
  border-radius: 0.25rem;
  padding: 0.2rem 0.5rem;
  color: ${({ theme }) => theme.btnContentDefault};
  transition: 0.3s ease-in-out;

  ${({ $isActive }) =>
    $isActive &&
    css`
      ${activeIconShared}
    `}
  :active {
    ${activeIconShared}
  }
`;

export { BottomNavOption, StyledLink, StyledButton, IconSpan };
