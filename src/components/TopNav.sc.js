import styled, { css } from "styled-components";

const _navbarShared = css`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  align-items: center;
  margin: 0;
  height: 4em;
`;

const TopNavWrapper = styled.div`
  ${_navbarShared};
  background-color: white;
  justify-content: center;
  background: white;
  padding: 0 3rem;

  @media (max-width: 576px) {
    padding: 0 1rem;
  }
`;

const TopNav = styled.nav`
  ${_navbarShared};
  max-width: 80rem;
`;

const NavList = styled.ul`
  all: unset;
  ${_navbarShared};
  justify-content: flex-end;
  color: white;
  font-size: 18px;
  max-width: 80rem;
  gap: 2rem;
`;

export { TopNavWrapper, TopNav, NavList };
